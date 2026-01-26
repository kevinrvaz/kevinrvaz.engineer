<script>
  import { onMount } from 'svelte';

  let isMenuOpen = false;
  let isMusicPlaying = true;
  let audioElement;

  const navItems = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' }
  ];

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }

  function toggleMusic() {
    if (isMusicPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    isMusicPlaying = !isMusicPlaying;
  }

  onMount(() => {
    audioElement = new Audio('/bgmusic.mp3');
    audioElement.loop = true;
    audioElement.volume = 0.3;
    isMusicPlaying = false;

    const startMusic = () => {
      if (!isMusicPlaying) {
        audioElement.play().then(() => {
          isMusicPlaying = true;
        });
      }
      document.removeEventListener('click', startMusic);
      document.removeEventListener('keydown', startMusic);
      document.removeEventListener('touchstart', startMusic);
    };

    // Add listeners for first user interaction
    document.addEventListener('click', startMusic);
    document.addEventListener('keydown', startMusic);
    document.addEventListener('touchstart', startMusic);
  });
</script>

<nav>
  <div class="nav-container">
    <a href="#hero" class="logo">KRV</a>

    <button class="menu-toggle" on:click={toggleMenu} aria-label="Toggle menu">
      <span class:open={isMenuOpen}></span>
    </button>

    <ul class:open={isMenuOpen}>
      {#each navItems as item}
        <li>
          <a href={item.href} on:click={closeMenu}>{item.label}</a>
        </li>
      {/each}
      <li>
        <a href="https://github.com/kevinrvaz" target="_blank" rel="noopener noreferrer" class="github-link">
          GitHub
        </a>
      </li>
      <li>
        <button class="music-toggle" on:click={toggleMusic} aria-label="Toggle music">
          {#if isMusicPlaying}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          {/if}
        </button>
      </li>
    </ul>
  </div>
</nav>

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1001;
    background: rgba(5, 5, 10, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 3px solid;
    border-image: linear-gradient(90deg, #ff00ff, #00ffff, #ffff00) 1;
  }

  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 2rem;
    font-weight: 900;
    color: #fff;
    text-shadow:
      -2px -2px 0 #ff00ff,
      2px 2px 0 #00ffff;
    letter-spacing: 2px;
    transition: all 0.3s ease;
    position: relative;
  }

  .logo:hover {
    text-shadow:
      -4px -4px 0 #ff00ff,
      4px 4px 0 #00ffff,
      0 0 20px rgba(255, 0, 255, 0.5);
    transform: scale(1.1);
  }

  ul {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    list-style: none;
  }

  li a {
    color: #fff;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    border: 2px solid transparent;
  }

  li a::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #ff00ff, #00ffff);
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  li a:hover::before {
    width: 100%;
  }

  li a:hover {
    color: #00ffff;
    text-shadow:
      0 0 10px rgba(0, 255, 255, 0.8),
      -1px 0 #ff00ff,
      1px 0 #00ffff;
  }

  .github-link {
    padding: 0.5rem 1.25rem !important;
    border: 2px solid #ffff00 !important;
    border-radius: 0 !important;
    color: #ffff00 !important;
    box-shadow: 3px 3px 0 #ff00ff;
    background: transparent;
  }

  .github-link::before {
    display: none !important;
  }

  .github-link:hover {
    background: #ffff00 !important;
    color: #000 !important;
    transform: translate(-3px, -3px);
    box-shadow: 6px 6px 0 #ff00ff;
    text-shadow: none !important;
  }

  .music-toggle {
    padding: 0.5rem;
    border: 2px solid #ffff00;
    background: transparent;
    color: #ffff00;
    box-shadow: 3px 3px 0 #ff00ff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .music-toggle:hover {
    background: #ffff00;
    color: #000;
    transform: translate(-3px, -3px);
    box-shadow: 6px 6px 0 #ff00ff;
  }

  .music-toggle svg {
    display: block;
  }

  li:has(.music-toggle) {
    display: flex;
    align-items: center;
    margin-left: 0.5rem;
  }

  .menu-toggle {
    display: none;
    background: none;
    border: 2px solid #00ffff;
    cursor: pointer;
    padding: 0.75rem;
    transition: all 0.3s ease;
  }

  .menu-toggle:hover {
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  }

  .menu-toggle span {
    display: block;
    width: 24px;
    height: 3px;
    background: #00ffff;
    position: relative;
    transition: all 0.3s ease;
  }

  .menu-toggle span::before,
  .menu-toggle span::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 3px;
    background: #00ffff;
    transition: all 0.3s ease;
  }

  .menu-toggle span::before {
    top: -8px;
    background: #ff00ff;
  }

  .menu-toggle span::after {
    top: 8px;
    background: #ffff00;
  }

  .menu-toggle span.open {
    background: transparent;
  }

  .menu-toggle span.open::before {
    transform: rotate(45deg);
    top: 0;
    background: #00ffff;
  }

  .menu-toggle span.open::after {
    transform: rotate(-45deg);
    top: 0;
    background: #00ffff;
  }

  @media (max-width: 768px) {
    .menu-toggle {
      display: block;
    }

    ul {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      flex-direction: column;
      background: rgba(5, 5, 10, 0.98);
      padding: 1.5rem 2rem;
      gap: 0.5rem;
      transform: translateY(-100%);
      opacity: 0;
      pointer-events: none;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      border-bottom: 3px solid;
      border-image: linear-gradient(90deg, #ff00ff, #00ffff, #ffff00) 1;
    }

    ul.open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: all;
    }

    li a {
      display: block;
      padding: 0.75rem 1rem;
      border-left: 3px solid transparent;
    }

    li a:hover {
      border-left-color: #00ffff;
      background: rgba(0, 255, 255, 0.1);
    }

    li a::before {
      display: none;
    }
  }
</style>
