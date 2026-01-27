const COLOR_SCHEMES = ['cyan', 'magenta', 'red', 'blue', 'orange'];

export function createCircuitTileManager(onChange) {
  let tiles = [];
  let animationId;

  function generate() {
    const tileSize = 100;
    const cols = Math.floor(window.innerWidth / tileSize);
    const rows = Math.floor(window.innerHeight / tileSize);
    tiles = [];

    let id = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        tiles.push({
          id: `tile-${id++}`,
          x: col * tileSize,
          y: row * tileSize,
          delay: Math.random() * 20000,
          duration: 20000 + Math.random() * 10000,
          colorScheme: COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)],
          visible: false,
          active: false,
          opacity: 0,
        });
      }
    }
    tiles = tiles.sort(() => Math.random() - 0.5);
    onChange([...tiles]);
  }

  function updateVisibility() {
    const now = performance.now();
    const fadeTime = 4000;
    const visibleTime = 8000;
    const totalVisibleTime = fadeTime + visibleTime + fadeTime;
    const maxVisibleTiles = 25;

    let activeCount = tiles.filter(t => t.active).length;

    tiles = tiles.map(tile => {
      const elapsed = (now - tile.delay) % tile.duration;
      const visibleStart = tile.duration * 0.3;
      const visibleEnd = visibleStart + totalVisibleTime;
      const inVisibleWindow = elapsed > visibleStart && elapsed < visibleEnd;

      let active = tile.active;
      if (inVisibleWindow && !tile.active && activeCount < maxVisibleTiles) {
        active = true;
        activeCount++;
      } else if (!inVisibleWindow && tile.active) {
        active = false;
      }

      let opacity = 0;
      if (active && inVisibleWindow) {
        const visibleElapsed = elapsed - visibleStart;
        if (visibleElapsed < fadeTime) {
          opacity = visibleElapsed / fadeTime;
        } else if (visibleElapsed < fadeTime + visibleTime) {
          opacity = 1;
        } else {
          opacity = (totalVisibleTime - visibleElapsed) / fadeTime;
        }
      }

      return { ...tile, active, visible: active && inVisibleWindow && opacity > 0, opacity };
    });

    onChange([...tiles]);
    animationId = requestAnimationFrame(updateVisibility);
  }

  function start() {
    generate();
    updateVisibility();
  }

  function stop() {
    cancelAnimationFrame(animationId);
  }

  return { start, stop, regenerate: generate };
}
