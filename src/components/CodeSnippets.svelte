<script>
  export let snippets = [];
</script>

<div class="code-snippets-container">
  {#each snippets as snippet (snippet.id)}
    <pre
      class="floating-code {snippet.lang}"
      style="left: {snippet.x}%; top: {snippet.y}%; opacity: {snippet.opacity};"
    ><code>{snippet.displayedCode}<span class="cursor">|</span></code></pre>
  {/each}
</div>

<style>
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
</style>
