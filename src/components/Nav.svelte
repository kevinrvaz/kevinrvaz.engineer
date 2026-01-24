<script>
  let isMenuOpen = false;

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
