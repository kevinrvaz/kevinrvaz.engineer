<script>
  import { onMount, tick } from 'svelte';

  let isDesktop = false;
  let isHovered = false;
  let isOpen = false;
  let userInput = '';
  let messages = [];
  let isTyping = false;
  let isLoading = false;
  let loadingProgress = '';
  let downloadPercent = 0;
  let chatMessagesEl;
  let worker = null;
  let webGPUSupported = false;
  let modelLoaded = false;
  let hasLoadedOnce = false;
  let usingCPU = false;
  let unloadTimeout = null;
  const UNLOAD_DELAY = 2 * 60 * 1000; // 2 minutes of inactivity
  let currentResponse = '';
  let currentThinking = '';
  let savedThinking = ''; // Preserve thinking content after thinking_end
  let decodingText = '';
  let decodingDisplay = '';
  let responseDecodingText = '';
  let responseDecodingDisplay = '';
  let isCurrentlyThinking = false;
  let currentStats = null;
  let decodeTimeout = null;
  let decodeInterval = null;
  let responseDecodeTimeout = null;
  let responseDecodeInterval = null;

  // Speech recognition
  let isListening = false;
  let speechRecognition = null;
  let speechSupported = false;
  let audioContext = null;
  let analyser = null;
  let audioStream = null;
  let audioLevels = [0, 0, 0, 0, 0];
  let animationFrameId = null;

  // Speech synthesis
  let speechSynthesis = null;
  let speechSynthSupported = false;
  let femaleVoice = null;
  let speakingMessageIndex = -1;
  let isSpeaking = false;

  // Thought bubble
  let showThoughtBubble = false;
  let thoughtBubbleTimeout = null;

  // Owl visibility and fly-in/out animation
  let owlVisible = false;
  let hasFlownIn = false;
  let isFlyingOut = false;

  const scrambleChars = '0123456789ABCDEFabcdef!@#$%^&*<>[]{}';

  function scrambleText(text) {
    return text.split('').map(() =>
      scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
    ).join('');
  }

  const greetings = [
    "Hoo hoo! I'm Minerva, Kevin's wise owl assistant. How can I help you today?",
    "Welcome! I'm Minerva. Ask me anything about Kevin's work and experience!",
    "Hoo! Minerva here. I'd love to tell you about Kevin's projects and skills!"
  ];

  onMount(() => {
    // Check if Safari browser
    const isSafari = () => {
      const ua = navigator.userAgent;
      return ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('Chromium');
    };

    // Don't initialize on Safari due to memory issues
    if (isSafari()) {
      return () => {};
    }

    // Check if desktop environment (screen width >= 1024px and no touch)
    const checkDesktop = () => {
      const minWidth = window.innerWidth >= 1024;
      const noTouch = !('ontouchstart' in window) && !navigator.maxTouchPoints;
      return minWidth || noTouch;
    };

    isDesktop = checkDesktop();

    // Don't initialize on mobile/tablet
    if (!isDesktop) {
      return () => {};
    }

    worker = new Worker(
      new URL('../lib/minervaWorker.js', import.meta.url),
      { type: 'module' }
    );

    worker.addEventListener('message', handleWorkerMessage);
    worker.addEventListener('error', (e) => {
      console.error('Worker error event:', e);
      isLoading = false;
      isTyping = false;
    });

    worker.postMessage({ type: 'check' });

    // Watch for About section to trigger owl fly-in/out
    let scrollHandler = () => {
      const aboutSection = document.querySelector('#about');
      if (!aboutSection) return;

      const rect = aboutSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isAboutVisible = rect.top < windowHeight * 0.8;

      // Flying in: About section enters viewport
      if (isAboutVisible && !owlVisible && !isFlyingOut) {
        owlVisible = true;
        hasFlownIn = false;
        setTimeout(() => {
          hasFlownIn = true;
        }, 1200); // Match animation duration
      }

      // Flying out: Scrolled back up past About section (only if not chat open)
      if (!isAboutVisible && owlVisible && hasFlownIn && !isOpen && !isFlyingOut) {
        isFlyingOut = true;
        setTimeout(() => {
          owlVisible = false;
          hasFlownIn = false;
          isFlyingOut = false;
        }, 800); // Match fly-out animation duration
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler(); // Check initial position

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      speechSupported = true;
      speechRecognition = new SpeechRecognition();
      speechRecognition.continuous = false;
      speechRecognition.interimResults = true;
      speechRecognition.lang = 'en-US';

      speechRecognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        userInput = transcript;

        // Auto-send when final result
        if (event.results[event.results.length - 1].isFinal) {
          isListening = false;
          stopAudioVisualization();
          if (userInput.trim()) {
            sendMessage();
          }
        }
      };

      speechRecognition.onend = () => {
        isListening = false;
        stopAudioVisualization();
      };

      speechRecognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        isListening = false;
        stopAudioVisualization();
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis = window.speechSynthesis;
      speechSynthSupported = true;

      // Load voices (may be async)
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices();
        // Find a female English voice
        femaleVoice = voices.find(v =>
          v.lang.startsWith('en') &&
          (v.name.toLowerCase().includes('female') ||
           v.name.toLowerCase().includes('samantha') ||
           v.name.toLowerCase().includes('victoria') ||
           v.name.toLowerCase().includes('karen') ||
           v.name.toLowerCase().includes('moira') ||
           v.name.toLowerCase().includes('tessa') ||
           v.name.toLowerCase().includes('fiona') ||
           v.name.toLowerCase().includes('veena') ||
           v.name.includes('Google UK English Female') ||
           v.name.includes('Google US English'))
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
      };

      loadVoices();
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (worker) {
        worker.terminate();
      }
      if (speechRecognition) {
        speechRecognition.abort();
      }
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
      if (unloadTimeout) {
        clearTimeout(unloadTimeout);
      }
      if (thoughtBubbleTimeout) {
        clearTimeout(thoughtBubbleTimeout);
      }
      stopAudioVisualization();
    };
  });

  function scheduleUnload() {
    if (unloadTimeout) {
      clearTimeout(unloadTimeout);
    }
    unloadTimeout = setTimeout(() => {
      if (modelLoaded && !isTyping) {
        console.log("Unloading model due to inactivity...");
        worker.postMessage({ type: 'unload' });
      }
    }, UNLOAD_DELAY);
  }

  function cancelUnload() {
    if (unloadTimeout) {
      clearTimeout(unloadTimeout);
      unloadTimeout = null;
    }
  }

  function handleWorkerMessage(event) {
    const { type, token, response, progress, supported, error } = event.data;

    switch (type) {
      case 'check':
        webGPUSupported = supported;
        break;

      case 'progress':
        if (progress.status === 'progress' && progress.progress) {
          const percent = Math.round(progress.progress);
          loadingProgress = `Downloading... ${percent}%`;
        } else if (progress.status === 'done') {
          loadingProgress = 'Processing...';
        }
        break;

      case 'status':
        loadingProgress = event.data.status || 'Loading...';
        downloadPercent = 0;
        break;

      case 'download_progress':
        downloadPercent = event.data.progress;
        const mb = (event.data.received / (1024 * 1024)).toFixed(1);
        const totalMb = (event.data.total / (1024 * 1024)).toFixed(0);
        loadingProgress = `Downloading... ${mb}/${totalMb} MB`;
        break;

      case 'loaded':
        modelLoaded = true;
        hasLoadedOnce = true;
        isLoading = false;
        loadingProgress = '';
        usingCPU = !event.data.webgpu;
        scheduleUnload();

        // Show thought bubble for 4 seconds
        showThoughtBubble = true;
        if (thoughtBubbleTimeout) clearTimeout(thoughtBubbleTimeout);
        thoughtBubbleTimeout = setTimeout(() => {
          showThoughtBubble = false;
        }, 4000);
        break;

      case 'unloaded':
        modelLoaded = false;
        console.log("Model unloaded from memory");
        break;

      case 'thinking_start':
        isCurrentlyThinking = true;
        currentThinking = '';
        updateLastMessage();
        break;

      case 'thinking_token':
        currentThinking += token;
        decodingText = token;

        // Scramble animation - cycle through random characters
        if (decodeInterval) clearInterval(decodeInterval);
        if (decodeTimeout) clearTimeout(decodeTimeout);

        let iterations = 0;
        const maxIterations = 4;
        decodingDisplay = scrambleText(token);
        updateLastMessage();
        tick().then(scrollToBottom);

        decodeInterval = setInterval(() => {
          iterations++;
          if (iterations < maxIterations) {
            decodingDisplay = scrambleText(token);
          } else {
            decodingDisplay = token;
          }
          updateLastMessage();
        }, 40);

        decodeTimeout = setTimeout(() => {
          if (decodeInterval) clearInterval(decodeInterval);
          decodingText = '';
          decodingDisplay = '';
          updateLastMessage();
        }, 200);
        break;

      case 'thinking_end':
        isCurrentlyThinking = false;
        savedThinking = currentThinking; // Preserve thinking content
        if (decodeInterval) clearInterval(decodeInterval);
        if (decodeTimeout) clearTimeout(decodeTimeout);
        decodingText = '';
        decodingDisplay = '';
        updateLastMessage();
        break;

      case 'token':
        currentResponse += token;
        responseDecodingText = token;

        // Scramble animation for response tokens
        if (responseDecodeInterval) clearInterval(responseDecodeInterval);
        if (responseDecodeTimeout) clearTimeout(responseDecodeTimeout);

        let respIterations = 0;
        const respMaxIterations = 4;
        responseDecodingDisplay = scrambleText(token);
        updateLastMessage();
        tick().then(scrollToBottom);

        responseDecodeInterval = setInterval(() => {
          respIterations++;
          if (respIterations < respMaxIterations) {
            responseDecodingDisplay = scrambleText(token);
          } else {
            responseDecodingDisplay = token;
          }
          updateLastMessage();
        }, 40);

        responseDecodeTimeout = setTimeout(() => {
          if (responseDecodeInterval) clearInterval(responseDecodeInterval);
          responseDecodingText = '';
          responseDecodingDisplay = '';
          updateLastMessage();
        }, 200);
        break;

      case 'stats':
        currentStats = event.data;
        // Update live stats on message
        if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
          messages[messages.length - 1].liveStats = currentStats;
          messages = [...messages];
        }
        break;

      case 'complete':
        isTyping = false;
        // Show full response and stats
        if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
          messages[messages.length - 1].content = currentResponse.trim();
          messages[messages.length - 1].stats = event.data.stats;
          messages[messages.length - 1].isGenerating = false;
          // Preserve thinking content using savedThinking if currentThinking is empty
          messages[messages.length - 1].thinking = currentThinking.trim() || savedThinking.trim() || null;
          messages = [...messages];
        }
        currentResponse = '';
        currentThinking = '';
        savedThinking = '';
        decodingText = '';
        decodingDisplay = '';
        responseDecodingText = '';
        responseDecodingDisplay = '';
        isCurrentlyThinking = false;
        currentStats = null;
        if (decodeInterval) clearInterval(decodeInterval);
        if (decodeTimeout) clearTimeout(decodeTimeout);
        if (responseDecodeInterval) clearInterval(responseDecodeInterval);
        if (responseDecodeTimeout) clearTimeout(responseDecodeTimeout);
        tick().then(scrollToBottom);
        scheduleUnload();
        break;

      case 'error':
        console.error('Worker error:', error);
        isTyping = false;
        isLoading = false;
        modelLoaded = false;
        if (messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !messages[messages.length - 1].content) {
          messages = messages.slice(0, -1);
        }
        messages = [...messages, {
          role: 'assistant',
          content: "Hoo... I couldn't load my AI brain. Let me help you the old-fashioned way! Ask me about Kevin's skills, projects, or how to contact him.",
          thinking: null
        }];
        break;
    }
  }

  function updateLastMessage() {
    if (messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
      // Use savedThinking if currentThinking is empty (after thinking_end)
      const thinkingContent = currentThinking.trim() || savedThinking.trim() || null;
      messages[messages.length - 1].thinking = thinkingContent;
      messages[messages.length - 1].decodingText = decodingText;
      messages[messages.length - 1].decodingDisplay = decodingDisplay;
      messages[messages.length - 1].content = currentResponse.trim();
      messages[messages.length - 1].responseDecodingText = responseDecodingText;
      messages[messages.length - 1].responseDecodingDisplay = responseDecodingDisplay;
      messages[messages.length - 1].isThinking = isCurrentlyThinking;
      messages[messages.length - 1].liveStats = currentStats;
      messages = [...messages];
    }
  }

  async function handleClick() {
    isOpen = !isOpen;
    if (isOpen && messages.length === 0) {
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      messages = [{ role: 'assistant', content: greeting, thinking: null }];

      if (!modelLoaded && !isLoading) {
        isLoading = true;
        loadingProgress = 'Initializing...';
        worker.postMessage({ type: 'load' });
      }
    }
  }

  function getFallbackResponse(input) {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('skill') || lowerInput.includes('tech') || lowerInput.includes('stack')) {
      return "Kevin is skilled in Python, JavaScript, TypeScript, React, Svelte, Node.js, and has experience with AI/ML, data science, and full-stack development!";
    }
    if (lowerInput.includes('experience') || lowerInput.includes('work') || lowerInput.includes('job')) {
      return "Kevin has experience in software engineering, AI/ML development, and building web applications. Check out the Experience section!";
    }
    if (lowerInput.includes('project') || lowerInput.includes('built')) {
      return "Kevin has worked on various projects including AI applications and web development. Visit the Projects section to see them!";
    }
    if (lowerInput.includes('contact') || lowerInput.includes('reach') || lowerInput.includes('hire')) {
      return "You can reach Kevin through LinkedIn at linkedin.com/in/kevin-rohan-vaz or check out his GitHub at github.com/kevinrvaz";
    }
    if (lowerInput.includes('goal') || lowerInput.includes('2026')) {
      return "Kevin's 2026 goals include contributing more to Open Source projects and building a compiler for an esoteric programming language!";
    }
    if (lowerInput.includes('github')) {
      return "Kevin's GitHub is github.com/kevinrvaz - lots of interesting projects there!";
    }
    if (lowerInput.includes('linkedin')) {
      return "Connect with Kevin on LinkedIn: linkedin.com/in/kevin-rohan-vaz";
    }
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "Hoo hoo! Hello there! What would you like to know about Kevin?";
    }

    return "Hoo! I can tell you about Kevin's skills, projects, experience, or how to contact him. What interests you?";
  }

  async function sendMessage() {
    if (!userInput.trim() || isTyping || isLoading) return;

    // Cancel any pending unload
    cancelUnload();

    const userMessage = userInput.trim();
    userInput = '';

    messages = [...messages, { role: 'user', content: userMessage }];

    await tick();
    scrollToBottom();

    // If model was unloaded, reload it first
    if (!modelLoaded && !isLoading) {
      isLoading = true;
      loadingProgress = 'Reloading neural network...';
      worker.postMessage({ type: 'load' });

      // Wait for model to load, then send message
      const waitForLoad = () => {
        return new Promise((resolve) => {
          const checkLoaded = () => {
            if (modelLoaded) {
              resolve();
            } else if (!isLoading) {
              resolve(); // Loading failed
            } else {
              setTimeout(checkLoaded, 100);
            }
          };
          checkLoaded();
        });
      };

      await waitForLoad();
    }

    isTyping = true;
    currentResponse = '';
    currentThinking = '';

    if (modelLoaded) {
      messages = [...messages, { role: 'assistant', content: '', thinking: null, isThinking: false, isGenerating: true }];

      const chatHistory = messages
        .filter(m => m.role === 'user' || (m.role === 'assistant' && m.content))
        .map(m => ({ role: m.role, content: m.content }));

      // Extract page context for the model
      const pageContext = extractPageContext();

      worker.postMessage({ type: 'generate', messages: chatHistory, pageContext });
    } else {
      setTimeout(async () => {
        const response = getFallbackResponse(userMessage);
        isTyping = false;
        messages = [...messages, { role: 'assistant', content: response, thinking: null }];
        await tick();
        scrollToBottom();
      }, 600 + Math.random() * 400);
    }
  }

  function scrollToBottom() {
    if (chatMessagesEl) {
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  async function startAudioVisualization() {
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 32;

      const source = audioContext.createMediaStreamSource(audioStream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      function updateLevels() {
        if (!isListening) return;

        analyser.getByteFrequencyData(dataArray);

        // Get 5 frequency bands for visualization
        const bandSize = Math.floor(bufferLength / 5);
        audioLevels = Array.from({ length: 5 }, (_, i) => {
          const start = i * bandSize;
          const end = start + bandSize;
          const avg = dataArray.slice(start, end).reduce((a, b) => a + b, 0) / bandSize;
          return Math.min(100, (avg / 255) * 100);
        });

        animationFrameId = requestAnimationFrame(updateLevels);
      }

      updateLevels();
    } catch (e) {
      console.error('Audio visualization error:', e);
    }
  }

  function stopAudioVisualization() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      audioStream = null;
    }
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
    audioLevels = [0, 0, 0, 0, 0];
  }

  function toggleSpeechRecognition() {
    if (!speechSupported || !speechRecognition) return;

    if (isListening) {
      speechRecognition.stop();
      stopAudioVisualization();
      isListening = false;
    } else {
      try {
        speechRecognition.start();
        isListening = true;
        startAudioVisualization();
      } catch (e) {
        console.error('Speech recognition start error:', e);
      }
    }
  }

  function toggleThinking(index) {
    messages[index].showThinking = !messages[index].showThinking;
    messages = [...messages];
  }

  function speakMessage(index) {
    if (!speechSynthSupported || !speechSynthesis) return;

    const message = messages[index];
    if (!message || !message.content) return;

    // If already speaking this message, stop it
    if (isSpeaking && speakingMessageIndex === index) {
      stopSpeaking();
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message.content);

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      isSpeaking = true;
      speakingMessageIndex = index;
    };

    utterance.onend = () => {
      isSpeaking = false;
      speakingMessageIndex = -1;
    };

    utterance.onerror = () => {
      isSpeaking = false;
      speakingMessageIndex = -1;
    };

    speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if (speechSynthesis) {
      speechSynthesis.cancel();
    }
    isSpeaking = false;
    speakingMessageIndex = -1;
  }

  function extractPageContext() {
    // Comprehensive context extraction for Minerva

    // About section
    const aboutSection = document.querySelector('#about');
    const aboutText = aboutSection?.querySelector('.about-text')?.textContent?.replace(/\s+/g, ' ')?.trim() || '';

    // Highlights (years experience, repos, etc.)
    const highlights = [];
    document.querySelectorAll('.highlight-card').forEach(card => {
      const number = card.querySelector('.number')?.textContent?.trim();
      const label = card.querySelector('.label')?.textContent?.trim();
      if (number && label) highlights.push(`${number} ${label}`);
    });

    // Experience - detailed work history
    const experiences = [];
    document.querySelectorAll('.timeline-item, .timeline-content').forEach(item => {
      const title = item.querySelector('h3')?.textContent?.trim();
      const company = item.querySelector('.company')?.textContent?.trim();
      const period = item.querySelector('.period')?.textContent?.trim();
      const location = item.querySelector('.location')?.textContent?.trim();
      const bullets = [];
      item.querySelectorAll('li').forEach(li => bullets.push(li.textContent?.trim()));
      if (title && company) {
        experiences.push({ title, company, period, location, responsibilities: bullets });
      }
    });

    // Projects - all projects with details
    const projects = [];
    document.querySelectorAll('.project-card').forEach(card => {
      const title = card.querySelector('h3, h4')?.textContent?.trim();
      const description = card.querySelector('p')?.textContent?.trim();
      const stars = card.querySelector('.stars')?.textContent?.trim();
      const tags = [];
      card.querySelectorAll('.tag').forEach(tag => tags.push(tag.textContent?.trim()));
      const github = card.querySelector('a[href*="github"]')?.getAttribute('href');
      if (title) {
        projects.push({ title, description, stars, tags, github });
      }
    });

    // Skills by category
    const skillCategories = [];
    document.querySelectorAll('.skill-category').forEach(cat => {
      const category = cat.querySelector('h3')?.textContent?.trim();
      const skills = [];
      cat.querySelectorAll('.skill').forEach(s => skills.push(s.textContent?.trim()));
      if (category && skills.length) skillCategories.push({ category, skills });
    });

    // Achievements
    const achievements = [];
    document.querySelectorAll('.achievement').forEach(ach => {
      const title = ach.querySelector('h4')?.textContent?.trim();
      const desc = ach.querySelector('p')?.textContent?.trim();
      if (title) achievements.push({ title, description: desc });
    });

    // Contact/Social links
    const socialLinks = [];
    document.querySelectorAll('.social-link').forEach(link => {
      const name = link.querySelector('span')?.textContent?.trim();
      const url = link.getAttribute('href');
      if (name && url) socialLinks.push({ name, url });
    });

    // Goals
    const goals = [];
    document.querySelectorAll('.goals-section li').forEach(li => {
      goals.push(li.textContent?.trim());
    });

    // Location
    const location = document.querySelector('.location span')?.textContent?.trim();

    return {
      about: aboutText,
      highlights,
      experiences,
      projects,
      skillCategories,
      achievements,
      socialLinks,
      goals,
      location,
      pageTitle: document.title
    };
  }
