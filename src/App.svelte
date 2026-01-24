<script>
  import { onMount } from 'svelte';
  import Hero from './components/Hero.svelte';
  import About from './components/About.svelte';
  import Experience from './components/Experience.svelte';
  import Projects from './components/Projects.svelte';
  import Skills from './components/Skills.svelte';
  import Contact from './components/Contact.svelte';
  import Nav from './components/Nav.svelte';

  let canvas;
  let ctx;
  let nodes = [];
  let signals = [];
  let glitchActive = false;
  let glitchIntensity = 0;
  let canvasOpacity = 0.7;
  let scrollY = 0;

  // Code snippets animation
  let codeSnippets = [];
  let snippetId = 0;
  let codeIntervalId;

  const codeExamples = [
    { lang: 'python', code: 'model = Sequential([\n    Dense(128, activation="relu"),\n    Dense(10, activation="softmax")\n])' },
    { lang: 'js', code: 'const sum = (a, b) => a + b;' },
    { lang: 'python', code: 'from transformers import GPT2Model\nmodel = GPT2Model.from_pretrained("gpt2")' },
    { lang: 'js', code: 'async function fetchData() {\n  return await api.get();\n}' },
    { lang: 'python', code: 'X_train, X_test = train_test_split(\n    data, test_size=0.2\n)' },
    { lang: 'js', code: 'const arr = [1, 2, 3].map(x => x * 2);' },
    { lang: 'python', code: 'loss = nn.CrossEntropyLoss()\noptimizer = torch.optim.Adam(\n    model.parameters(), lr=0.001\n)' },
    { lang: 'js', code: 'document.querySelector(".btn")\n  .addEventListener("click", fn);' },
    { lang: 'python', code: 'embeddings = model.encode(sentences)\nsimilarity = cosine_similarity(embeddings)' },
    { lang: 'python', code: 'response = openai.ChatCompletion.create(\n    model="gpt-4",\n    messages=messages\n)' },
  ];

  // Predefined spawn positions spread across the page
  const spawnPositions = [
    { x: 3, y: 5 },
    { x: 75, y: 8 },
    { x: 5, y: 25 },
    { x: 80, y: 30 },
    { x: 3, y: 50 },
    { x: 78, y: 55 },
    { x: 5, y: 75 },
    { x: 75, y: 80 },
  ];
  let nextPositionIndex = 0;

  function getNextPosition() {
    const pos = spawnPositions[nextPositionIndex];
    nextPositionIndex = (nextPositionIndex + 1) % spawnPositions.length;
    return pos;
  }

  function spawnCodeSnippet() {
    // Limit concurrent snippets
    if (codeSnippets.length >= 3) return;

    const example = codeExamples[Math.floor(Math.random() * codeExamples.length)];
    const id = snippetId++;
    const pos = getNextPosition();
    const snippet = {
      id,
      lang: example.lang,
      code: example.code,
      displayedCode: '',
      x: pos.x,
      y: pos.y,
      opacity: 0,
      charIndex: 0,
    };
    codeSnippets = [...codeSnippets, snippet];

    // Fade in
    setTimeout(() => {
      codeSnippets = codeSnippets.map(s => s.id === id ? { ...s, opacity: 0.15 } : s);
    }, 50);

    // Type out the code
    const typeInterval = setInterval(() => {
      codeSnippets = codeSnippets.map(s => {
        if (s.id === id && s.charIndex < s.code.length) {
          return {
            ...s,
            displayedCode: s.code.substring(0, s.charIndex + 1),
            charIndex: s.charIndex + 1
          };
        }
        return s;
      });

      const currentSnippet = codeSnippets.find(s => s.id === id);
      if (currentSnippet && currentSnippet.charIndex >= currentSnippet.code.length) {
        clearInterval(typeInterval);

        // Fade out after typing completes
        setTimeout(() => {
          codeSnippets = codeSnippets.map(s => s.id === id ? { ...s, opacity: 0 } : s);

          // Remove from DOM after fade
          setTimeout(() => {
            codeSnippets = codeSnippets.filter(s => s.id !== id);
          }, 1000);
        }, 2000);
      }
    }, 50);
  }

  // Neural network configuration
  const config = {
    nodeCount: 45,
    connectionDistance: 100,
    nodeSpeed: 0.3,
    signalSpeed: 3,
    signalSpawnRate: 0.02,
    glitchChance: 0.003,
    glitchDuration: 150,
    colors: {
      node: ['#442266', '#553377', '#3d1f5c', '#4a2970'],
      connection: 'rgba(0, 80, 60, 0.35)',
      signal: ['#005050', '#500050', '#505000'],
      glitch: ['#661414', '#146614', '#141466', '#501450', '#145050']
    }
  };

  class Node {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * config.nodeSpeed;
      this.vy = (Math.random() - 0.5) * config.nodeSpeed;
      this.radius = Math.random() * 1.5 + 1;
      this.color = config.colors.node[Math.floor(Math.random() * config.colors.node.length)];
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.connections = [];
    }

    update(width, height) {
      this.x += this.vx;
      this.y += this.vy;
      this.pulsePhase += 0.02;

      // Bounce off edges with padding
      if (this.x < 50 || this.x > width - 50) this.vx *= -1;
      if (this.y < 50 || this.y > height - 50) this.vy *= -1;

      // Keep within bounds
      this.x = Math.max(50, Math.min(width - 50, this.x));
      this.y = Math.max(50, Math.min(height - 50, this.y));
    }

    draw(ctx, glitchOffset = { x: 0, y: 0 }) {
      const pulse = Math.sin(this.pulsePhase) * 0.5 + 1;
      const x = this.x + glitchOffset.x;
      const y = this.y + glitchOffset.y;

      // Glow effect
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.radius * 3 * pulse);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(0.5, this.color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.arc(x, y, this.radius * 3 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(x, y, this.radius * pulse, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Signal {
    constructor(startNode, endNode) {
      this.startNode = startNode;
      this.endNode = endNode;
      this.progress = 0;
      this.speed = config.signalSpeed + Math.random() * 2;
      this.color = config.colors.signal[Math.floor(Math.random() * config.colors.signal.length)];
      this.trail = [];
    }

    update() {
      const dx = this.endNode.x - this.startNode.x;
      const dy = this.endNode.y - this.startNode.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      this.progress += this.speed / dist;

      const currentX = this.startNode.x + dx * this.progress;
      const currentY = this.startNode.y + dy * this.progress;

      this.trail.push({ x: currentX, y: currentY, alpha: 1 });
      if (this.trail.length > 10) this.trail.shift();

      this.trail.forEach(t => t.alpha *= 0.9);

      return this.progress >= 1;
    }

    draw(ctx, glitchOffset = { x: 0, y: 0 }) {
      // Draw trail
      this.trail.forEach((point, i) => {
        ctx.beginPath();
        ctx.fillStyle = this.color.replace(')', `, ${point.alpha * 0.8})`).replace('rgb', 'rgba').replace('#', '');

        // Convert hex to rgba for trail
        const alpha = point.alpha * 0.8;
        if (this.color.startsWith('#')) {
          const r = parseInt(this.color.slice(1, 3), 16);
          const g = parseInt(this.color.slice(3, 5), 16);
          const b = parseInt(this.color.slice(5, 7), 16);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        ctx.arc(
          point.x + glitchOffset.x,
          point.y + glitchOffset.y,
          3 * (i / this.trail.length),
          0,
          Math.PI * 2
        );
        ctx.fill();
      });

      // Draw signal head
      const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress + glitchOffset.x;
      const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress + glitchOffset.y;

      ctx.beginPath();
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(0.5, this.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initNodes(width, height) {
    nodes = [];
    for (let i = 0; i < config.nodeCount; i++) {
      nodes.push(new Node(
        Math.random() * (width - 100) + 50,
        Math.random() * (height - 100) + 50
      ));
    }
  }

  function drawConnections(ctx, glitchOffset = { x: 0, y: 0 }) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.connectionDistance) {
          const alpha = (1 - dist / config.connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x + glitchOffset.x, nodes[i].y + glitchOffset.y);
          ctx.lineTo(nodes[j].x + glitchOffset.x, nodes[j].y + glitchOffset.y);
          ctx.stroke();
        }
      }
    }
  }

  function spawnSignal() {
    if (nodes.length < 2) return;

    // Find connected nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.connectionDistance && Math.random() < config.signalSpawnRate) {
          const startNode = Math.random() > 0.5 ? nodes[i] : nodes[j];
          const endNode = startNode === nodes[i] ? nodes[j] : nodes[i];
          signals.push(new Signal(startNode, endNode));
          return;
        }
      }
    }
  }

  function triggerGlitch() {
    glitchActive = true;
    glitchIntensity = Math.random() * 20 + 10;

    setTimeout(() => {
      glitchActive = false;
      glitchIntensity = 0;
    }, config.glitchDuration + Math.random() * 100);
  }

  function drawGlitchEffect(ctx, width, height) {
    if (!glitchActive) return;

    // Random horizontal slices
    const sliceCount = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < sliceCount; i++) {
      const y = Math.random() * height;
      const sliceHeight = Math.random() * 20 + 5;
      const offset = (Math.random() - 0.5) * glitchIntensity * 2;

      const imageData = ctx.getImageData(0, y, width, sliceHeight);
      ctx.putImageData(imageData, offset, y);
    }

    // Color channel separation
    if (Math.random() > 0.5) {
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * 10 - 5, 0, width, height);
      ctx.fillStyle = `rgba(0, 255, 255, ${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * -10 + 5, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
    }

    // Scan lines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let y = 0; y < height; y += 4) {
      if (Math.random() > 0.7) {
        ctx.fillRect(0, y, width, 2);
      }
    }

    // Random noise blocks
    const noiseBlocks = Math.floor(Math.random() * 8) + 2;
    for (let i = 0; i < noiseBlocks; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const w = Math.random() * 100 + 20;
      const h = Math.random() * 30 + 5;

      ctx.fillStyle = config.colors.glitch[Math.floor(Math.random() * config.colors.glitch.length)];
      ctx.globalAlpha = Math.random() * 0.3;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = 1;
    }
  }

  function animate() {
    if (!ctx || !canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate glitch offset
    const glitchOffset = glitchActive ? {
      x: (Math.random() - 0.5) * glitchIntensity,
      y: (Math.random() - 0.5) * glitchIntensity
    } : { x: 0, y: 0 };

    // Update and draw nodes
    nodes.forEach(node => {
      node.update(width, height);
    });

    // Draw connections
    drawConnections(ctx, glitchOffset);

    // Draw nodes
    nodes.forEach(node => {
      node.draw(ctx, glitchOffset);
    });

    // Spawn new signals
    if (Math.random() < 0.1) spawnSignal();

    // Update and draw signals
    signals = signals.filter(signal => {
      const completed = signal.update();
      if (!completed) {
        signal.draw(ctx, glitchOffset);
      }
      return !completed;
    });

    // Random glitch trigger
    if (Math.random() < config.glitchChance && !glitchActive) {
      triggerGlitch();
    }

    // Draw glitch effects
    drawGlitchEffect(ctx, width, height);

    requestAnimationFrame(animate);
  }

  function handleResize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initNodes(canvas.width, canvas.height);
  }

  function handleScroll() {
    scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
    // Start fading at 30% of hero height, fully faded by 80%
    const fadeStart = heroHeight * 0.3;
    const fadeEnd = heroHeight * 0.8;

    if (scrollY <= fadeStart) {
      canvasOpacity = 0.7;
    } else if (scrollY >= fadeEnd) {
      canvasOpacity = 0;
    } else {
      const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
      canvasOpacity = 0.7 * (1 - progress);
    }
  }

  // Circuit tile grid generation with Spider-Verse color schemes
  let circuitTiles = [];
  const TILE_SIZE = 100;
  const COLOR_SCHEMES = ['cyan', 'magenta', 'red', 'blue', 'orange'];
  let tileAnimationId;

  function generateCircuitTiles() {
    // Create a grid of non-overlapping positions using 100px tiles
    const tileSize = 100;
    const cols = Math.floor(window.innerWidth / tileSize);
    const rows = Math.floor(window.innerHeight / tileSize);
    circuitTiles = [];

    let id = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        circuitTiles.push({
          id: `tile-${id++}`,
          // Pixel-based grid positions (no overlap)
          x: col * tileSize,
          y: row * tileSize,
          delay: Math.random() * 20000,
          duration: 20000 + Math.random() * 10000,
          colorScheme: COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)],
          visible: false,
          active: false,
          opacity: 0,
        });
      }
    }
    // Shuffle tiles so all positions have equal chance to be active
    circuitTiles = circuitTiles.sort(() => Math.random() - 0.5);
  }

  function updateTileVisibility() {
    const now = performance.now();
    const fadeTime = 4000; // 4 seconds fade in/out
    const visibleTime = 8000; // 8 seconds fully visible
    const totalVisibleTime = fadeTime + visibleTime + fadeTime; // 12 seconds total
    const maxVisibleTiles = 25; // Limit concurrent visible tiles

    // First pass: count currently active tiles (already showing)
    let activeCount = circuitTiles.filter(t => t.active).length;

    circuitTiles = circuitTiles.map(tile => {
      const elapsed = (now - tile.delay) % tile.duration;
      const visibleStart = tile.duration * 0.3;
      const visibleEnd = visibleStart + totalVisibleTime;
      const inVisibleWindow = elapsed > visibleStart && elapsed < visibleEnd;

      // Determine if tile should be active
      let active = tile.active;
      if (inVisibleWindow && !tile.active && activeCount < maxVisibleTiles) {
        active = true; // Start showing
        activeCount++;
      } else if (!inVisibleWindow && tile.active) {
        active = false; // Finished cycle
      }

      // Calculate opacity
      let opacity = 0;
      if (active && inVisibleWindow) {
        const visibleElapsed = elapsed - visibleStart;
        if (visibleElapsed < fadeTime) {
          opacity = visibleElapsed / fadeTime; // 2s fade in
        } else if (visibleElapsed < fadeTime + visibleTime) {
          opacity = 1; // Fully visible for 8s
        } else {
          opacity = (totalVisibleTime - visibleElapsed) / fadeTime; // 2s fade out
        }
      }

      return { ...tile, active, visible: active && inVisibleWindow && opacity > 0, opacity };
    });
    tileAnimationId = requestAnimationFrame(updateTileVisibility);
  }

  onMount(() => {
    ctx = canvas.getContext('2d');
    handleResize();
    handleScroll();
    animate();
    generateCircuitTiles();
    updateTileVisibility();

    // Start code snippet animations
    spawnCodeSnippet();
    codeIntervalId = setInterval(spawnCodeSnippet, 3500);

    window.addEventListener('resize', () => {
      handleResize();
      generateCircuitTiles();
    });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(codeIntervalId);
      cancelAnimationFrame(tileAnimationId);
    };
  });
</script>

<Nav />

<!-- Animated Neural Network Background Canvas -->
<canvas bind:this={canvas} class="neural-canvas" style="opacity: {canvasOpacity}"></canvas>

<!-- Floating Code Snippets -->
<div class="code-snippets-container">
  {#each codeSnippets as snippet (snippet.id)}
    <pre
      class="floating-code {snippet.lang}"
      style="left: {snippet.x}%; top: {snippet.y}%; opacity: {snippet.opacity};"
    ><code>{snippet.displayedCode}<span class="cursor">|</span></code></pre>
  {/each}
</div>

<!-- Circuit Board Background -->
<div class="circuit-bg">
  <svg class="circuit-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <!-- Spider-Verse color circuit patterns - each color has its own pattern -->

      <!-- CYAN Pattern - dark shade -->
      <pattern id="circuit-pattern-cyan" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(0,80,80,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="60" y1="20" x2="100" y2="20" stroke="rgba(0,80,80,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite"/></line>
        <line x1="0" y1="50" x2="30" y2="50" stroke="rgba(0,80,80,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="70" y1="50" x2="100" y2="50" stroke="rgba(0,80,80,0.6)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(0,80,80,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.3s" repeatCount="indefinite"/></line>
        <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(0,80,80,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="80" y1="0" x2="80" y2="50" stroke="rgba(0,80,80,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"/></line>
        <path d="M40,20 L50,20 L50,30" fill="none" stroke="rgba(0,100,100,0.7)" stroke-width="1.5" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.7s" repeatCount="indefinite"/></path>
        <!-- QFP IC chip 18x18 -->
        <rect x="41" y="41" width="18" height="18" fill="rgba(5,5,15,0.9)" stroke="rgba(0,100,100,0.8)" stroke-width="1"><animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/></rect>
        <circle cx="43" cy="43" r="1.5" fill="rgba(0,100,100,0.8)"/>
        <line x1="37" y1="45" x2="41" y2="45" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="37" y1="50" x2="41" y2="50" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="37" y1="55" x2="41" y2="55" stroke="rgba(0,80,80,0.6)" stroke-width="1"/>
        <line x1="59" y1="45" x2="63" y2="45" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="59" y1="50" x2="63" y2="50" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="59" y1="55" x2="63" y2="55" stroke="rgba(0,80,80,0.6)" stroke-width="1"/>
        <line x1="45" y1="37" x2="45" y2="41" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="50" y1="37" x2="50" y2="41" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="55" y1="37" x2="55" y2="41" stroke="rgba(0,80,80,0.6)" stroke-width="1"/>
        <line x1="45" y1="59" x2="45" y2="63" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="50" y1="59" x2="50" y2="63" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="55" y1="59" x2="55" y2="63" stroke="rgba(0,80,80,0.6)" stroke-width="1"/>
        <!-- SOIC chip 12x6 with traces -->
        <rect x="5" y="72" width="12" height="6" fill="rgba(5,5,15,0.9)" stroke="rgba(0,100,100,0.7)" stroke-width="0.8"/>
        <line x1="7" y1="70" x2="7" y2="72" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="11" y1="70" x2="11" y2="72" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="15" y1="70" x2="15" y2="72" stroke="rgba(0,80,80,0.6)" stroke-width="1"/>
        <line x1="7" y1="78" x2="7" y2="85" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="11" y1="78" x2="11" y2="85" stroke="rgba(0,80,80,0.6)" stroke-width="1"/><line x1="15" y1="78" x2="15" y2="85" stroke="rgba(0,80,80,0.6)" stroke-width="1"/>
        <line x1="7" y1="70" x2="7" y2="50" stroke="rgba(0,80,80,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <!-- Capacitor with traces -->
        <rect x="75" y="70" width="4" height="8" fill="rgba(0,100,100,0.6)" stroke="rgba(0,120,120,0.8)" stroke-width="0.5"/>
        <line x1="77" y1="70" x2="77" y2="50" stroke="rgba(0,80,80,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="77" y1="78" x2="77" y2="90" stroke="rgba(0,80,80,0.5)" stroke-width="1"/>
        <!-- Resistor with traces -->
        <rect x="85" y="5" width="10" height="4" fill="rgba(5,5,15,0.8)" stroke="rgba(0,80,80,0.6)" stroke-width="0.5"/>
        <line x1="80" y1="7" x2="85" y2="7" stroke="rgba(0,80,80,0.6)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="95" y1="7" x2="100" y2="7" stroke="rgba(0,80,80,0.6)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.8s" repeatCount="indefinite"/></line>
      </pattern>

      <!-- MAGENTA Pattern - dark shade -->
      <pattern id="circuit-pattern-magenta" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(80,0,80,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="60" y1="20" x2="100" y2="20" stroke="rgba(80,0,80,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite"/></line>
        <line x1="0" y1="50" x2="30" y2="50" stroke="rgba(80,0,80,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="70" y1="50" x2="100" y2="50" stroke="rgba(80,0,80,0.6)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(80,0,80,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.3s" repeatCount="indefinite"/></line>
        <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(80,0,80,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="80" y1="0" x2="80" y2="50" stroke="rgba(80,0,80,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"/></line>
        <path d="M40,20 L50,20 L50,30" fill="none" stroke="rgba(100,0,100,0.7)" stroke-width="1.5" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.7s" repeatCount="indefinite"/></path>
        <!-- DIP IC chip 10x10 -->
        <rect x="45" y="45" width="10" height="10" fill="rgba(5,5,15,0.9)" stroke="rgba(100,0,100,0.8)" stroke-width="1"><animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/></rect>
        <circle cx="47" cy="47" r="1" fill="rgba(100,0,100,0.8)"/>
        <line x1="41" y1="47" x2="45" y2="47" stroke="rgba(80,0,80,0.6)" stroke-width="1"/><line x1="41" y1="53" x2="45" y2="53" stroke="rgba(80,0,80,0.6)" stroke-width="1"/>
        <line x1="55" y1="47" x2="59" y2="47" stroke="rgba(80,0,80,0.6)" stroke-width="1"/><line x1="55" y1="53" x2="59" y2="53" stroke="rgba(80,0,80,0.6)" stroke-width="1"/>
        <line x1="47" y1="41" x2="47" y2="45" stroke="rgba(80,0,80,0.6)" stroke-width="1"/><line x1="53" y1="41" x2="53" y2="45" stroke="rgba(80,0,80,0.6)" stroke-width="1"/>
        <line x1="47" y1="55" x2="47" y2="59" stroke="rgba(80,0,80,0.6)" stroke-width="1"/><line x1="53" y1="55" x2="53" y2="59" stroke="rgba(80,0,80,0.6)" stroke-width="1"/>
        <!-- BGA style chip with traces -->
        <rect x="3" y="3" width="16" height="16" fill="rgba(5,5,15,0.8)" stroke="rgba(100,0,100,0.6)" stroke-width="0.5"/>
        <circle cx="8" cy="8" r="2" fill="rgba(100,0,100,0.5)"/><circle cx="14" cy="8" r="2" fill="rgba(100,0,100,0.5)"/>
        <circle cx="8" cy="14" r="2" fill="rgba(100,0,100,0.5)"/><circle cx="14" cy="14" r="2" fill="rgba(100,0,100,0.5)"/>
        <line x1="8" y1="19" x2="8" y2="25" stroke="rgba(80,0,80,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="14" y1="19" x2="14" y2="20" stroke="rgba(80,0,80,0.5)" stroke-width="1"/><line x1="14" y1="20" x2="20" y2="20" stroke="rgba(80,0,80,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.9s" repeatCount="indefinite"/></line>
        <!-- SOT transistor with traces -->
        <rect x="75" y="75" width="8" height="5" fill="rgba(5,5,15,0.9)" stroke="rgba(100,0,100,0.7)" stroke-width="0.5"/>
        <line x1="77" y1="80" x2="77" y2="90" stroke="rgba(80,0,80,0.6)" stroke-width="1"/>
        <line x1="79" y1="80" x2="79" y2="85" stroke="rgba(80,0,80,0.6)" stroke-width="1"/><line x1="79" y1="85" x2="90" y2="85" stroke="rgba(80,0,80,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="81" y1="80" x2="81" y2="90" stroke="rgba(80,0,80,0.6)" stroke-width="1"/>
        <line x1="70" y1="50" x2="75" y2="50" stroke="rgba(80,0,80,0.5)" stroke-width="1"/><line x1="75" y1="50" x2="75" y2="75" stroke="rgba(80,0,80,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <!-- Crystal oscillator with traces -->
        <rect x="85" y="25" width="6" height="10" fill="rgba(100,0,100,0.3)" stroke="rgba(100,0,100,0.7)" stroke-width="0.8" rx="1"/>
        <line x1="88" y1="20" x2="88" y2="25" stroke="rgba(80,0,80,0.6)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="88" y1="35" x2="88" y2="40" stroke="rgba(80,0,80,0.6)" stroke-width="1"/><line x1="88" y1="40" x2="80" y2="40" stroke="rgba(80,0,80,0.5)" stroke-width="1" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
      </pattern>

      <!-- YELLOW Pattern - dark shade (olive/gold) -->
      <pattern id="circuit-pattern-yellow" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(80,80,0,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="60" y1="20" x2="100" y2="20" stroke="rgba(80,80,0,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite"/></line>
        <line x1="0" y1="50" x2="30" y2="50" stroke="rgba(80,80,0,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="70" y1="50" x2="100" y2="50" stroke="rgba(80,80,0,0.6)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(80,80,0,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.3s" repeatCount="indefinite"/></line>
        <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(80,80,0,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="80" y1="0" x2="80" y2="50" stroke="rgba(80,80,0,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"/></line>
        <path d="M40,20 L50,20 L50,30" fill="none" stroke="rgba(100,100,0,0.7)" stroke-width="1.5" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.7s" repeatCount="indefinite"/></path>
        <!-- IC chip 22x22 (large) -->
        <rect x="39" y="39" width="22" height="22" fill="rgba(5,5,15,0.9)" stroke="rgba(100,100,0,0.8)" stroke-width="1"><animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/></rect>
        <circle cx="42" cy="42" r="2" fill="rgba(100,100,0,0.8)"/>
        <line x1="34" y1="44" x2="39" y2="44" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="34" y1="50" x2="39" y2="50" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="34" y1="56" x2="39" y2="56" stroke="rgba(80,80,0,0.6)" stroke-width="1"/>
        <line x1="61" y1="44" x2="66" y2="44" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="61" y1="50" x2="66" y2="50" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="61" y1="56" x2="66" y2="56" stroke="rgba(80,80,0,0.6)" stroke-width="1"/>
        <line x1="44" y1="34" x2="44" y2="39" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="50" y1="34" x2="50" y2="39" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="56" y1="34" x2="56" y2="39" stroke="rgba(80,80,0,0.6)" stroke-width="1"/>
        <line x1="44" y1="61" x2="44" y2="66" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="50" y1="61" x2="50" y2="66" stroke="rgba(80,80,0,0.6)" stroke-width="1"/><line x1="56" y1="61" x2="56" y2="66" stroke="rgba(80,80,0,0.6)" stroke-width="1"/>
      </pattern>

      <!-- RED Pattern - dark shade (maroon) -->
      <pattern id="circuit-pattern-red" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(100,20,20,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="60" y1="20" x2="100" y2="20" stroke="rgba(100,20,20,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite"/></line>
        <line x1="0" y1="50" x2="30" y2="50" stroke="rgba(100,20,20,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="70" y1="50" x2="100" y2="50" stroke="rgba(100,20,20,0.6)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(100,20,20,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.3s" repeatCount="indefinite"/></line>
        <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(100,20,20,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="80" y1="0" x2="80" y2="50" stroke="rgba(100,20,20,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"/></line>
        <path d="M40,20 L50,20 L50,30" fill="none" stroke="rgba(120,30,30,0.7)" stroke-width="1.5" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.7s" repeatCount="indefinite"/></path>
        <!-- QFP IC chip 14x14 -->
        <rect x="43" y="43" width="14" height="14" fill="rgba(5,5,15,0.9)" stroke="rgba(120,30,30,0.8)" stroke-width="1"><animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/></rect>
        <circle cx="45" cy="45" r="1.2" fill="rgba(120,30,30,0.8)"/>
        <line x1="39" y1="46" x2="43" y2="46" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="39" y1="50" x2="43" y2="50" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="39" y1="54" x2="43" y2="54" stroke="rgba(100,20,20,0.6)" stroke-width="1"/>
        <line x1="57" y1="46" x2="61" y2="46" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="57" y1="50" x2="61" y2="50" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="57" y1="54" x2="61" y2="54" stroke="rgba(100,20,20,0.6)" stroke-width="1"/>
        <line x1="46" y1="39" x2="46" y2="43" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="50" y1="39" x2="50" y2="43" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="54" y1="39" x2="54" y2="43" stroke="rgba(100,20,20,0.6)" stroke-width="1"/>
        <line x1="46" y1="57" x2="46" y2="61" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="50" y1="57" x2="50" y2="61" stroke="rgba(100,20,20,0.6)" stroke-width="1"/><line x1="54" y1="57" x2="54" y2="61" stroke="rgba(100,20,20,0.6)" stroke-width="1"/>
        <!-- PLCC socket style -->
        <rect x="5" y="5" width="16" height="16" fill="rgba(5,5,15,0.7)" stroke="rgba(120,30,30,0.6)" stroke-width="1"/>
        <rect x="7" y="7" width="12" height="12" fill="rgba(15,5,5,0.9)" stroke="rgba(120,30,30,0.8)" stroke-width="0.5"/>
        <circle cx="9" cy="9" r="1" fill="rgba(120,30,30,0.7)"/>
        <!-- Electrolytic capacitor -->
        <circle cx="85" cy="85" r="6" fill="rgba(5,5,15,0.8)" stroke="rgba(120,30,30,0.7)" stroke-width="1"/>
        <line x1="83" y1="85" x2="87" y2="85" stroke="rgba(120,30,30,0.5)" stroke-width="0.5"/>
        <line x1="85" y1="79" x2="85" y2="77" stroke="rgba(100,20,20,0.6)" stroke-width="1"/>
        <line x1="85" y1="91" x2="85" y2="93" stroke="rgba(100,20,20,0.6)" stroke-width="1"/>
        <!-- Diode -->
        <polygon points="10,75 18,80 10,85" fill="rgba(120,30,30,0.5)" stroke="rgba(120,30,30,0.7)" stroke-width="0.5"/>
        <line x1="18" y1="75" x2="18" y2="85" stroke="rgba(120,30,30,0.7)" stroke-width="1"/>
      </pattern>

      <!-- BLUE Pattern - dark shade (navy) -->
      <pattern id="circuit-pattern-blue" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(30,40,100,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="60" y1="20" x2="100" y2="20" stroke="rgba(30,40,100,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite"/></line>
        <line x1="0" y1="50" x2="30" y2="50" stroke="rgba(30,40,100,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="70" y1="50" x2="100" y2="50" stroke="rgba(30,40,100,0.6)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(30,40,100,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.3s" repeatCount="indefinite"/></line>
        <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(30,40,100,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="80" y1="0" x2="80" y2="50" stroke="rgba(30,40,100,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"/></line>
        <path d="M40,20 L50,20 L50,30" fill="none" stroke="rgba(40,50,120,0.7)" stroke-width="1.5" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.7s" repeatCount="indefinite"/></path>
        <!-- Large QFP IC chip 20x20 -->
        <rect x="40" y="40" width="20" height="20" fill="rgba(5,5,15,0.9)" stroke="rgba(40,50,120,0.8)" stroke-width="1"><animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/></rect>
        <circle cx="43" cy="43" r="1.8" fill="rgba(40,50,120,0.8)"/>
        <line x1="35" y1="44" x2="40" y2="44" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="35" y1="50" x2="40" y2="50" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="35" y1="56" x2="40" y2="56" stroke="rgba(30,40,100,0.6)" stroke-width="1"/>
        <line x1="60" y1="44" x2="65" y2="44" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="60" y1="50" x2="65" y2="50" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="60" y1="56" x2="65" y2="56" stroke="rgba(30,40,100,0.6)" stroke-width="1"/>
        <line x1="44" y1="35" x2="44" y2="40" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="50" y1="35" x2="50" y2="40" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="56" y1="35" x2="56" y2="40" stroke="rgba(30,40,100,0.6)" stroke-width="1"/>
        <line x1="44" y1="60" x2="44" y2="65" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="50" y1="60" x2="50" y2="65" stroke="rgba(30,40,100,0.6)" stroke-width="1"/><line x1="56" y1="60" x2="56" y2="65" stroke="rgba(30,40,100,0.6)" stroke-width="1"/>
        <!-- USB connector style -->
        <rect x="5" y="75" width="14" height="8" fill="rgba(5,5,15,0.9)" stroke="rgba(40,50,120,0.7)" stroke-width="1" rx="1"/>
        <rect x="7" y="77" width="10" height="4" fill="rgba(30,40,100,0.4)" stroke="none"/>
        <!-- Voltage regulator TO-220 -->
        <rect x="80" y="5" width="15" height="10" fill="rgba(5,5,15,0.9)" stroke="rgba(40,50,120,0.7)" stroke-width="1"/>
        <rect x="82" y="3" width="11" height="4" fill="rgba(30,40,100,0.3)" stroke="rgba(40,50,120,0.5)" stroke-width="0.5"/>
        <line x1="84" y1="15" x2="84" y2="18" stroke="rgba(30,40,100,0.6)" stroke-width="1"/>
        <line x1="88" y1="15" x2="88" y2="18" stroke="rgba(30,40,100,0.6)" stroke-width="1"/>
        <line x1="92" y1="15" x2="92" y2="18" stroke="rgba(30,40,100,0.6)" stroke-width="1"/>
        <!-- Inductor coil -->
        <path d="M5,5 Q8,2 11,5 Q14,8 17,5 Q20,2 23,5" fill="none" stroke="rgba(40,50,120,0.7)" stroke-width="1.5"/>
        <line x1="3" y1="5" x2="5" y2="5" stroke="rgba(30,40,100,0.6)" stroke-width="1"/>
        <line x1="23" y1="5" x2="25" y2="5" stroke="rgba(30,40,100,0.6)" stroke-width="1"/>
      </pattern>

      <!-- ORANGE Pattern - dark shade (burnt orange/brown) -->
      <pattern id="circuit-pattern-orange" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(100,50,0,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite"/></line>
        <line x1="60" y1="20" x2="100" y2="20" stroke="rgba(100,50,0,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.2s" repeatCount="indefinite"/></line>
        <line x1="0" y1="50" x2="30" y2="50" stroke="rgba(100,50,0,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="0.8s" repeatCount="indefinite"/></line>
        <line x1="70" y1="50" x2="100" y2="50" stroke="rgba(100,50,0,0.6)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="1.1s" repeatCount="indefinite"/></line>
        <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(100,50,0,0.6)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.3s" repeatCount="indefinite"/></line>
        <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(100,50,0,0.5)" stroke-width="1.5" stroke-dasharray="3 3"><animate attributeName="stroke-dashoffset" from="12" to="0" dur="0.9s" repeatCount="indefinite"/></line>
        <line x1="80" y1="0" x2="80" y2="50" stroke="rgba(100,50,0,0.5)" stroke-width="1.5" stroke-dasharray="4 2"><animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite"/></line>
        <path d="M40,20 L50,20 L50,30" fill="none" stroke="rgba(120,60,0,0.7)" stroke-width="1.5" stroke-dasharray="3 2"><animate attributeName="stroke-dashoffset" from="0" to="10" dur="0.7s" repeatCount="indefinite"/></path>
        <!-- Small DIP IC chip 12x12 -->
        <rect x="44" y="44" width="12" height="12" fill="rgba(5,5,15,0.9)" stroke="rgba(120,60,0,0.8)" stroke-width="1"><animate attributeName="stroke-opacity" values="0.6;0.9;0.6" dur="3s" repeatCount="indefinite"/></rect>
        <circle cx="46" cy="46" r="1" fill="rgba(120,60,0,0.8)"/>
        <line x1="40" y1="47" x2="44" y2="47" stroke="rgba(100,50,0,0.6)" stroke-width="1"/><line x1="40" y1="53" x2="44" y2="53" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <line x1="56" y1="47" x2="60" y2="47" stroke="rgba(100,50,0,0.6)" stroke-width="1"/><line x1="56" y1="53" x2="60" y2="53" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <line x1="47" y1="40" x2="47" y2="44" stroke="rgba(100,50,0,0.6)" stroke-width="1"/><line x1="53" y1="40" x2="53" y2="44" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <line x1="47" y1="56" x2="47" y2="60" stroke="rgba(100,50,0,0.6)" stroke-width="1"/><line x1="53" y1="56" x2="53" y2="60" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <!-- Memory chip style -->
        <rect x="5" y="5" width="20" height="12" fill="rgba(5,5,15,0.9)" stroke="rgba(120,60,0,0.7)" stroke-width="1"/>
        <circle cx="8" cy="8" r="1" fill="rgba(120,60,0,0.7)"/>
        <line x1="8" y1="17" x2="8" y2="20" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <line x1="12" y1="17" x2="12" y2="20" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <line x1="16" y1="17" x2="16" y2="20" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <line x1="20" y1="17" x2="20" y2="20" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <!-- LED -->
        <circle cx="85" cy="85" r="4" fill="rgba(120,60,0,0.4)" stroke="rgba(120,60,0,0.8)" stroke-width="1"/>
        <circle cx="85" cy="85" r="2" fill="rgba(150,80,0,0.6)"/>
        <line x1="85" y1="89" x2="85" y2="92" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <line x1="83" y1="89" x2="83" y2="92" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <!-- Fuse -->
        <rect x="75" y="5" width="8" height="4" fill="rgba(120,60,0,0.3)" stroke="rgba(120,60,0,0.6)" stroke-width="0.5" rx="1"/>
        <line x1="73" y1="7" x2="75" y2="7" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
        <line x1="83" y1="7" x2="85" y2="7" stroke="rgba(100,50,0,0.6)" stroke-width="1"/>
      </pattern>

      <!-- Glow filters -->
      <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="glow-magenta" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="glow-yellow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <!-- Electric pulse gradient -->
      <linearGradient id="electric-pulse-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00ffff" stop-opacity="0">
          <animate attributeName="offset" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>
        </stop>
        <stop offset="15%" stop-color="#00ffff" stop-opacity="1">
          <animate attributeName="offset" values="0.15;1;0.15" dur="1.5s" repeatCount="indefinite"/>
        </stop>
        <stop offset="30%" stop-color="#00ffff" stop-opacity="0">
          <animate attributeName="offset" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite"/>
        </stop>
      </linearGradient>

      <linearGradient id="electric-pulse-magenta" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ff00ff" stop-opacity="0">
          <animate attributeName="offset" values="0;1;0" dur="2s" repeatCount="indefinite"/>
        </stop>
        <stop offset="20%" stop-color="#ff00ff" stop-opacity="1">
          <animate attributeName="offset" values="0.2;1;0.2" dur="2s" repeatCount="indefinite"/>
        </stop>
        <stop offset="40%" stop-color="#ff00ff" stop-opacity="0">
          <animate attributeName="offset" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
        </stop>
      </linearGradient>
    </defs>

    <!-- Background pattern tiles - only visible tiles are rendered -->
    {#each circuitTiles.filter(t => t.visible) as tile (tile.id)}
      <rect
        x={tile.x}
        y={tile.y}
        width="100"
        height="100"
        fill="url(#circuit-pattern-{tile.colorScheme})"
        style="opacity: {tile.opacity};"
      />
    {/each}

    <!-- Animated electric currents following circuit paths -->
    <g class="electric-paths">
      <!-- Path 1: Horizontal at 20% with turn down -->
      <path class="circuit-path path-1"
            d="M0,20 L40,20 L50,20 L50,30 L50,70 L50,80 L60,80 L100,80"
            fill="none"
            stroke="#00ffff"
            stroke-width="2"
            filter="url(#glow-cyan)"
            stroke-dasharray="20 180"
            stroke-linecap="round">
        <animate attributeName="stroke-dashoffset" from="200" to="0" dur="3s" repeatCount="indefinite"/>
      </path>

      <!-- Path 2: Vertical left side -->
      <path class="circuit-path path-2"
            d="M20,0 L20,20 L20,40 L20,100"
            fill="none"
            stroke="#ff00ff"
            stroke-width="2"
            filter="url(#glow-magenta)"
            stroke-dasharray="15 135"
            stroke-linecap="round">
        <animate attributeName="stroke-dashoffset" from="150" to="0" dur="2.5s" repeatCount="indefinite" begin="0.5s"/>
      </path>

      <!-- Path 3: Right side path -->
      <path class="circuit-path path-3"
            d="M100,20 L80,20 L80,50 L80,60 L70,60 L50,60 L50,50"
            fill="none"
            stroke="#00ffff"
            stroke-width="2"
            filter="url(#glow-cyan)"
            stroke-dasharray="18 162"
            stroke-linecap="round">
        <animate attributeName="stroke-dashoffset" from="180" to="0" dur="4s" repeatCount="indefinite" begin="1s"/>
      </path>

      <!-- Path 4: Bottom horizontal -->
      <path class="circuit-path path-4"
            d="M0,50 L30,50 L50,50 L70,50 L100,50"
            fill="none"
            stroke="#00ffff"
            stroke-width="2"
            filter="url(#glow-cyan)"
            stroke-dasharray="25 175"
            stroke-linecap="round">
        <animate attributeName="stroke-dashoffset" from="0" to="200" dur="3.5s" repeatCount="indefinite" begin="1.5s"/>
      </path>

      <!-- Path 5: Vertical right -->
      <path class="circuit-path path-5"
            d="M80,100 L80,80 L80,70 L80,50 L80,0"
            fill="none"
            stroke="#ff00ff"
            stroke-width="2"
            filter="url(#glow-magenta)"
            stroke-dasharray="12 138"
            stroke-linecap="round">
        <animate attributeName="stroke-dashoffset" from="150" to="0" dur="2.8s" repeatCount="indefinite" begin="2s"/>
      </path>

      <!-- Path 6: Center vertical -->
      <path class="circuit-path path-6"
            d="M50,30 L50,50 L50,70"
            fill="none"
            stroke="#00ffff"
            stroke-width="2"
            filter="url(#glow-cyan)"
            stroke-dasharray="10 90"
            stroke-linecap="round">
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" begin="0.8s"/>
      </path>
    </g>

    <!-- Traveling electricity sparks -->
    <g class="electricity-sparks">
      <!-- Spark traveling on path 1 -->
      <circle r="3" fill="#00ffff" filter="url(#glow-cyan)">
        <animateMotion dur="2s" repeatCount="indefinite" path="M0,20 L40,20 L50,20 L50,30 L50,70 L50,80 L60,80 L100,80"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="r" values="2;4;2" dur="0.3s" repeatCount="indefinite"/>
      </circle>

      <!-- Spark traveling on path 2 -->
      <circle r="3" fill="#ff00ff" filter="url(#glow-magenta)">
        <animateMotion dur="1.8s" repeatCount="indefinite" begin="0.5s" path="M20,0 L20,20 L20,40 L20,100"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="1.8s" repeatCount="indefinite" begin="0.5s"/>
        <animate attributeName="r" values="2;4;2" dur="0.25s" repeatCount="indefinite"/>
      </circle>

      <!-- Spark traveling on path 3 -->
      <circle r="3" fill="#00ffff" filter="url(#glow-cyan)">
        <animateMotion dur="2.5s" repeatCount="indefinite" begin="1s" path="M100,20 L80,20 L80,50 L80,60 L70,60 L50,60 L50,50"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" repeatCount="indefinite" begin="1s"/>
        <animate attributeName="r" values="2;4;2" dur="0.35s" repeatCount="indefinite"/>
      </circle>

      <!-- Spark traveling on path 4 (reverse direction) -->
      <circle r="3" fill="#00ffff" filter="url(#glow-cyan)">
        <animateMotion dur="2.2s" repeatCount="indefinite" begin="1.5s" path="M100,50 L70,50 L50,50 L30,50 L0,50"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="2.2s" repeatCount="indefinite" begin="1.5s"/>
        <animate attributeName="r" values="2;4;2" dur="0.28s" repeatCount="indefinite"/>
      </circle>

      <!-- Spark traveling on path 5 -->
      <circle r="3" fill="#ff00ff" filter="url(#glow-magenta)">
        <animateMotion dur="1.6s" repeatCount="indefinite" begin="2s" path="M80,100 L80,80 L80,70 L80,50 L80,0"/>
        <animate attributeName="opacity" values="0;1;1;0" dur="1.6s" repeatCount="indefinite" begin="2s"/>
        <animate attributeName="r" values="2;4;2" dur="0.22s" repeatCount="indefinite"/>
      </circle>
    </g>

    <!-- Animated glowing nodes -->
    <g class="pulse-nodes">
      <circle cx="20" cy="20" r="4" fill="#00ffff" filter="url(#glow-cyan)">
        <animate attributeName="r" values="3;8;3" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="50" cy="50" r="5" fill="#ff00ff" filter="url(#glow-magenta)">
        <animate attributeName="r" values="4;9;4" dur="2s" repeatCount="indefinite" begin="0.3s"/>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="0.3s"/>
      </circle>
      <circle cx="80" cy="20" r="3" fill="#00ffff" filter="url(#glow-cyan)">
        <animate attributeName="r" values="2;7;2" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
      </circle>
      <circle cx="80" cy="80" r="4" fill="#00ffff" filter="url(#glow-cyan)">
        <animate attributeName="r" values="3;8;3" dur="1.6s" repeatCount="indefinite" begin="1s"/>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" begin="1s"/>
      </circle>
      <circle cx="50" cy="80" r="3" fill="#ff00ff" filter="url(#glow-magenta)">
        <animate attributeName="r" values="2;7;2" dur="1.4s" repeatCount="indefinite" begin="1.5s"/>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.4s" repeatCount="indefinite" begin="1.5s"/>
      </circle>

      <!-- Expanding spark rings at nodes -->
      <circle cx="20" cy="20" r="6" fill="none" stroke="#00ffff" stroke-width="2" filter="url(#glow-cyan)">
        <animate attributeName="r" values="4;14;4" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="stroke-width" values="2;0;2" dur="1.8s" repeatCount="indefinite"/>
      </circle>
      <circle cx="50" cy="50" r="6" fill="none" stroke="#ff00ff" stroke-width="2" filter="url(#glow-magenta)">
        <animate attributeName="r" values="5;16;5" dur="2s" repeatCount="indefinite" begin="0.3s"/>
        <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" begin="0.3s"/>
        <animate attributeName="stroke-width" values="2;0;2" dur="2s" repeatCount="indefinite" begin="0.3s"/>
      </circle>
      <circle cx="80" cy="20" r="5" fill="none" stroke="#00ffff" stroke-width="2" filter="url(#glow-cyan)">
        <animate attributeName="r" values="3;12;3" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
        <animate attributeName="stroke-width" values="2;0;2" dur="1.5s" repeatCount="indefinite" begin="0.6s"/>
      </circle>
    </g>
  </svg>
</div>

<main>
  <Hero />
  <About />
  <Experience />
  <Projects />
  <Skills />
  <Contact />
</main>
<footer>
  <p>Built with Svelte</p>
</footer>

<style>
  /* Neural Network Canvas */
  .neural-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -2;
    transition: opacity 0.15s ease-out;
    mask-image: linear-gradient(to bottom, black 0%, black 60%, transparent 100%);
    -webkit-mask-image: linear-gradient(to bottom, black 0%, black 60%, transparent 100%);
  }

  /* Floating Code Snippets */
  .code-snippets-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }

  .floating-code {
    position: absolute;
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 0.7rem;
    line-height: 1.4;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    background: rgba(10, 10, 20, 0.5);
    border: 1px solid rgba(100, 100, 100, 0.15);
    transition: opacity 1s ease;
    white-space: pre;
    max-width: 280px;
  }

  .floating-code.python {
    color: rgba(0, 255, 150, 0.6);
    border-color: rgba(0, 255, 150, 0.15);
  }

  .floating-code.js {
    color: rgba(0, 255, 100, 0.6);
    border-color: rgba(0, 255, 100, 0.15);
  }

  .floating-code .cursor {
    animation: blink 0.8s infinite;
    color: rgba(255, 255, 255, 0.4);
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
    color: #e4e4e7;
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
  }


  /* Chromatic Aberration Keyframes */
  @keyframes -global-glitch {
    0%, 100% {
      text-shadow:
        -2px 0 #ff00ff,
        2px 0 #00ffff;
    }
    25% {
      text-shadow:
        2px 0 #ff00ff,
        -2px 0 #00ffff;
    }
    50% {
      text-shadow:
        -1px -1px #ff00ff,
        1px 1px #00ffff;
    }
    75% {
      text-shadow:
        1px -1px #ff00ff,
        -1px 1px #00ffff;
    }
  }

  @keyframes -global-glitch-skew {
    0%, 100% { transform: skew(0deg); }
    20% { transform: skew(-2deg); }
    40% { transform: skew(2deg); }
    60% { transform: skew(-1deg); }
    80% { transform: skew(1deg); }
  }

  @keyframes -global-comic-pop {
    0% { transform: scale(1) rotate(0deg); }
    25% { transform: scale(1.02) rotate(-1deg); }
    50% { transform: scale(1) rotate(0deg); }
    75% { transform: scale(1.02) rotate(1deg); }
    100% { transform: scale(1) rotate(0deg); }
  }

  @keyframes -global-float-3d {
    0%, 100% {
      transform: translateY(0) rotateX(0deg) rotateY(0deg);
    }
    25% {
      transform: translateY(-10px) rotateX(2deg) rotateY(-2deg);
    }
    50% {
      transform: translateY(-5px) rotateX(-1deg) rotateY(1deg);
    }
    75% {
      transform: translateY(-15px) rotateX(1deg) rotateY(-1deg);
    }
  }

  @keyframes -global-ink-spread {
    0% {
      clip-path: circle(0% at 50% 50%);
      opacity: 0;
    }
    100% {
      clip-path: circle(100% at 50% 50%);
      opacity: 1;
    }
  }

  :global(.spiderverse-text) {
    animation: glitch 3s infinite;
    position: relative;
  }

  :global(.spiderverse-text::before),
  :global(.spiderverse-text::after) {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  :global(.spiderverse-text::before) {
    color: #ff00ff;
    animation: glitch-skew 2s infinite;
    clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
    transform: translateX(-2px);
    opacity: 0.8;
  }

  :global(.spiderverse-text::after) {
    color: #00ffff;
    animation: glitch-skew 2s infinite reverse;
    clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
    transform: translateX(2px);
    opacity: 0.8;
  }

  :global(a) {
    color: #00d4ff;
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
  }

  :global(a:hover) {
    color: #00ffff;
    text-shadow:
      -1px 0 #ff00ff,
      1px 0 #00ffff,
      0 0 10px #00ffff;
  }

  :global(section) {
    padding: 5rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
    perspective: 1000px;
  }

  :global(h2) {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    background: linear-gradient(135deg, #ff00ff, #00ffff, #ffff00);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: comic-pop 4s ease-in-out infinite;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 900;
    position: relative;
  }

  :global(h2::after) {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #ff00ff, #00ffff, #ffff00);
    transform: skewX(-12deg);
  }

  main {
    position: relative;
  }

  footer {
    text-align: center;
    padding: 2rem;
    color: #71717a;
    border-top: 3px solid;
    border-image: linear-gradient(90deg, #ff00ff, #00ffff, #ffff00) 1;
    position: relative;
  }

  footer p {
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 3px;
  }

  /* Circuit Board Background Styles */
  .circuit-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    overflow: visible;
  }

  .circuit-svg {
    width: 100%;
    height: 100%;
    opacity: 0.8;
  }

  /* Electric path styling */
  .electric-paths {
    opacity: 0.9;
  }

  .circuit-path {
    opacity: 0.8;
  }

  .pulse-nodes circle {
    opacity: 0.9;
  }
</style>
