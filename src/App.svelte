<script>
  import Hero from './components/Hero.svelte';
  import About from './components/About.svelte';
  import Experience from './components/Experience.svelte';
  import Projects from './components/Projects.svelte';
  import Skills from './components/Skills.svelte';
  import Contact from './components/Contact.svelte';
  import Nav from './components/Nav.svelte';
</script>

<Nav />
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
  }

  :global(a) {
    color: #00d4ff;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  :global(a:hover) {
    color: #00ffcc;
  }

  :global(section) {
    padding: 5rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  :global(h2) {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    background: linear-gradient(135deg, #00d4ff, #00ffcc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  main {
    position: relative;
  }

  footer {
    text-align: center;
    padding: 2rem;
    color: #71717a;
    border-top: 1px solid #27272a;
  }
</style>
