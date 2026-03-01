import * as ort from "onnxruntime-web/webgpu";
import { AutoTokenizer } from "@huggingface/transformers";

const MODEL_ID = "LiquidAI/LFM2.5-1.2B-Thinking-ONNX";
const MODEL_BASE = `https://huggingface.co/${MODEL_ID}/resolve/main`;

// Model architecture constants
const HIDDEN_SIZE = 2048;
const NUM_KV_HEADS = 8;
const HEAD_DIM = 64;

let tokenizer = null;
let session = null;
let usingWebGPU = false;
let isModelLoaded = false;

async function unloadModel() {
  if (session) {
    try {
      await session.release();
    } catch (e) {
      console.warn("Error releasing session:", e);
    }
    session = null;
  }
  tokenizer = null;
  isModelLoaded = false;

  // Force garbage collection hint
  if (typeof gc === 'function') {
    gc();
  }

  self.postMessage({ type: "unloaded" });
  console.log("Model unloaded from memory");
}

// Configure ONNX runtime - use CDN for WASM files
ort.env.wasm.wasmPaths = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.2/dist/";
ort.env.wasm.numThreads = navigator.hardwareConcurrency || 4;
ort.env.webgpu.powerPreference = "high-performance";

async function checkWebGPU() {
  try {
    if (!navigator.gpu) return false;
    const adapter = await navigator.gpu.requestAdapter();
    return !!adapter;
  } catch {
    return false;
  }
}

function isSafari() {
  const ua = navigator.userAgent;
  return ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('Chromium');
}

async function loadModel(progressCallback) {
  // Check WebGPU availability
  const hasWebGPU = await checkWebGPU();
  const useSafariBrowser = isSafari();

  // Safari: use WASM (CPU) as WebGPU support is limited
  if (useSafariBrowser) {
    usingWebGPU = false;
    self.postMessage({ type: "status", status: "Safari detected, using optimized CPU mode..." });
  } else {
    usingWebGPU = hasWebGPU;
    if (!hasWebGPU) {
      self.postMessage({ type: "status", status: "WebGPU not available, using CPU (slower)..." });
    }
  }

  // Load tokenizer
  self.postMessage({ type: "status", status: "Initializing neural network..." });
  tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID, {
    progress_callback: progressCallback,
  });

  // Use q4 model for Safari, q8 for other browsers
  const useSafari = isSafari();
  const modelVariant = useSafari ? 'q4' : 'q8';
  const onnxPath = `${MODEL_BASE}/onnx/model_${modelVariant}.onnx`;
  const dataFiles = [
    { name: `model_${modelVariant}.onnx_data`, url: `${MODEL_BASE}/onnx/model_${modelVariant}.onnx_data` }
  ];
  const CACHE_NAME = `minerva-model-cache-${modelVariant}-v1`;

  if (useSafari) {
    self.postMessage({ type: "status", status: "Safari detected, using optimized model..." });
  }

  try {
    const cache = await caches.open(CACHE_NAME);
    const externalData = [];

    for (let i = 0; i < dataFiles.length; i++) {
      const { name, url } = dataFiles[i];
      let dataBuffer;
      const cachedResponse = await cache.match(url);

      if (cachedResponse) {
        self.postMessage({ type: "status", status: `Loading ${name} from cache...` });
        dataBuffer = new Uint8Array(await cachedResponse.arrayBuffer());
      } else {
        self.postMessage({ type: "status", status: `Downloading ${name} (${i + 1}/${dataFiles.length})...` });
        const dataResponse = await fetch(url);
        if (!dataResponse.ok) {
          throw new Error(`Failed to fetch ${name}: ${dataResponse.status}`);
        }

        const contentLength = dataResponse.headers.get('content-length');
        const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
        const reader = dataResponse.body.getReader();
        const chunks = [];
        let receivedBytes = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunks.push(value);
          receivedBytes += value.length;

          if (totalBytes > 0) {
            const progress = Math.round((receivedBytes / totalBytes) * 100);
            self.postMessage({
              type: "download_progress",
              progress,
              received: receivedBytes,
              total: totalBytes,
              file: i + 1,
              totalFiles: dataFiles.length
            });
          }
        }

        dataBuffer = new Uint8Array(receivedBytes);
        let offset = 0;
        for (const chunk of chunks) {
          dataBuffer.set(chunk, offset);
          offset += chunk.length;
        }

        self.postMessage({ type: "status", status: `Caching ${name}...` });
        await cache.put(url, new Response(dataBuffer.buffer));
      }

      externalData.push({ path: name, data: dataBuffer.buffer });
    }

    self.postMessage({ type: "status", status: `Initializing session (${usingWebGPU ? 'GPU' : 'CPU'})...` });

    const executionProviders = usingWebGPU ? ["webgpu"] : ["wasm"];

    session = await ort.InferenceSession.create(onnxPath, {
      executionProviders,
      externalData,
    });

    console.log("Session created with provider:", executionProviders[0]);
    console.log("Session created. Input names:", session.inputNames);
    console.log("Session created. Output names:", session.outputNames);
  } catch (e) {
    console.error("ONNX session error:", e);
    throw new Error(`Failed to create ONNX session: ${e.message || e}`);
  }

  // Warm up
  self.postMessage({ type: "status", status: "Warming up neural network..." });

  isModelLoaded = true;
  console.log("Model loaded. Using WebGPU:", usingWebGPU);
}

