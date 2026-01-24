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

  // Neural network configuration
  const config = {
    nodeCount: 60,
    connectionDistance: 150,
    nodeSpeed: 0.3,
    signalSpeed: 3,
    signalSpawnRate: 0.02,
    glitchChance: 0.003,
    glitchDuration: 150,
    colors: {
      node: ['#00ffff', '#ff00ff', '#ffff00', '#00ff88'],
      connection: 'rgba(0, 255, 255, 0.15)',
      signal: ['#00ffff', '#ff00ff', '#ffff00'],
      glitch: ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff']
    }
  };

  class Node {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * config.nodeSpeed;
      this.vy = (Math.random() - 0.5) * config.nodeSpeed;
      this.radius = Math.random() * 3 + 2;
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

  onMount(() => {
    ctx = canvas.getContext('2d');
    handleResize();
    handleScroll();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<Nav />

<!-- Animated Neural Network Background Canvas -->
<canvas bind:this={canvas} class="neural-canvas" style="opacity: {canvasOpacity}"></canvas>

<!-- Circuit Board Background -->
<div class="circuit-bg">
  <svg class="circuit-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <!-- Base circuit pattern -->
      <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <!-- Horizontal lines -->
        <line x1="0" y1="20" x2="40" y2="20" stroke="rgba(0,255,255,0.15)" stroke-width="1"/>
        <line x1="60" y1="20" x2="100" y2="20" stroke="rgba(255,0,255,0.15)" stroke-width="1"/>
        <line x1="0" y1="50" x2="30" y2="50" stroke="rgba(255,0,255,0.15)" stroke-width="1"/>
        <line x1="70" y1="50" x2="100" y2="50" stroke="rgba(0,255,255,0.15)" stroke-width="1"/>
        <line x1="0" y1="80" x2="50" y2="80" stroke="rgba(255,255,0,0.1)" stroke-width="1"/>

        <!-- Vertical lines -->
        <line x1="20" y1="0" x2="20" y2="40" stroke="rgba(0,255,255,0.15)" stroke-width="1"/>
        <line x1="50" y1="30" x2="50" y2="70" stroke="rgba(255,0,255,0.15)" stroke-width="1"/>
        <line x1="80" y1="0" x2="80" y2="50" stroke="rgba(255,255,0,0.1)" stroke-width="1"/>
        <line x1="80" y1="70" x2="80" y2="100" stroke="rgba(0,255,255,0.15)" stroke-width="1"/>

        <!-- Corner turns -->
        <path d="M40,20 L50,20 L50,30" fill="none" stroke="rgba(0,255,255,0.2)" stroke-width="1"/>
        <path d="M50,70 L50,80 L60,80" fill="none" stroke="rgba(255,0,255,0.2)" stroke-width="1"/>
        <path d="M80,50 L80,60 L70,60" fill="none" stroke="rgba(255,255,0,0.15)" stroke-width="1"/>

        <!-- Circuit nodes/dots -->
        <circle cx="20" cy="20" r="3" fill="rgba(0,255,255,0.3)"/>
        <circle cx="50" cy="50" r="4" fill="rgba(255,0,255,0.3)"/>
        <circle cx="80" cy="20" r="2" fill="rgba(255,255,0,0.3)"/>
        <circle cx="40" cy="80" r="3" fill="rgba(0,255,255,0.3)"/>
        <circle cx="80" cy="80" r="2" fill="rgba(255,0,255,0.3)"/>

        <!-- IC chip shapes -->
        <rect x="45" y="45" width="10" height="10" fill="none" stroke="rgba(0,255,255,0.2)" stroke-width="1"/>
        <rect x="15" y="75" width="8" height="8" fill="none" stroke="rgba(255,0,255,0.2)" stroke-width="1"/>
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
    </defs>

    <!-- Background pattern -->
    <rect width="100%" height="100%" fill="url(#circuit-pattern)"/>

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
            stroke="#ffff00"
            stroke-width="2"
            filter="url(#glow-yellow)"
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
            stroke="#ffff00"
            stroke-width="2"
            filter="url(#glow-yellow)"
            stroke-dasharray="10 90"
            stroke-linecap="round">
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" begin="0.8s"/>
      </path>
    </g>

    <!-- Animated glowing nodes -->
    <g class="pulse-nodes">
      <circle cx="20" cy="20" r="4" fill="#00ffff" filter="url(#glow-cyan)">
        <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="50" cy="50" r="5" fill="#ff00ff" filter="url(#glow-magenta)">
        <animate attributeName="r" values="4;7;4" dur="2.5s" repeatCount="indefinite" begin="0.3s"/>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" begin="0.3s"/>
      </circle>
      <circle cx="80" cy="20" r="3" fill="#ffff00" filter="url(#glow-yellow)">
        <animate attributeName="r" values="2;5;2" dur="1.8s" repeatCount="indefinite" begin="0.6s"/>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" begin="0.6s"/>
      </circle>
      <circle cx="80" cy="80" r="4" fill="#00ffff" filter="url(#glow-cyan)">
        <animate attributeName="r" values="3;6;3" dur="2.2s" repeatCount="indefinite" begin="1s"/>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite" begin="1s"/>
      </circle>
      <circle cx="50" cy="80" r="3" fill="#ff00ff" filter="url(#glow-magenta)">
        <animate attributeName="r" values="2;5;2" dur="1.5s" repeatCount="indefinite" begin="1.5s"/>
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" begin="1.5s"/>
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

  /* Spider-Verse Halftone Overlay */
  :global(body::before) {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
    background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 4px 4px;
    opacity: 0.5;
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
    overflow: hidden;
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
