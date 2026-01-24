<script>
  import { onMount } from 'svelte';

  let visible = false;

  onMount(() => {
    visible = true;
  });
</script>

<section id="hero" class:visible>
  <div class="hero-content">
    <p class="greeting">Hi, my name is</p>
    <h1>Kevin Rohan Vaz</h1>
    <h2>I build things for the web and AI.</h2>
    <p class="description">
      Senior Software Engineer at <a href="https://smartbear.com" target="_blank" rel="noopener noreferrer">SmartBear</a>,
      specializing in Software Engineering, Machine Learning, and Generative AI.
      Based in Bengaluru, India.
    </p>
    <div class="cta-buttons">
      <a href="#projects" class="btn primary">View My Work</a>
      <a href="#contact" class="btn secondary">Get In Touch</a>
    </div>
  </div>
  <div class="hero-decoration">
    <div class="code-block">
      <pre><code><span class="keyword">const</span> engineer = {`{`}
  name: <span class="string">"Kevin Rohan Vaz"</span>,
  role: <span class="string">"Senior Software Engineer"</span>,
  focus: [<span class="string">"AI"</span>, <span class="string">"ML"</span>, <span class="string">"APIs"</span>],
  loves: <span class="string">"Open Source"</span>
{`}`};</code></pre>
    </div>
  </div>
</section>

<style>
  section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4rem;
    padding-top: 6rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease;
  }

  section.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hero-content {
    flex: 1;
  }

  .greeting {
    color: #00d4ff;
    font-family: 'Fira Code', monospace;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 0.5rem;
  }

  h2 {
    font-size: clamp(1.5rem, 4vw, 3rem);
    color: #71717a;
    margin-bottom: 1.5rem;
    background: none;
    -webkit-text-fill-color: #71717a;
  }

  .description {
    font-size: 1.1rem;
    color: #a1a1aa;
    max-width: 540px;
    margin-bottom: 2rem;
  }

  .cta-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn {
    padding: 0.875rem 1.75rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .btn.primary {
    background: linear-gradient(135deg, #00d4ff, #00a8cc);
    color: #0a0a0f;
  }

  .btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
  }

  .btn.secondary {
    border: 1px solid #00d4ff;
    color: #00d4ff;
  }

  .btn.secondary:hover {
    background: rgba(0, 212, 255, 0.1);
  }

  .hero-decoration {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .code-block {
    background: rgba(26, 26, 46, 0.8);
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 2rem;
    font-family: 'Fira Code', monospace;
    font-size: 0.9rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  }

  .code-block pre {
    margin: 0;
  }

  .keyword {
    color: #c792ea;
  }

  .string {
    color: #c3e88d;
  }

  @media (max-width: 900px) {
    section {
      flex-direction: column;
      text-align: center;
    }

    .description {
      margin-left: auto;
      margin-right: auto;
    }

    .cta-buttons {
      justify-content: center;
    }

    .hero-decoration {
      width: 100%;
    }

    .code-block {
      font-size: 0.8rem;
    }
  }
</style>