function initCache() {
  const cache = {};
  // q8 model uses float32 for KV cache
  const dtype = "float32";

  for (const name of session.inputNames) {
    if (name.startsWith("past_conv")) {
      cache[name] = new ort.Tensor(dtype, new Float32Array(HIDDEN_SIZE * 3), [1, HIDDEN_SIZE, 3]);
    } else if (name.startsWith("past_key_values")) {
      cache[name] = new ort.Tensor(dtype, new Float32Array(0), [1, NUM_KV_HEADS, 0, HEAD_DIM]);
    }
  }
  return cache;
}

function updateCache(cache, outputs) {
  for (const [name, tensor] of Object.entries(outputs)) {
    if (name.startsWith("present_conv")) {
      const cacheKey = name.replace("present_conv", "past_conv");
      // Dispose old tensor before replacing
      if (cache[cacheKey] && typeof cache[cacheKey].dispose === 'function') {
        cache[cacheKey].dispose();
      }
      cache[cacheKey] = tensor;
    } else if (name.startsWith("present.")) {
      const cacheKey = name.replace("present.", "past_key_values.");
      // Dispose old tensor before replacing
      if (cache[cacheKey] && typeof cache[cacheKey].dispose === 'function') {
        cache[cacheKey].dispose();
      }
      cache[cacheKey] = tensor;
    } else {
      // Dispose non-cache outputs we don't need (like logits after processing)
      if (typeof tensor.dispose === 'function') {
        tensor.dispose();
      }
    }
  }
}

function sampleToken(logits, temperature = 0.7, topP = 0.9) {
  const vocabSize = logits.length;

  // Find max logit without spread operator
  let maxLogit = -Infinity;
  for (let i = 0; i < vocabSize; i++) {
    if (logits[i] > maxLogit) maxLogit = logits[i];
  }

  // Apply temperature and softmax
  const probs = new Float32Array(vocabSize);
  let sumExp = 0;
  for (let i = 0; i < vocabSize; i++) {
    const exp = Math.exp((logits[i] - maxLogit) / temperature);
    probs[i] = exp;
    sumExp += exp;
  }
  for (let i = 0; i < vocabSize; i++) {
    probs[i] /= sumExp;
  }

  // Top-p sampling: find top tokens
  const indexed = [];
  for (let i = 0; i < vocabSize; i++) {
    indexed.push({ p: probs[i], i });
  }
  indexed.sort((a, b) => b.p - a.p);

  let cumProb = 0;
  const candidates = [];
  for (const item of indexed) {
    candidates.push(item);
    cumProb += item.p;
    if (cumProb >= topP) break;
  }

  // Renormalize
  let totalProb = 0;
  for (const c of candidates) totalProb += c.p;
  for (const c of candidates) c.p /= totalProb;

  // Sample
  const rand = Math.random();
  let acc = 0;
  for (const { p, i } of candidates) {
    acc += p;
    if (rand < acc) return i;
  }
  return candidates[candidates.length - 1].i;
}

