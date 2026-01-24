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
    <a href="#hero" class="logo">KV</a>

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
    z-index: 1000;
    background: rgba(10, 10, 15, 0.9);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #27272a;
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
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #00d4ff, #00ffcc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  ul {
    display: flex;
    gap: 2rem;
    list-style: none;
  }

  li a {
    color: #a1a1aa;
    font-weight: 500;
    transition: color 0.3s ease;
  }

  li a:hover {
    color: #00d4ff;
  }

  .github-link {
    padding: 0.5rem 1rem;
    border: 1px solid #00d4ff;
    border-radius: 6px;
    color: #00d4ff;
  }

  .github-link:hover {
    background: rgba(0, 212, 255, 0.1);
  }

  .menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .menu-toggle span {
    display: block;
    width: 24px;
    height: 2px;
    background: #e4e4e7;
    position: relative;
    transition: all 0.3s ease;
  }

  .menu-toggle span::before,
  .menu-toggle span::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background: #e4e4e7;
    transition: all 0.3s ease;
  }

  .menu-toggle span::before {
    top: -8px;
  }

  .menu-toggle span::after {
    top: 8px;
  }

  .menu-toggle span.open {
    background: transparent;
  }

  .menu-toggle span.open::before {
    transform: rotate(45deg);
    top: 0;
  }

  .menu-toggle span.open::after {
    transform: rotate(-45deg);
    top: 0;
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
      background: rgba(10, 10, 15, 0.98);
      padding: 1rem 2rem;
      gap: 1rem;
      transform: translateY(-100%);
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s ease;
    }

    ul.open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: all;
    }
  }
</style>
