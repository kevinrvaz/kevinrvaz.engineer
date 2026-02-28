<script>
  let isHovered = false;
  let isOpen = false;

  function handleClick() {
    isOpen = !isOpen;
  }
</script>

<div class="owl-chat-container">
  <button
    class="owl-button"
    class:hovered={isHovered}
    class:open={isOpen}
    on:mouseenter={() => isHovered = true}
    on:mouseleave={() => isHovered = false}
    on:click={handleClick}
    aria-label="Chat with Minerva"
  >
    <svg viewBox="0 0 100 100" class="owl-svg">
      <!-- Ear tufts -->
      <polygon class="ear left-ear" points="20,25 30,5 35,30" />
      <polygon class="ear right-ear" points="80,25 70,5 65,30" />

      <!-- Head/body shape -->
      <ellipse class="body" cx="50" cy="55" rx="38" ry="42" />

      <!-- Face disc (barn owl heart shape) -->
      <path class="face-disc" d="M50,20 C70,20 80,35 80,50 C80,70 65,85 50,90 C35,85 20,70 20,50 C20,35 30,20 50,20" />

      <!-- Eye sockets -->
      <ellipse class="eye-socket left-socket" cx="35" cy="45" rx="14" ry="16" />
      <ellipse class="eye-socket right-socket" cx="65" cy="45" rx="14" ry="16" />

      <!-- Eyes -->
      <circle class="eye left-eye" cx="35" cy="45" r="10" />
      <circle class="eye right-eye" cx="65" cy="45" r="10" />

      <!-- Pupils -->
      <circle class="pupil left-pupil" cx="35" cy="45" r="5" />
      <circle class="pupil right-pupil" cx="65" cy="45" r="5" />

      <!-- Eye shine -->
      <circle class="eye-shine" cx="32" cy="42" r="2" />
      <circle class="eye-shine" cx="62" cy="42" r="2" />

      <!-- Beak -->
      <path class="beak" d="M50,55 L45,65 L50,75 L55,65 Z" />

      <!-- Chest feathers pattern -->
      <path class="chest-feathers" d="M35,70 Q40,75 50,75 Q60,75 65,70" />
      <path class="chest-feathers" d="M38,78 Q45,82 50,82 Q55,82 62,78" />
    </svg>

    <span class="chat-label">Chat</span>
  </button>

  {#if isOpen}
    <div class="chat-tooltip">
      <div class="tooltip-content">
        <p>Hoo hoo! I'm Minerva. Want to chat?</p>
        <div class="chat-links">
          <a href="#contact" class="chat-link" on:click={() => isOpen = false}>Contact Section</a>
          <a href="https://linkedin.com/in/kevin-rohan-vaz" target="_blank" rel="noopener noreferrer" class="chat-link secondary">LinkedIn</a>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .owl-chat-container {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 1000;
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

  .owl-svg {
    width: 45px;
    height: 45px;
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

  /* Owl SVG styles */
  .ear {
    fill: #1a1a2e;
    stroke: #00ffff;
    stroke-width: 1.5;
  }

  .body {
    fill: #1a1a2e;
    stroke: #00ffff;
    stroke-width: 2;
  }

  .face-disc {
    fill: rgba(255, 255, 255, 0.1);
    stroke: #ffff00;
    stroke-width: 1.5;
  }

  .eye-socket {
    fill: rgba(0, 0, 0, 0.8);
    stroke: #ff00ff;
    stroke-width: 1;
  }

  .eye {
    fill: #ffff00;
    transition: all 0.3s ease;
  }

  .owl-button:hover .eye {
    fill: #00ffff;
  }

  .pupil {
    fill: #0a0a0f;
    transition: all 0.2s ease;
  }

  .owl-button:hover .pupil {
    r: 4;
  }

  .eye-shine {
    fill: #ffffff;
  }

  .beak {
    fill: #ff00ff;
    stroke: #ffff00;
    stroke-width: 0.5;
  }

  .chest-feathers {
    fill: none;
    stroke: rgba(255, 255, 255, 0.3);
    stroke-width: 1;
  }

  .chat-label {
    display: none;
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-weight: 600;
    color: #00ffff;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 2px;
  }

  /* Chat tooltip */
  .chat-tooltip {
    position: absolute;
    bottom: 85px;
    right: 0;
    background: rgba(10, 10, 20, 0.95);
    border: 3px solid #00ffff;
    box-shadow: 6px 6px 0 #ff00ff;
    padding: 15px 20px;
    min-width: 200px;
    animation: tooltip-appear 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    backdrop-filter: blur(10px);
  }

  @keyframes tooltip-appear {
    0% {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .chat-tooltip::after {
    content: '';
    position: absolute;
    bottom: -12px;
    right: 25px;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 12px solid #00ffff;
  }

  .tooltip-content p {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #fff;
    margin: 0 0 12px 0;
    text-shadow: -1px 0 #ff00ff, 1px 0 #00ffff;
  }

  .chat-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .chat-link {
    display: inline-block;
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    color: #0a0a0f;
    background: linear-gradient(90deg, #ff00ff, #00ffff);
    padding: 8px 16px;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    border: none;
    text-align: center;
  }

  .chat-link:hover {
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 #ffff00;
    color: #0a0a0f;
    text-shadow: none;
  }

  .chat-link.secondary {
    background: transparent;
    border: 2px solid #ffff00;
    color: #ffff00;
  }

  .chat-link.secondary:hover {
    background: #ffff00;
    color: #0a0a0f;
  }

  /* Blink animation for the owl */
  @keyframes owl-blink {
    0%, 90%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(0.1); }
  }

  .owl-button:not(:hover) .eye {
    animation: owl-blink 4s ease-in-out infinite;
    transform-origin: center;
  }

  /* Mobile adjustments */
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

    .chat-tooltip {
      right: -10px;
      min-width: 180px;
    }
  }
</style>