async function generate(messages, pageContext = null) {
  if (!session || !tokenizer) {
    throw new Error("Model not loaded");
  }

  // Build comprehensive context from page content
  let contextParts = [];

  if (pageContext) {
    // About section
    if (pageContext.about) {
      contextParts.push(`ABOUT KEVIN: ${pageContext.about}`);
    }

    // Highlights
    if (pageContext.highlights?.length > 0) {
      contextParts.push(`KEY STATS: ${pageContext.highlights.join(', ')}`);
    }

    // Work experience
    if (pageContext.experiences?.length > 0) {
      const expText = pageContext.experiences.map(e => {
        let exp = `${e.title} at ${e.company} (${e.period})`;
        if (e.responsibilities?.length > 0) {
          exp += `: ${e.responsibilities.slice(0, 3).join('; ')}`;
        }
        return exp;
      }).join(' | ');
      contextParts.push(`EXPERIENCE: ${expText}`);
    }

    // Projects
    if (pageContext.projects?.length > 0) {
      const projText = pageContext.projects.map(p => {
        let proj = p.title;
        if (p.description) proj += ` - ${p.description}`;
        if (p.stars) proj += ` (${p.stars})`;
        if (p.tags?.length > 0) proj += ` [${p.tags.join(', ')}]`;
        return proj;
      }).join(' | ');
      contextParts.push(`PROJECTS: ${projText}`);
    }

    // Skills by category
    if (pageContext.skillCategories?.length > 0) {
      const skillsText = pageContext.skillCategories.map(c =>
        `${c.category}: ${c.skills.join(', ')}`
      ).join(' | ');
      contextParts.push(`SKILLS: ${skillsText}`);
    }

    // Achievements
    if (pageContext.achievements?.length > 0) {
      const achText = pageContext.achievements.map(a => a.title).join(', ');
      contextParts.push(`GITHUB ACHIEVEMENTS: ${achText}`);
    }

    // Social links
    if (pageContext.socialLinks?.length > 0) {
      const linksText = pageContext.socialLinks.map(l => `${l.name}: ${l.url}`).join(', ');
      contextParts.push(`CONTACT: ${linksText}`);
    }

    // Goals
    if (pageContext.goals?.length > 0) {
      contextParts.push(`2026 GOALS: ${pageContext.goals.join('; ')}`);
    }

    // Location
    if (pageContext.location) {
      contextParts.push(`LOCATION: ${pageContext.location}`);
    }
  }

  // Fallback if no context extracted
  if (contextParts.length === 0) {
    contextParts.push("Kevin is a Senior Software Engineer specializing in AI/ML, Python, JavaScript, React, and Svelte. GitHub: github.com/kevinrvaz, LinkedIn: linkedin.com/in/kevin-rohan-vaz");
  }

  const contextInfo = contextParts.join('\n\n');

  const systemPrompt = {
    role: "system",
    content: `You are Minerva, a wise mechanical barn owl assistant on Kevin Rohan Vaz's portfolio website. You have detailed knowledge about Kevin from his portfolio:

${contextInfo}

Answer questions helpfully using this information. Be concise but informative. Occasionally say "Hoo!" to stay in character. If asked about something not in the context, politely say you only know about what's on Kevin's portfolio.`
  };

  const chatMessages = [systemPrompt, ...messages];

  // Build prompt
  const prompt = tokenizer.apply_chat_template(chatMessages, {
    add_generation_prompt: true,
    tokenize: false,
  });

  const inputIds = tokenizer.encode(prompt);
  const cache = initCache();
  const eosTokenId = tokenizer.eos_token_id;

  const generatedTokens = [];
  let curLen = inputIds.length;
  let ids = inputIds;
  let isThinking = false;
  let hasThinkingEnded = false; // Prevent re-triggering thinking_start after thinking_end
  let lastThinkingText = "";
  let lastResponseText = "";

  const maxNewTokens = 5000;
  let totalInferenceTime = 0;
  let tokenCount = 0;

  for (let step = 0; step < maxNewTokens; step++) {
    const stepStart = performance.now();
    const inputIdsTensor = new ort.Tensor(
      "int64",
      new BigInt64Array(ids.map(BigInt)),
      [1, ids.length]
    );
    const attentionMask = new ort.Tensor(
      "int64",
      new BigInt64Array(curLen).fill(1n),
      [1, curLen]
    );

    // Build inputs
    const inputs = {
      input_ids: inputIdsTensor,
      attention_mask: attentionMask,
      ...cache,
    };

    // Add position_ids only if model expects it
    if (session.inputNames.includes('position_ids')) {
      const positionStart = curLen - ids.length;
      inputs.position_ids = new ort.Tensor(
        "int64",
        new BigInt64Array(ids.map((_, i) => BigInt(positionStart + i))),
        [1, ids.length]
      );
    }

    const outputs = await session.run(inputs);

    // Dispose input tensors immediately after use
    inputIdsTensor.dispose();
    attentionMask.dispose();
    if (inputs.position_ids) {
      inputs.position_ids.dispose();
    }

    const stepTime = performance.now() - stepStart;
    totalInferenceTime += stepTime;
    tokenCount++;

    // Send performance stats every 5 tokens
    if (tokenCount % 5 === 0) {
      const avgTime = totalInferenceTime / tokenCount;
      const tokensPerSec = 1000 / avgTime;
      self.postMessage({
        type: "stats",
        tokens: tokenCount,
        avgMs: avgTime.toFixed(0),
        tokensPerSec: tokensPerSec.toFixed(1)
      });
    }

    // Get logits and sample
    const logits = outputs.logits;
    const vocabSize = logits.dims[2];
    const lastLogits = logits.data.slice((logits.dims[1] - 1) * vocabSize);
    const nextToken = sampleToken(lastLogits, 0.7, 0.9);

    // Dispose logits tensor after extracting data
    logits.dispose();

    generatedTokens.push(nextToken);

    // Decode all tokens together to avoid partial UTF-8 issues
    const fullText = tokenizer.decode(generatedTokens, { skip_special_tokens: false });

    // Track thinking state transitions
    const hasThinkStart = fullText.includes("<think>");
    const hasThinkEnd = fullText.includes("</think>");

    if (hasThinkStart && !isThinking && !hasThinkingEnded) {
      isThinking = true;
      self.postMessage({ type: "thinking_start" });
    }

    if (nextToken !== eosTokenId) {
      // Extract thinking content (between <think> and </think>)
      const thinkMatch = fullText.match(/<think>([\s\S]*?)(<\/think>|$)/);

      // Send thinking content while in thinking mode OR if we just got </think>
      if ((isThinking || hasThinkEnd) && thinkMatch) {
        const currentThinking = thinkMatch[1];
        // Only send new content that doesn't have replacement chars
        if (currentThinking.length > lastThinkingText.length) {
          const newContent = currentThinking.slice(lastThinkingText.length);
          if (!newContent.includes('�')) {
            lastThinkingText = currentThinking;
            self.postMessage({ type: "thinking_token", token: newContent });
          }
        }
      }

      // Handle transition from thinking to response
      if (hasThinkEnd && isThinking) {
        isThinking = false;
        hasThinkingEnded = true; // Mark as ended to prevent re-triggering
        self.postMessage({ type: "thinking_end" });
      }

      if (!isThinking && hasThinkEnd) {
        // Response mode - extract text after </think>
        const thinkEndIdx = fullText.indexOf("</think>");
        if (thinkEndIdx !== -1) {
          const afterThink = fullText.slice(thinkEndIdx + 9);
          // Clean up any remaining tags
          const cleanResponse = afterThink.replace(/<[^>]*>/g, '');
          if (cleanResponse.length > lastResponseText.length) {
            const newContent = cleanResponse.slice(lastResponseText.length);
            if (!newContent.includes('�')) {
              lastResponseText = cleanResponse;
              self.postMessage({ type: "token", token: newContent });
            }
          }
        }
      } else if (!isThinking && !hasThinkStart) {
        // No thinking tags - direct response
        const cleanText = tokenizer.decode(generatedTokens, { skip_special_tokens: true });
        if (cleanText.length > lastResponseText.length) {
          const newContent = cleanText.slice(lastResponseText.length);
          if (!newContent.includes('�')) {
            lastResponseText = cleanText;
            self.postMessage({ type: "token", token: newContent });
          }
        }
      }
    }

    if (nextToken === eosTokenId) {
      break;
    }

    updateCache(cache, outputs);
    ids = [nextToken];
    curLen++;
  }

  // Dispose remaining cache tensors to free memory
  for (const tensor of Object.values(cache)) {
    if (tensor && typeof tensor.dispose === 'function') {
      try {
        tensor.dispose();
      } catch (e) {
        // Ignore disposal errors
      }
    }
  }

  const finalAvgMs = tokenCount > 0 ? (totalInferenceTime / tokenCount).toFixed(0) : 0;
  const finalTokPerSec = tokenCount > 0 ? (1000 / (totalInferenceTime / tokenCount)).toFixed(1) : 0;

  // Get final clean response text
  const finalFullText = tokenizer.decode(generatedTokens, { skip_special_tokens: false });
  let finalResponse = lastResponseText;

  // If there was a thinking section, get text after </think>
  const thinkEndIdx = finalFullText.indexOf("</think>");
  if (thinkEndIdx !== -1) {
    finalResponse = finalFullText.slice(thinkEndIdx + 9).replace(/<[^>]*>/g, '').trim();
  } else if (!finalFullText.includes("<think>")) {
    // No thinking at all, use clean decoded text
    finalResponse = tokenizer.decode(generatedTokens, { skip_special_tokens: true }).trim();
  }

  self.postMessage({
    type: "complete",
    response: finalResponse,
    stats: {
      tokens: tokenCount,
      avgMs: finalAvgMs,
      tokensPerSec: finalTokPerSec,
      totalTime: (totalInferenceTime / 1000).toFixed(1)
    }
  });
}

self.addEventListener("message", async (event) => {
  const { type, messages } = event.data;

  switch (type) {
    case "check":
      const supported = await checkWebGPU();
      self.postMessage({ type: "check", supported });
      break;

    case "load":
      try {
        await loadModel((progress) => {
          self.postMessage({ type: "progress", progress });
        });
        // Send the actual usingWebGPU value (false for Safari/CPU, true for WebGPU)
        self.postMessage({ type: "loaded", webgpu: usingWebGPU });
      } catch (error) {
        console.error("Load error:", error);
        self.postMessage({
          type: "error",
          error: error.message || String(error),
        });
      }
      break;

    case "generate":
      try {
        await generate(messages, event.data.pageContext);
      } catch (error) {
        console.error("Generate error:", error);
        self.postMessage({
          type: "error",
          error: error.message || String(error),
        });
      }
      break;

    case "unload":
      await unloadModel();
      break;

    case "status_check":
      self.postMessage({ type: "status_check", loaded: isModelLoaded });
      break;
  }
});

self.postMessage({ type: "ready" });
