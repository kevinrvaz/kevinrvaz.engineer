<script>
  import { onMount } from 'svelte';

  let visible = false;
  let mouseX = 0;
  let mouseY = 0;

  onMount(() => {
    visible = true;

    // 3D parallax effect on mouse move
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  });

  function handleNavClick(event, href) {
    event.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      history.pushState(null, '', href);
    }
  }
</script>

<section id="hero" class:visible>
  <div class="hero-left">
    <div class="hero-content" style="transform: perspective(1000px) rotateX({mouseY * 0.1}deg) rotateY({mouseX * 0.1}deg)">
      <p class="greeting">
        <span class="comic-bubble">Hi, my name is</span>
      </p>
      <h1 class="glitch-title" data-text="Kevin Rohan Vaz">
        <span class="glitch-layer glitch-r" aria-hidden="true">Kevin Rohan Vaz</span>
        <span class="glitch-layer glitch-g" aria-hidden="true">Kevin Rohan Vaz</span>
        <span class="glitch-layer glitch-b" aria-hidden="true">Kevin Rohan Vaz</span>
        <span class="glitch-main">
          <span class="name-word"><span class="letter-k">K</span><span class="letter">e</span><span class="letter">v</span><span class="letter">i</span><span class="letter">n</span></span>{' '}
          <span class="name-word"><span class="letter-r">R</span><span class="letter">o</span><span class="letter">h</span><span class="letter">a</span><span class="letter">n</span></span>{' '}
          <span class="name-word"><span class="letter-v">V</span><span class="letter">a</span><span class="letter">z</span></span>
        </span>
      </h1>
      <h2 class="tagline">
        <span class="word">I</span>
        <span class="word">build</span>
        <span class="word highlight">things</span>
        <span class="word">for</span>
        <span class="word">the</span>
        <span class="word highlight">web</span>
        <span class="word">and</span>
        <span class="word highlight">AI.</span>
      </h2>
      <p class="description">
        Senior Software Engineer at <a href="https://smartbear.com" target="_blank" rel="noopener noreferrer">SmartBear</a>,
        specializing in Software Engineering, Machine Learning, and Generative AI.
        Based in Bengaluru, India.
      </p>
    </div>
    <div class="cta-buttons">
      <a href="#projects" class="btn primary comic-btn" on:click={(e) => handleNavClick(e, '#projects')}>
        <span class="btn-text">View My Work</span>
        <span class="btn-shadow"></span>
      </a>
      <a href="#contact" class="btn secondary comic-btn" on:click={(e) => handleNavClick(e, '#contact')}>
        <span class="btn-text">Get In Touch</span>
        <span class="btn-shadow"></span>
      </a>
    </div>
  </div>
  <div class="hero-decoration" style="transform: perspective(1000px) rotateX({-mouseY * 0.15}deg) rotateY({-mouseX * 0.15}deg)">
    <!-- Profile Image -->
    <div class="profile-container">
      <div class="profile-frame">
        <div class="profile-glitch">
          <img src="./githubprofile.png" alt="Kevin Rohan Vaz" class="profile-img" />
          <img src="./githubprofile.png" alt="" class="profile-img glitch-r" aria-hidden="true" />
          <img src="./githubprofile.png" alt="" class="profile-img glitch-b" aria-hidden="true" />
        </div>
      </div>
      <div class="profile-shadow"></div>
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
    transform: translateY(20px) scale(0.95);
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }

  section.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  @keyframes float-3d {
    0%, 100% { transform: translateY(0) rotateX(0deg); }
    50% { transform: translateY(-20px) rotateX(5deg); }
  }

  .hero-left {
    flex: 1;
  }

  .hero-content {
    transition: transform 0.1s ease-out;
    transform-style: preserve-3d;
  }

  .greeting {
    margin-bottom: 1rem;
  }

  .comic-bubble {
    display: inline-block;
    background: linear-gradient(135deg, #ff00ff, #00ffff);
    color: #000;
    padding: 0.5rem 1.5rem;
    border-radius: 30px;
    font-family: 'Fira Code', monospace;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    position: relative;
    animation: comic-pop 3s ease-in-out infinite;
    box-shadow:
      4px 4px 0 #000,
      0 0 20px rgba(255, 0, 255, 0.5);
  }

  .comic-bubble::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 20px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 15px solid #00ffff;
  }

  @keyframes comic-pop {
    0%, 100% { transform: scale(1) rotate(-1deg); }
    50% { transform: scale(1.05) rotate(1deg); }
  }

  .glitch-title {
    font-size: clamp(3rem, 10vw, 6rem);
    font-weight: 900;
    line-height: 1;
    margin-bottom: 1rem;
    text-transform: uppercase;
    position: relative;
    color: #fff;
  }

  .glitch-main {
    position: relative;
    display: inline-block;
    text-shadow:
      -3px -3px 0 #ff00ff,
      3px 3px 0 #00ffff,
      6px 6px 0 rgba(0, 0, 0, 0.3);
    animation: glitch-main 8s infinite;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  /* Glitch color layers */
  .glitch-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    pointer-events: none;
  }

  .glitch-r {
    color: #ff00ff;
    animation: glitch-r 8s infinite;
  }

  .glitch-g {
    color: #00ff00;
    animation: glitch-g 8s infinite;
  }

  .glitch-b {
    color: #00ffff;
    animation: glitch-b 8s infinite;
  }

  /* Main text glitch */
  @keyframes glitch-main {
    0%, 90%, 100% {
      text-shadow:
        -3px -3px 0 #ff00ff,
        3px 3px 0 #00ffff,
        6px 6px 0 rgba(0, 0, 0, 0.3);
      transform: translate(0);
    }
    91% {
      text-shadow:
        -5px -3px 0 #ff00ff,
        5px 3px 0 #00ffff,
        6px 6px 0 rgba(0, 0, 0, 0.3);
      transform: translate(-2px, 1px);
    }
    92% {
      text-shadow:
        5px -5px 0 #ff00ff,
        -5px 5px 0 #00ffff,
        -6px 6px 0 rgba(0, 0, 0, 0.3);
      transform: translate(2px, -1px);
    }
    93% {
      text-shadow:
        -3px 5px 0 #ff00ff,
        3px -5px 0 #00ffff,
        6px -6px 0 rgba(0, 0, 0, 0.3);
      transform: translate(0, 2px);
    }
    94% {
      text-shadow:
        5px 3px 0 #ff00ff,
        -5px -3px 0 #00ffff,
        -6px -6px 0 rgba(0, 0, 0, 0.3);
      transform: translate(-1px, -2px);
    }
    95% {
      text-shadow:
        -3px -3px 0 #ff00ff,
        3px 3px 0 #00ffff,
        6px 6px 0 rgba(0, 0, 0, 0.3);
      transform: translate(0);
    }
    96% {
      text-shadow:
        -8px -2px 0 #ff00ff,
        8px 2px 0 #00ffff,
        4px 8px 0 rgba(0, 0, 0, 0.3);
      transform: translate(3px, 0) skewX(-2deg);
    }
    97% {
      text-shadow:
        8px 2px 0 #ff00ff,
        -8px -2px 0 #00ffff,
        -4px 8px 0 rgba(0, 0, 0, 0.3);
      transform: translate(-3px, 0) skewX(2deg);
    }
    98% {
      text-shadow:
        2px -8px 0 #ff00ff,
        -2px 8px 0 #00ffff,
        8px 4px 0 rgba(0, 0, 0, 0.3);
      transform: translate(0, -2px) skewX(-1deg);
    }
  }

  /* Red/Magenta channel glitch */
  @keyframes glitch-r {
    0%, 89%, 100% {
      opacity: 0;
      transform: translate(0);
      clip-path: inset(0 0 100% 0);
    }
    90% {
      opacity: 0.8;
      transform: translate(-4px, -2px);
      clip-path: inset(20% 0 60% 0);
    }
    91% {
      opacity: 0.8;
      transform: translate(4px, 2px);
      clip-path: inset(50% 0 30% 0);
    }
    92% {
      opacity: 0.8;
      transform: translate(-3px, 1px);
      clip-path: inset(10% 0 70% 0);
    }
    93% {
      opacity: 0.8;
      transform: translate(2px, -3px);
      clip-path: inset(70% 0 10% 0);
    }
    94% {
      opacity: 0;
      clip-path: inset(0 0 100% 0);
    }
    95% {
      opacity: 0.9;
      transform: translate(-6px, 0);
      clip-path: inset(30% 0 50% 0);
    }
    96% {
      opacity: 0.9;
      transform: translate(5px, -1px);
      clip-path: inset(60% 0 20% 0);
    }
    97% {
      opacity: 0.7;
      transform: translate(-2px, 2px);
      clip-path: inset(5% 0 85% 0);
    }
    98% {
      opacity: 0;
      clip-path: inset(0 0 100% 0);
    }
  }

  /* Green channel glitch */
  @keyframes glitch-g {
    0%, 89%, 100% {
      opacity: 0;
      transform: translate(0);
      clip-path: inset(0 0 100% 0);
    }
    90.5% {
      opacity: 0.6;
      transform: translate(3px, 1px);
      clip-path: inset(40% 0 40% 0);
    }
    91.5% {
      opacity: 0.6;
      transform: translate(-3px, -1px);
      clip-path: inset(60% 0 25% 0);
    }
    92.5% {
      opacity: 0.6;
      transform: translate(2px, -2px);
      clip-path: inset(15% 0 65% 0);
    }
    93.5% {
      opacity: 0;
      clip-path: inset(0 0 100% 0);
    }
    95.5% {
      opacity: 0.7;
      transform: translate(4px, 1px);
      clip-path: inset(45% 0 35% 0);
    }
    96.5% {
      opacity: 0.7;
      transform: translate(-4px, -2px);
      clip-path: inset(75% 0 10% 0);
    }
    97.5% {
      opacity: 0;
      clip-path: inset(0 0 100% 0);
    }
  }

  /* Blue/Cyan channel glitch */
  @keyframes glitch-b {
    0%, 89%, 100% {
      opacity: 0;
      transform: translate(0);
      clip-path: inset(0 0 100% 0);
    }
    90.2% {
      opacity: 0.8;
      transform: translate(5px, -1px);
      clip-path: inset(25% 0 55% 0);
    }
    91.2% {
      opacity: 0.8;
      transform: translate(-4px, 2px);
      clip-path: inset(55% 0 30% 0);
    }
    92.2% {
      opacity: 0.8;
      transform: translate(3px, 0);
      clip-path: inset(80% 0 5% 0);
    }
    93.2% {
      opacity: 0;
      clip-path: inset(0 0 100% 0);
    }
    94.5% {
      opacity: 0.9;
      transform: translate(-5px, -2px);
      clip-path: inset(35% 0 45% 0);
    }
    95.5% {
      opacity: 0.9;
      transform: translate(6px, 1px);
      clip-path: inset(5% 0 80% 0);
    }
    96.5% {
      opacity: 0.8;
      transform: translate(-3px, 3px);
      clip-path: inset(65% 0 15% 0);
    }
    97.5% {
      opacity: 0;
      clip-path: inset(0 0 100% 0);
    }
  }

  .glitch-title .letter-k,
  .glitch-title .letter-r,
  .glitch-title .letter-v {
    display: inline-block;
    color: #ffff00;
    animation: letter-bounce 0.5s ease infinite;
    animation-delay: calc(var(--i, 0) * 0.1s);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    will-change: transform;
  }

  .letter-k { --i: 0; }
  .letter-r { --i: 1; }
  .letter-v { --i: 2; }

  @keyframes letter-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  .letter {
    display: inline-block;
    transition: transform 0.3s ease;
  }

  .glitch-title:hover .letter {
    animation: letter-wave 0.5s ease forwards;
    animation-delay: calc(var(--i, 0) * 0.05s);
  }

  @keyframes letter-wave {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
  }

  .name-word {
    display: inline-block;
    white-space: nowrap;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .tagline {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    margin-bottom: 1.5rem;
    background: none !important;
    -webkit-text-fill-color: #a1a1aa !important;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    animation: none !important;
  }

  .tagline::after {
    display: none;
  }

  .tagline .word {
    display: inline-block;
    transition: all 0.3s ease;
  }

  .tagline .word.highlight {
    color: #00ffff;
    -webkit-text-fill-color: #00ffff !important;
    font-weight: 700;
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
    position: relative;
  }

  .tagline .word.highlight::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #ff00ff, #00ffff);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  .tagline .word.highlight:hover::before {
    transform: scaleX(1);
  }

  .description {
    font-size: 1.1rem;
    color: #a1a1aa;
    max-width: 540px;
    position: relative;
  }

  .cta-buttons {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-top: 2rem;
  }

  .comic-btn {
    position: relative;
    padding: 1rem 2rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    border: 3px solid #000;
    transition: all 0.2s ease;
    overflow: hidden;
  }

  .comic-btn .btn-text {
    position: relative;
    z-index: 2;
  }

  .comic-btn .btn-shadow {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 100%;
    height: 100%;
    background: #000;
    z-index: -1;
    transition: all 0.2s ease;
  }

  .btn.primary.comic-btn {
    background: linear-gradient(135deg, #ffff00, #ff00ff);
    color: #000;
    border-radius: 0;
  }

  .btn.primary.comic-btn:hover {
    transform: translate(-4px, -4px);
    box-shadow: 8px 8px 0 #000;
  }

  .btn.primary.comic-btn:hover .btn-shadow {
    top: 8px;
    left: 8px;
  }

  .btn.secondary.comic-btn {
    background: transparent;
    border: 3px solid #00ffff;
    color: #00ffff;
    border-radius: 0;
  }

  .btn.secondary.comic-btn:hover {
    background: #00ffff;
    color: #000;
    transform: translate(-4px, -4px);
    box-shadow: 8px 8px 0 #ff00ff;
  }

  .hero-decoration {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition: transform 0.1s ease-out;
    transform-style: preserve-3d;
  }

  /* Profile Image Styles */
  .profile-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .profile-frame {
    position: relative;
    padding: 6px;
    background: linear-gradient(135deg, #ff00ff, #00ffff, #ffff00, #ff00ff);
    background-size: 300% 300%;
    animation: gradient-rotate 4s ease infinite;
    clip-path: polygon(
      0% 15%, 15% 0%, 85% 0%, 100% 15%,
      100% 85%, 85% 100%, 15% 100%, 0% 85%
    );
  }

  @keyframes gradient-rotate {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .profile-glitch {
    position: relative;
    width: 280px;
    height: 280px;
    clip-path: polygon(
      0% 15%, 15% 0%, 85% 0%, 100% 15%,
      100% 85%, 85% 100%, 15% 100%, 0% 85%
    );
    overflow: hidden;
  }

  .profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: contrast(1.1) saturate(1.1);
  }

  .profile-img.glitch-r,
  .profile-img.glitch-b {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;
  }

  .profile-img.glitch-r {
    mix-blend-mode: screen;
    filter: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="r"><feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/></filter></svg>#r');
    animation: glitch-img-r 8s infinite;
  }

  .profile-img.glitch-b {
    mix-blend-mode: screen;
    filter: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><filter id="b"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"/></filter></svg>#b');
    animation: glitch-img-b 8s infinite;
  }

  @keyframes glitch-img-r {
    0%, 89%, 100% {
      opacity: 0;
      transform: translate(0);
    }
    90% {
      opacity: 0.8;
      transform: translate(-4px, -2px);
    }
    92% {
      opacity: 0.6;
      transform: translate(3px, 1px);
    }
    94% {
      opacity: 0;
    }
    96% {
      opacity: 0.7;
      transform: translate(-5px, 2px);
    }
    98% {
      opacity: 0;
    }
  }

  @keyframes glitch-img-b {
    0%, 89%, 100% {
      opacity: 0;
      transform: translate(0);
    }
    91% {
      opacity: 0.8;
      transform: translate(4px, 2px);
    }
    93% {
      opacity: 0.6;
      transform: translate(-3px, -1px);
    }
    95% {
      opacity: 0;
    }
    97% {
      opacity: 0.7;
      transform: translate(5px, -2px);
    }
    99% {
      opacity: 0;
    }
  }

  .profile-shadow {
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 20px;
    background: radial-gradient(ellipse, rgba(255, 0, 255, 0.4) 0%, transparent 70%);
    filter: blur(8px);
  }

  @media (max-width: 900px) {
    section {
      flex-direction: column;
      text-align: center;
    }

    .hero-left {
      display: flex;
      flex-direction: column;
      align-items: center;
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

    .profile-glitch {
      width: 220px;
      height: 220px;
    }

    .tagline {
      justify-content: center;
    }
  }
</style>
