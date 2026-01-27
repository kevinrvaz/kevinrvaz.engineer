<script>
  import { onMount } from 'svelte';
  import Hero from './components/Hero.svelte';
  import About from './components/About.svelte';
  import Experience from './components/Experience.svelte';
  import Projects from './components/Projects.svelte';
  import Skills from './components/Skills.svelte';
  import Contact from './components/Contact.svelte';
  import Nav from './components/Nav.svelte';
  import CodeSnippets from './components/CodeSnippets.svelte';
  import CircuitBoard from './components/CircuitBoard.svelte';
  import { createNeuralNetwork } from './lib/neuralNetwork.js';
  import { createCodeSnippetManager } from './lib/codeSnippets.js';
  import { createCircuitTileManager } from './lib/circuitTiles.js';

  let canvas;
  let canvasOpacity = 0.7;
  let codeSnippets = [];
  let circuitTiles = [];

  function handleScroll() {
    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
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
    const network = createNeuralNetwork(canvas);
    network.start();

    const snippetManager = createCodeSnippetManager((updated) => {
      codeSnippets = updated;
    });
    snippetManager.start();

    const tileManager = createCircuitTileManager((updated) => {
      circuitTiles = updated;
    });
    tileManager.start();

    handleScroll();

    const onResize = () => {
      network.handleResize();
      tileManager.regenerate();
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', handleScroll);
      network.cleanup();
      snippetManager.stop();
      tileManager.stop();
    };
  });
</script>

<Nav />

<!-- Animated Neural Network Background Canvas -->
<canvas bind:this={canvas} class="neural-canvas" style="opacity: {canvasOpacity}"></canvas>

<!-- Floating Code Snippets -->
<CodeSnippets snippets={codeSnippets} />

<!-- Circuit Board Background -->
<CircuitBoard {circuitTiles} />

<main>
  <Hero />
  <About />
  <Experience />
  <Projects />
  <Skills />
  <Contact />
</main>

<style>
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
</style>