</script>

{#if isDesktop && owlVisible}
<div class="owl-chat-container" class:flying-in={!hasFlownIn && !isFlyingOut} class:landed={hasFlownIn && !isFlyingOut} class:flying-out={isFlyingOut}>
  <button
    class="owl-button"
    class:hovered={isHovered}
    class:open={isOpen}
    class:with-nest={!isOpen}
    on:mouseenter={() => isHovered = true}
    on:mouseleave={() => isHovered = false}
    on:click={handleClick}
    aria-label="Chat with Minerva"
  >
    {#if isOpen}
      <svg viewBox="0 0 24 24" class="close-icon">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
      </svg>
    {:else}
      <svg viewBox="0 0 100 108" class="owl-svg">
        <!-- Antenna/Ears with tech details -->
        <polygon class="mech-ear left-ear" points="22,28 28,8 32,12 30,28" />
        <polygon class="mech-ear right-ear" points="78,28 72,8 68,12 70,28" />
        <circle class="antenna-tip" cx="28" cy="8" r="3" />
        <circle class="antenna-tip" cx="72" cy="8" r="3" />
        <line class="antenna-glow" x1="28" y1="11" x2="28" y2="18" />
        <line class="antenna-glow" x1="72" y1="11" x2="72" y2="18" />

        <!-- Main body shell - hexagonal/angular -->
        <path class="mech-body" d="M50,12 L78,25 L85,55 L78,85 L50,95 L22,85 L15,55 L22,25 Z" />

        <!-- Face plate with panel lines -->
        <path class="face-plate" d="M50,18 L72,28 L78,50 L72,75 L50,85 L28,75 L22,50 L28,28 Z" />
        <path class="panel-line" d="M50,18 L50,35" />
        <path class="panel-line" d="M28,50 L38,50" />
        <path class="panel-line" d="M62,50 L72,50" />

        <!-- Eye housings - mechanical sockets -->
        <polygon class="eye-housing left-housing" points="35,32 48,38 48,55 35,60 22,55 22,38" />
        <polygon class="eye-housing right-housing" points="65,32 78,38 78,55 65,60 52,55 52,38" />

        <!-- Inner eye rings -->
        <circle class="eye-ring" cx="35" cy="46" r="12" />
        <circle class="eye-ring" cx="65" cy="46" r="12" />

        <!-- LED Eyes with scanning effect -->
        <circle class="mech-eye left-eye" cx="35" cy="46" r="9" />
        <circle class="mech-eye right-eye" cx="65" cy="46" r="9" />

        <!-- Pupil cores -->
        <circle class="mech-pupil" cx="35" cy="46" r="4" />
        <circle class="mech-pupil" cx="65" cy="46" r="4" />

        <!-- Scanning lines in eyes -->
        <line class="scan-line" x1="28" y1="46" x2="42" y2="46" />
        <line class="scan-line" x1="58" y1="46" x2="72" y2="46" />

        <!-- Eye shine/reflection -->
        <circle class="mech-shine" cx="32" cy="43" r="2" />
        <circle class="mech-shine" cx="62" cy="43" r="2" />

        <!-- Beak - angular/mechanical -->
        <path class="mech-beak" d="M50,58 L44,66 L50,78 L56,66 Z" />
        <line class="beak-detail" x1="50" y1="62" x2="50" y2="74" />

        <!-- Chest vents/grille -->
        <path class="vent-line" d="M38,82 L62,82" />
        <path class="vent-line" d="M40,86 L60,86" />
        <path class="vent-line" d="M42,90 L58,90" />

        <!-- Corner rivets/bolts -->
        <circle class="rivet" cx="28" cy="28" r="2" />
        <circle class="rivet" cx="72" cy="28" r="2" />
        <circle class="rivet" cx="22" cy="55" r="2" />
        <circle class="rivet" cx="78" cy="55" r="2" />
        <circle class="rivet" cx="28" cy="75" r="2" />
        <circle class="rivet" cx="72" cy="75" r="2" />

        <!-- Circuit traces -->
        <path class="circuit-trace" d="M28,32 L22,38 L22,48" />
        <path class="circuit-trace" d="M72,32 L78,38 L78,48" />

        <!-- Nest at the bottom - woven bowl shape -->
        <g class="nest">
          <!-- Nest bowl base/shadow -->
          <ellipse class="nest-shadow" cx="50" cy="102" rx="38" ry="6" />

          <!-- Back layer of twigs -->
          <path class="nest-twig-back" d="M12,94 Q25,88 38,92 Q50,86 62,92 Q75,88 88,94" />
          <path class="nest-twig-back" d="M15,96 Q30,90 45,95 Q55,89 70,94 Q82,91 85,96" />

          <!-- Nest bowl shape -->
          <path class="nest-bowl" d="M8,96 Q8,104 20,106 Q35,108 50,108 Q65,108 80,106 Q92,104 92,96 Q85,92 75,91 Q60,89 50,89 Q40,89 25,91 Q15,92 8,96 Z" />

          <!-- Middle layer twigs - woven effect -->
          <path class="nest-twig" d="M10,97 Q22,93 32,98 Q42,94 52,99 Q62,94 72,98 Q82,95 90,97" />
          <path class="nest-twig" d="M14,100 Q28,96 40,101 Q50,97 60,101 Q72,97 86,100" />
          <path class="nest-twig" d="M18,103 Q32,99 44,103 Q54,100 66,103 Q78,100 82,103" />

          <!-- Front rim twigs -->
          <path class="nest-twig-front" d="M6,95 Q18,91 30,96 Q42,92 50,96 Q58,92 70,96 Q82,91 94,95" />
          <path class="nest-twig-front" d="M12,98 Q24,94 36,99 Q48,95 60,99 Q72,95 88,98" />

          <!-- Stray twigs sticking out -->
          <path class="nest-stray" d="M8,94 L4,90" />
          <path class="nest-stray" d="M92,94 L96,89" />
          <path class="nest-stray" d="M20,92 L17,87" />
          <path class="nest-stray" d="M80,92 L84,88" />
          <path class="nest-stray" d="M14,96 L9,93" />
          <path class="nest-stray" d="M86,96 L92,93" />
        </g>
      </svg>
    {/if}
  </button>

  {#if isOpen}
    <div class="chat-window">
      <div class="chat-header">
        <div class="header-owl">
          {#if showThoughtBubble}
            <div class="thought-bubble">
              <span>Oh I'm alive!</span>
              <div class="thought-dots">
                <span class="thought-dot"></span>
                <span class="thought-dot"></span>
                <span class="thought-dot"></span>
              </div>
            </div>
          {/if}
          <svg viewBox="0 0 100 100" class="mini-owl">
            <!-- Antenna tips -->
            <circle class="mini-antenna" cx="30" cy="12" r="3" />
            <circle class="mini-antenna" cx="70" cy="12" r="3" />
            <line class="mini-antenna-line" x1="30" y1="15" x2="30" y2="25" />
            <line class="mini-antenna-line" x1="70" y1="15" x2="70" y2="25" />
            <!-- Angular body -->
            <path class="mini-body" d="M50,15 L75,28 L82,55 L75,82 L50,92 L25,82 L18,55 L25,28 Z" />
            <!-- Face plate -->
            <path class="mini-face" d="M50,22 L68,30 L73,52 L68,72 L50,80 L32,72 L27,52 L32,30 Z" />
            <!-- Eye housings -->
            <polygon class="mini-eye-housing" points="35,35 45,40 45,55 35,58 25,55 25,40" />
            <polygon class="mini-eye-housing" points="65,35 75,40 75,55 65,58 55,55 55,40" />
            <!-- LED eyes -->
            <circle class="mini-eye" cx="35" cy="47" r="8" />
            <circle class="mini-eye" cx="65" cy="47" r="8" />
            <circle class="mini-pupil" cx="35" cy="47" r="3" />
            <circle class="mini-pupil" cx="65" cy="47" r="3" />
            <!-- Beak -->
            <path class="mini-beak" d="M50,60 L45,68 L50,78 L55,68 Z" />
          </svg>
        </div>
        <div class="header-info">
          <span class="header-name">Minerva</span>
          <span class="header-status">
            {#if isLoading}
              Loading neural network...
            {:else if modelLoaded}
              AI Powered {usingCPU ? '(CPU)' : '(GPU)'}
            {:else}
              Online
            {/if}
          </span>
        </div>
        {#if modelLoaded}
          <div class="ai-badge" class:cpu={usingCPU}>{usingCPU ? 'CPU' : 'GPU'}</div>
        {/if}
      </div>

      {#if usingCPU && modelLoaded}
        <div class="cpu-disclaimer">
          Running on CPU mode for best compatibility.
        </div>
      {/if}

      {#if isLoading}
        <div class="loading-overlay">
          <div class="loading-spinner"></div>
          <p class="loading-text">{loadingProgress}</p>
          {#if downloadPercent > 0}
            <div class="progress-bar-container">
              <div class="progress-bar" style="width: {downloadPercent}%"></div>
            </div>
            <p class="loading-subtext">{downloadPercent}%</p>
          {:else}
            <p class="loading-subtext">First load may take a moment</p>
          {/if}
        </div>
      {/if}

      <div class="chat-messages" bind:this={chatMessagesEl}>
        {#each messages as message, index}
          <div class="message {message.role}">
            {#if message.role === 'assistant' && message.thinking}
              <div class="thinking-section" class:expanded={message.showThinking}>
                <button class="thinking-toggle" on:click={() => toggleThinking(index)}>
                  <span class="thinking-icon">{message.showThinking ? '▼' : '▶'}</span>
                  <span>{#if message.isGenerating}Thinking{#if message.isThinking}<span class="thinking-dots"></span>{/if}{:else}Thoughts{/if}</span>
                </button>
                {#if message.showThinking}
                  <div class="thinking-content">{#if message.decodingText && message.thinking}{message.thinking.slice(0, -message.decodingText.length)}<span class="decoding-text">{message.decodingDisplay || message.decodingText}</span>{:else}{message.thinking}{/if}</div>
                {/if}
              </div>
            {:else if message.role === 'assistant' && message.isThinking && !message.thinking}
              <div class="thinking-section active">
                <span class="thinking-label">Thinking<span class="thinking-dots"></span></span>
              </div>
            {/if}
            <div class="message-content">
              {#if message.role === 'assistant' && message.isGenerating}
                {#if message.content}
                  {#if message.responseDecodingText}{message.content.slice(0, -message.responseDecodingText.length)}<span class="decoding-text">{message.responseDecodingDisplay || message.responseDecodingText}</span>{:else}{message.content}{/if}
                {:else}
                  <div class="generating-dots">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                  </div>
                {/if}
              {:else if message.content}
                {message.content}
              {:else if message.role === 'assistant' && !message.isThinking}
                <span class="cursor-blink"></span>
              {/if}
            </div>
            {#if message.role === 'assistant' && (message.liveStats || message.stats)}
              <div class="message-stats">
                {#if message.stats}
                  <span class="stat">{message.stats.tokens} tokens</span>
                  <span class="stat-divider">·</span>
                  <span class="stat">{message.stats.tokensPerSec} tok/s</span>
                  <span class="stat-divider">·</span>
                  <span class="stat">{message.stats.totalTime}s</span>
                {:else if message.liveStats}
                  <span class="stat live">{message.liveStats.tokens} tokens</span>
                  <span class="stat-divider">·</span>
                  <span class="stat live">{message.liveStats.tokensPerSec} tok/s</span>
                {/if}
              </div>
            {/if}
            {#if message.role === 'assistant' && message.content && !message.isGenerating && speechSynthSupported}
              <button
                class="speak-button"
                class:speaking={isSpeaking && speakingMessageIndex === index}
                on:click={() => speakMessage(index)}
                aria-label={isSpeaking && speakingMessageIndex === index ? "Stop speaking" : "Read aloud"}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  {#if isSpeaking && speakingMessageIndex === index}
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  {:else}
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  {/if}
                </svg>
                <span>{isSpeaking && speakingMessageIndex === index ? 'Stop' : 'Listen'}</span>
              </button>
            {/if}
          </div>
        {/each}
      </div>

      <div class="chat-input-container">
        {#if isListening}
          <div class="audio-wave-container">
            <div class="audio-wave">
              {#each audioLevels as level, i}
                <div
                  class="wave-bar"
                  style="height: {Math.max(4, level * 0.8)}px; animation-delay: {i * 0.1}s"
                ></div>
              {/each}
            </div>
            <span class="listening-text">{userInput || "Listening..."}</span>
          </div>
        {:else}
          <input
            type="text"
            class="chat-input"
            placeholder="Ask Minerva something..."
            bind:value={userInput}
            on:keydown={handleKeydown}
            disabled={isTyping}
          />
        {/if}
        {#if speechSupported}
          <button
            class="mic-button"
            class:listening={isListening}
            on:click={toggleSpeechRecognition}
            disabled={isTyping}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              {#if isListening}
                <rect x="6" y="6" width="12" height="12" rx="2" />
              {:else}
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
              {/if}
            </svg>
          </button>
        {/if}
        <button class="send-button" on:click={sendMessage} disabled={!userInput.trim() || isTyping}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </div>
  {/if}
</div>
{/if}

<style>
  .owl-chat-container {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 1000;
  }

  /* Owl fly-in animation */
  .owl-chat-container.flying-in {
    animation: owl-fly-in 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .owl-chat-container.flying-in .owl-button {
    animation: owl-flap 0.15s ease-in-out infinite;
  }

  .owl-chat-container.landed .owl-button {
    animation: owl-land 0.3s ease-out forwards;
  }

  @keyframes owl-fly-in {
    0% {
      transform: translate(150vw, -100vh) rotate(25deg) scale(0.5);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    30% {
      transform: translate(80vw, -30vh) rotate(15deg) scale(0.7);
    }
    50% {
      transform: translate(40vw, 10vh) rotate(-10deg) scale(0.85);
    }
    70% {
      transform: translate(10vw, -5vh) rotate(8deg) scale(0.95);
    }
    85% {
      transform: translate(-2vw, 2vh) rotate(-3deg) scale(1);
    }
    100% {
      transform: translate(0, 0) rotate(0deg) scale(1);
    }
  }

  @keyframes owl-flap {
    0%, 100% {
      transform: scaleY(1) scaleX(1);
    }
    50% {
      transform: scaleY(0.95) scaleX(1.05);
    }
  }

  @keyframes owl-land {
    0% {
      transform: translateY(-5px);
    }
    50% {
      transform: translateY(3px);
    }
    100% {
      transform: translateY(0);
    }
  }

  /* Owl fly-out animation */
  .owl-chat-container.flying-out {
    animation: owl-fly-out 0.8s cubic-bezier(0.55, 0.06, 0.68, 0.19) forwards;
  }

  .owl-chat-container.flying-out .owl-button {
    animation: owl-flap 0.12s ease-in-out infinite;
  }

  @keyframes owl-fly-out {
    0% {
      transform: translate(0, 0) rotate(0deg) scale(1);
      opacity: 1;
    }
    20% {
      transform: translate(-5vw, -10vh) rotate(-15deg) scale(0.95);
    }
    50% {
      transform: translate(20vw, -40vh) rotate(20deg) scale(0.8);
    }
    80% {
      transform: translate(80vw, -80vh) rotate(30deg) scale(0.6);
      opacity: 0.8;
    }
    100% {
      transform: translate(150vw, -120vh) rotate(35deg) scale(0.4);
      opacity: 0;
    }
  }

  /* Thought bubble - positioned on mini owl in header */
  .header-owl {
    position: relative;
  }

  .thought-bubble {
    position: absolute;
    top: -32px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(10, 10, 20, 0.95);
    border: 2px solid #00ffff;
    border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
    padding: 6px 10px;
    font-family: 'Inter', sans-serif;
    font-size: 9px;
    color: #00ffff;
    white-space: nowrap;
    animation: bubble-appear 0.4s ease-out, bubble-float 2s ease-in-out infinite;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
    z-index: 10;
  }

  .thought-bubble span {
    display: block;
  }

  /* Trailing thought dots */
  .thought-dots {
    position: absolute;
    bottom: -16px;
    left: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .thought-dot {
    background: rgba(10, 10, 20, 0.95);
    border: 1.5px solid #00ffff;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0, 255, 255, 0.4);
    animation: dot-appear 0.3s ease-out backwards;
  }

  .thought-dot:nth-child(1) {
    width: 8px;
    height: 8px;
    animation-delay: 0.1s;
  }

  .thought-dot:nth-child(2) {
    width: 6px;
    height: 6px;
    margin-left: 3px;
    animation-delay: 0.2s;
  }

  .thought-dot:nth-child(3) {
    width: 4px;
    height: 4px;
    margin-left: 5px;
    animation-delay: 0.3s;
  }

  @keyframes dot-appear {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes bubble-appear {
    0% {
      opacity: 0;
      transform: translateX(-50%) scale(0.5);
    }
    100% {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }
  }

  @keyframes bubble-float {
    0%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    50% {
      transform: translateX(-50%) translateY(-2px);
    }
  }

  .owl-button {
    width: 70px;
    height: 70px;
    border: 3px solid #00ffff;
    border-radius: 50%;
    background: rgba(10, 10, 20, 0.95);
    cursor: pointer;
    padding: 8px;
    box-shadow: 4px 4px 0 #ff00ff;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: visible;
  }

  .owl-button:hover {
    transform: translate(-4px, -4px);
    box-shadow: 8px 8px 0 #ff00ff, 0 0 20px rgba(0, 255, 255, 0.5);
    border-color: #ffff00;
  }

  .owl-button.open {
    border-color: #ffff00;
    box-shadow: 6px 6px 0 #ff00ff, 0 0 30px rgba(255, 0, 255, 0.4);
  }

  .close-icon {
    width: 28px;
    height: 28px;
    color: #00ffff;
    transition: all 0.3s ease;
  }

  .owl-button:hover .close-icon {
    color: #ffff00;
    transform: rotate(90deg);
  }

  .owl-svg {
    width: 50px;
    height: 54px;
    filter: drop-shadow(0 0 2px #00ffff);
    transition: all 0.3s ease;
  }

  .owl-button:hover .owl-svg {
    filter: drop-shadow(0 0 6px #00ffff);
    animation: owl-bounce 0.5s ease;
  }

  @keyframes owl-bounce {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    25% { transform: translateY(-3px) rotate(-5deg); }
    50% { transform: translateY(0) rotate(0deg); }
    75% { transform: translateY(-2px) rotate(5deg); }
  }

  /* Mechanical Owl Styles */
  .mech-ear {
    fill: #1a1a2e;
    stroke: #00ffff;
    stroke-width: 1.5;
  }

  .antenna-tip {
    fill: #ff00ff;
    filter: drop-shadow(0 0 4px #ff00ff);
    animation: antenna-pulse 2s ease-in-out infinite;
  }

  @keyframes antenna-pulse {
    0%, 100% { opacity: 1; filter: drop-shadow(0 0 4px #ff00ff); }
    50% { opacity: 0.6; filter: drop-shadow(0 0 8px #ff00ff); }
  }

  .antenna-glow {
    stroke: #ff00ff;
    stroke-width: 2;
    opacity: 0.6;
  }

  .mech-body {
    fill: #12121f;
    stroke: #00ffff;
    stroke-width: 2;
    filter: drop-shadow(0 0 3px rgba(0, 255, 255, 0.3));
  }

  .face-plate {
    fill: rgba(20, 20, 35, 0.9);
    stroke: #ffff00;
    stroke-width: 1.5;
  }

  .panel-line {
    stroke: rgba(0, 255, 255, 0.3);
    stroke-width: 1;
    stroke-dasharray: 2 2;
  }

  .eye-housing {
    fill: rgba(0, 0, 0, 0.9);
    stroke: #ff00ff;
    stroke-width: 1.5;
  }

  .eye-ring {
    fill: none;
    stroke: rgba(0, 255, 255, 0.4);
    stroke-width: 1;
    stroke-dasharray: 4 2;
    animation: ring-rotate 8s linear infinite;
    transform-origin: center;
  }

  .owl-svg .eye-ring:first-of-type {
    transform-origin: 35px 46px;
  }

  .owl-svg .eye-ring:last-of-type {
    transform-origin: 65px 46px;
  }

  @keyframes ring-rotate {
    to { transform: rotate(360deg); }
  }

  .mech-eye {
    fill: #ffff00;
    filter: drop-shadow(0 0 6px #ffff00);
    transition: filter 0.3s ease;
    animation: eye-color-cycle 6s ease-in-out infinite;
  }

  @keyframes eye-color-cycle {
    0%, 100% { fill: #ffff00; filter: drop-shadow(0 0 6px #ffff00); }
    16% { fill: #ff9900; filter: drop-shadow(0 0 6px #ff9900); }
    33% { fill: #ff00ff; filter: drop-shadow(0 0 6px #ff00ff); }
    50% { fill: #00ffff; filter: drop-shadow(0 0 6px #00ffff); }
    66% { fill: #00ff88; filter: drop-shadow(0 0 6px #00ff88); }
    83% { fill: #ff0066; filter: drop-shadow(0 0 6px #ff0066); }
  }

  .owl-button:hover .mech-eye {
    animation: none;
    fill: #ffffff;
    filter: drop-shadow(0 0 12px #ffffff);
  }

  .mech-pupil {
    fill: #0a0a0f;
    transition: all 0.2s ease;
  }

  .scan-line {
    stroke: rgba(255, 255, 255, 0.5);
    stroke-width: 1;
    animation: scan-move 2s ease-in-out infinite;
  }

  @keyframes scan-move {
    0%, 100% { opacity: 0.3; transform: translateY(-2px); }
    50% { opacity: 0.8; transform: translateY(2px); }
  }

  .mech-shine {
    fill: #ffffff;
    opacity: 0.9;
  }

  .mech-beak {
    fill: #ff00ff;
    stroke: #ffff00;
    stroke-width: 1;
  }

  .beak-detail {
    stroke: rgba(255, 255, 0, 0.5);
    stroke-width: 1;
  }

  .vent-line {
    fill: none;
    stroke: rgba(0, 255, 255, 0.4);
    stroke-width: 1.5;
    stroke-linecap: round;
  }

  .rivet {
    fill: #333;
    stroke: #00ffff;
    stroke-width: 1;
  }

  .circuit-trace {
    fill: none;
    stroke: #00ffff;
    stroke-width: 1;
    opacity: 0.5;
    stroke-dasharray: 3 2;
    animation: circuit-flow 1.5s linear infinite;
  }

  @keyframes circuit-flow {
    to { stroke-dashoffset: -10; }
  }

  /* Nest styles */
  .nest-shadow {
    fill: rgba(0, 0, 0, 0.3);
  }

  .nest-bowl {
    fill: #2a1a0f;
    stroke: #4a3020;
    stroke-width: 1;
  }

  .nest-twig-back {
    fill: none;
    stroke: #3d2515;
    stroke-width: 2.5;
    stroke-linecap: round;
  }

  .nest-twig {
    fill: none;
    stroke: #5a3d2b;
    stroke-width: 2;
    stroke-linecap: round;
  }

  .nest-twig-front {
    fill: none;
    stroke: #7a5438;
    stroke-width: 2.5;
    stroke-linecap: round;
  }

  .nest-stray {
    fill: none;
    stroke: #6b4830;
    stroke-width: 1.5;
    stroke-linecap: round;
  }

  .owl-button.with-nest {
    padding-bottom: 12px;
  }

  /* Eye color cycle is applied by default, hover overrides it */

  .chat-window {
    position: absolute;
    bottom: 85px;
    right: 0;
    width: 380px;
    height: 520px;
    background: rgba(8, 8, 16, 0.98);
    border: 2px solid rgba(0, 255, 255, 0.6);
    border-radius: 4px;
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.15), 8px 8px 0 rgba(255, 0, 255, 0.8);
    display: flex;
    flex-direction: column;
    animation: chat-appear 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    backdrop-filter: blur(15px);
  }

  @keyframes chat-appear {
    0% {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .chat-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: linear-gradient(135deg, rgba(255, 0, 255, 0.15), rgba(0, 255, 255, 0.15));
    border-bottom: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 2px 2px 0 0;
  }

  .header-owl {
    width: 40px;
    height: 40px;
  }

  .mini-owl {
    width: 100%;
    height: 100%;
  }

  .mini-owl .mini-antenna {
    fill: #ff00ff;
    filter: drop-shadow(0 0 3px #ff00ff);
    animation: mini-antenna-blink 2s ease-in-out infinite;
  }

  @keyframes mini-antenna-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .mini-owl .mini-antenna-line {
    stroke: #ff00ff;
    stroke-width: 2;
    opacity: 0.6;
  }

  .mini-owl .mini-body {
    fill: #12121f;
    stroke: #00ffff;
    stroke-width: 2.5;
  }

  .mini-owl .mini-face {
    fill: rgba(20, 20, 35, 0.9);
    stroke: #ffff00;
    stroke-width: 1.5;
  }

  .mini-owl .mini-eye-housing {
    fill: rgba(0, 0, 0, 0.9);
    stroke: #ff00ff;
    stroke-width: 1;
  }

  .mini-owl .mini-eye {
    fill: #ffff00;
    filter: drop-shadow(0 0 4px #ffff00);
    animation: mini-eye-color-cycle 6s ease-in-out infinite;
  }

  @keyframes mini-eye-color-cycle {
    0%, 100% { fill: #ffff00; filter: drop-shadow(0 0 5px #ffff00); }
    16% { fill: #ff9900; filter: drop-shadow(0 0 5px #ff9900); }
    33% { fill: #ff00ff; filter: drop-shadow(0 0 5px #ff00ff); }
    50% { fill: #00ffff; filter: drop-shadow(0 0 5px #00ffff); }
    66% { fill: #00ff88; filter: drop-shadow(0 0 5px #00ff88); }
    83% { fill: #ff0066; filter: drop-shadow(0 0 5px #ff0066); }
  }

  .mini-owl .mini-pupil {
    fill: #0a0a0f;
  }

  .mini-owl .mini-beak {
    fill: #ff00ff;
    stroke: #ffff00;
    stroke-width: 0.5;
  }

  .header-info {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .header-name {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    text-shadow: -1px 0 #ff00ff, 1px 0 #00ffff;
  }

  .header-status {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    color: #00ff88;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .header-status::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #00ff88;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  .ai-badge {
    background: linear-gradient(135deg, #ff00ff, #00ffff);
    color: #0a0a0f;
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-weight: 700;
    padding: 4px 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .ai-badge.cpu {
    background: linear-gradient(135deg, #ff9900, #ffff00);
  }

  .cpu-disclaimer {
    background: rgba(255, 153, 0, 0.15);
    border: 1px solid rgba(255, 153, 0, 0.4);
    border-left: 3px solid #ff9900;
    padding: 8px 12px;
    margin: 0;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    color: #ffcc00;
    line-height: 1.4;
  }

  .cpu-disclaimer a {
    color: #00ffff;
    text-decoration: underline;
    cursor: pointer;
    margin-left: 4px;
  }

  .cpu-disclaimer a:hover {
    color: #fff;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .loading-overlay {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 66px;
    background: rgba(10, 10, 20, 0.95);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(0, 255, 255, 0.2);
    border-top-color: #00ffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-text {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #00ffff;
    margin-top: 15px;
    text-align: center;
  }

  .loading-subtext {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 5px;
  }

  .progress-bar-container {
    width: 80%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    margin-top: 15px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #ff00ff, #00ffff);
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .chat-messages::-webkit-scrollbar {
    width: 6px;
  }

  .chat-messages::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
  }

  .chat-messages::-webkit-scrollbar-thumb {
    background: #ff00ff;
    border-radius: 3px;
  }

  .message {
    max-width: 85%;
    animation: message-appear 0.3s ease;
  }

  @keyframes message-appear {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .message.user {
    align-self: flex-end;
  }

  .message.assistant {
    align-self: flex-start;
  }

  .message-content {
    padding: 10px 14px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 13px;
    line-height: 1.5;
    border-radius: 2px;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .message.user .message-content {
    background: linear-gradient(135deg, #ff00ff, #00ffff);
    color: #0a0a0f;
    font-weight: 500;
  }

  .message.assistant .message-content {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
    border: 1px solid rgba(0, 255, 255, 0.2);
    border-left: 3px solid #00ffff;
  }

  .message-stats {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    padding: 4px 8px;
    font-family: 'Fira Code', 'Monaco', monospace;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.4);
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
  }

  .stat {
    color: rgba(0, 255, 255, 0.6);
  }

  .stat.live {
    animation: stat-pulse 1s ease-in-out infinite;
  }

  @keyframes stat-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .stat-divider {
    color: rgba(255, 255, 255, 0.2);
  }

  /* Speak button styles */
  .speak-button {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    padding: 6px 12px;
    background: rgba(0, 255, 136, 0.1);
    border: 1px solid rgba(0, 255, 136, 0.3);
    border-radius: 3px;
    color: #00ff88;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .speak-button:hover {
    background: rgba(0, 255, 136, 0.2);
    border-color: #00ff88;
    transform: translateX(2px);
  }

  .speak-button svg {
    width: 16px;
    height: 16px;
  }

  .speak-button.speaking {
    background: rgba(255, 0, 102, 0.15);
    border-color: #ff0066;
    color: #ff0066;
    animation: speaking-pulse 1s ease-in-out infinite;
  }

  .speak-button.speaking:hover {
    background: rgba(255, 0, 102, 0.25);
  }

  @keyframes speaking-pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(255, 0, 102, 0.3);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(255, 0, 102, 0);
    }
  }

  /* Thinking section styles */
  .thinking-section {
    margin-bottom: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
  }

  .thinking-section.active {
    padding: 8px 12px;
    background: rgba(255, 0, 255, 0.1);
    border: 1px solid rgba(255, 0, 255, 0.3);
    border-radius: 2px;
  }

  .thinking-label {
    color: #ff00ff;
    font-style: italic;
    animation: thinking-pulse 1.5s ease-in-out infinite;
  }

  @keyframes thinking-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .thinking-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 0, 255, 0.15);
    border: 1px solid rgba(255, 0, 255, 0.3);
    color: #ff00ff;
    padding: 4px 10px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    transition: all 0.2s ease;
  }

  .thinking-toggle:hover {
    background: rgba(255, 0, 255, 0.25);
  }

  .thinking-icon {
    font-size: 8px;
  }

  .thinking-content {
    margin-top: 8px;
    padding: 10px 12px;
    background: rgba(255, 0, 255, 0.05);
    border-left: 2px solid #ff00ff;
    color: rgba(255, 255, 255, 0.7);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji';
    font-size: 11px;
    line-height: 1.5;
    white-space: pre-wrap;
    max-height: 150px;
    overflow-y: auto;
  }

  .thinking-content::-webkit-scrollbar {
    width: 4px;
  }

  .thinking-content::-webkit-scrollbar-thumb {
    background: #ff00ff;
    border-radius: 2px;
  }

  .decoding-text {
    color: #00ffff;
    font-family: 'Fira Code', 'Monaco', monospace;
    animation: decode-flicker 0.15s steps(3) forwards;
    text-shadow: 0 0 8px #00ffff;
  }

  @keyframes decode-flicker {
    0% {
      opacity: 0.4;
      filter: blur(2px);
      color: #ff00ff;
    }
    33% {
      opacity: 0.7;
      filter: blur(1px);
      color: #ffff00;
    }
    66% {
      opacity: 0.9;
      filter: blur(0.5px);
      color: #00ffff;
    }
    100% {
      opacity: 1;
      filter: blur(0);
      color: rgba(255, 255, 255, 0.7);
      text-shadow: none;
    }
  }

  .cursor-blink {
    display: inline-block;
    width: 8px;
    height: 16px;
    background: #00ffff;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .thinking-dots::after {
    content: '';
    animation: thinking-dots 1.5s steps(4, end) infinite;
  }

  @keyframes thinking-dots {
    0% { content: ''; }
    25% { content: '.'; }
    50% { content: '..'; }
    75% { content: '...'; }
    100% { content: ''; }
  }

  .generating-dots {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
  }

  .generating-dots .dot {
    width: 8px;
    height: 8px;
    background: linear-gradient(135deg, #ff00ff, #00ffff);
    border-radius: 50%;
    animation: generating-pulse 1.4s ease-in-out infinite;
  }

  .generating-dots .dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .generating-dots .dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes generating-pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .chat-input-container {
    display: flex;
    gap: 10px;
    padding: 14px;
    border-top: 1px solid rgba(0, 255, 255, 0.3);
    background: rgba(0, 0, 0, 0.4);
    border-radius: 0 0 2px 2px;
  }

  .chat-input {
    flex: 1;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(0, 255, 255, 0.25);
    border-radius: 3px;
    padding: 12px 14px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #fff;
    outline: none;
    transition: all 0.2s ease;
  }

  .chat-input::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  .chat-input:focus {
    border-color: #00ffff;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  }

  .chat-input:disabled {
    opacity: 0.6;
  }

  .audio-wave-container {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 0, 102, 0.1);
    border: 1px solid rgba(255, 0, 102, 0.4);
    border-radius: 3px;
    padding: 8px 14px;
    min-height: 42px;
    max-height: 80px;
    min-width: 0;
    overflow: hidden;
  }

  .audio-wave {
    display: flex;
    align-items: center;
    gap: 3px;
    height: 30px;
  }

  .wave-bar {
    width: 4px;
    background: linear-gradient(to top, #ff0066, #ff00ff);
    border-radius: 2px;
    transition: height 0.05s ease;
    animation: wave-idle 0.8s ease-in-out infinite;
  }

  @keyframes wave-idle {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  .listening-text {
    flex: 1;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: #ff0066;
    min-width: 0;
    max-height: 60px;
    overflow-y: auto;
    overflow-x: hidden;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

  .listening-text::-webkit-scrollbar {
    width: 4px;
  }

  .listening-text::-webkit-scrollbar-thumb {
    background: #ff0066;
    border-radius: 2px;
  }

  .mic-button {
    width: 42px;
    height: 42px;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(0, 255, 255, 0.5);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .mic-button svg {
    width: 20px;
    height: 20px;
    color: #00ffff;
    transition: all 0.3s ease;
  }

  .mic-button:hover:not(:disabled) {
    background: rgba(0, 255, 255, 0.2);
    border-color: #00ffff;
  }

  .mic-button:hover:not(:disabled) svg {
    color: #fff;
  }

  .mic-button.listening {
    background: rgba(255, 0, 102, 0.3);
    border-color: #ff0066;
    animation: mic-pulse 1s ease-in-out infinite;
  }

  .mic-button.listening svg {
    color: #ff0066;
  }

  @keyframes mic-pulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(255, 0, 102, 0.4);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(255, 0, 102, 0);
    }
  }

  .mic-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .send-button {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, #ff00ff, #00ffff);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .send-button:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 #ffff00;
  }

  .send-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .send-button svg {
    width: 20px;
    height: 20px;
    color: #0a0a0f;
  }

  @media (max-width: 768px) {
    .owl-chat-container {
      bottom: 20px;
      right: 20px;
    }

    .owl-button {
      width: 60px;
      height: 60px;
    }

    .owl-svg {
      width: 38px;
      height: 38px;
    }

    .chat-window {
      width: calc(100vw - 40px);
      height: 420px;
      right: -10px;
    }
  }
</style>
