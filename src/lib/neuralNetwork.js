const config = {
  nodeCount: 45,
  connectionDistance: 100,
  nodeSpeed: 0.3,
  signalSpeed: 3,
  signalSpawnRate: 0.02,
  glitchChance: 0.003,
  glitchDuration: 150,
  colors: {
    node: ['#442266', '#553377', '#3d1f5c', '#4a2970'],
    connection: 'rgba(0, 80, 60, 0.35)',
    signal: ['#005050', '#500050', '#505000'],
    glitch: ['#661414', '#146614', '#141466', '#501450', '#145050']
  }
};

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * config.nodeSpeed;
    this.vy = (Math.random() - 0.5) * config.nodeSpeed;
    this.radius = Math.random() * 1.5 + 1;
    this.color = config.colors.node[Math.floor(Math.random() * config.colors.node.length)];
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.connections = [];
  }

  update(width, height) {
    this.x += this.vx;
    this.y += this.vy;
    this.pulsePhase += 0.02;

    if (this.x < 50 || this.x > width - 50) this.vx *= -1;
    if (this.y < 50 || this.y > height - 50) this.vy *= -1;

    this.x = Math.max(50, Math.min(width - 50, this.x));
    this.y = Math.max(50, Math.min(height - 50, this.y));
  }

  draw(ctx, glitchOffset = { x: 0, y: 0 }) {
    const pulse = Math.sin(this.pulsePhase) * 0.5 + 1;
    const x = this.x + glitchOffset.x;
    const y = this.y + glitchOffset.y;

    ctx.beginPath();
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, this.radius * 3 * pulse);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.5, this.color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.arc(x, y, this.radius * 3 * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(x, y, this.radius * pulse, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Signal {
  constructor(startNode, endNode) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.progress = 0;
    this.speed = config.signalSpeed + Math.random() * 2;
    this.color = config.colors.signal[Math.floor(Math.random() * config.colors.signal.length)];
    this.trail = [];
  }

  update() {
    const dx = this.endNode.x - this.startNode.x;
    const dy = this.endNode.y - this.startNode.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    this.progress += this.speed / dist;

    const currentX = this.startNode.x + dx * this.progress;
    const currentY = this.startNode.y + dy * this.progress;

    this.trail.push({ x: currentX, y: currentY, alpha: 1 });
    if (this.trail.length > 10) this.trail.shift();

    this.trail.forEach(t => t.alpha *= 0.9);

    return this.progress >= 1;
  }

  draw(ctx, glitchOffset = { x: 0, y: 0 }) {
    this.trail.forEach((point, i) => {
      ctx.beginPath();
      ctx.fillStyle = this.color.replace(')', `, ${point.alpha * 0.8})`).replace('rgb', 'rgba').replace('#', '');

      const alpha = point.alpha * 0.8;
      if (this.color.startsWith('#')) {
        const r = parseInt(this.color.slice(1, 3), 16);
        const g = parseInt(this.color.slice(3, 5), 16);
        const b = parseInt(this.color.slice(5, 7), 16);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }

      ctx.arc(
        point.x + glitchOffset.x,
        point.y + glitchOffset.y,
        3 * (i / this.trail.length),
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress + glitchOffset.x;
    const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress + glitchOffset.y;

    ctx.beginPath();
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.5, this.color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function createNeuralNetwork(canvas) {
  let ctx = canvas.getContext('2d');
  let nodes = [];
  let signals = [];
  let glitchActive = false;
  let glitchIntensity = 0;
  let animationId;

  function initNodes(width, height) {
    nodes = [];
    for (let i = 0; i < config.nodeCount; i++) {
      nodes.push(new Node(
        Math.random() * (width - 100) + 50,
        Math.random() * (height - 100) + 50
      ));
    }
  }

  function drawConnections(glitchOffset = { x: 0, y: 0 }) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.connectionDistance) {
          const alpha = (1 - dist / config.connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(nodes[i].x + glitchOffset.x, nodes[i].y + glitchOffset.y);
          ctx.lineTo(nodes[j].x + glitchOffset.x, nodes[j].y + glitchOffset.y);
          ctx.stroke();
        }
      }
    }
  }

  function spawnSignal() {
    if (nodes.length < 2) return;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.connectionDistance && Math.random() < config.signalSpawnRate) {
          const startNode = Math.random() > 0.5 ? nodes[i] : nodes[j];
          const endNode = startNode === nodes[i] ? nodes[j] : nodes[i];
          signals.push(new Signal(startNode, endNode));
          return;
        }
      }
    }
  }

  function triggerGlitch() {
    glitchActive = true;
    glitchIntensity = Math.random() * 20 + 10;

    setTimeout(() => {
      glitchActive = false;
      glitchIntensity = 0;
    }, config.glitchDuration + Math.random() * 100);
  }

  function drawGlitchEffect(width, height) {
    if (!glitchActive) return;

    const sliceCount = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < sliceCount; i++) {
      const y = Math.random() * height;
      const sliceHeight = Math.random() * 20 + 5;
      const offset = (Math.random() - 0.5) * glitchIntensity * 2;

      const imageData = ctx.getImageData(0, y, width, sliceHeight);
      ctx.putImageData(imageData, offset, y);
    }

    if (Math.random() > 0.5) {
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * 10 - 5, 0, width, height);
      ctx.fillStyle = `rgba(0, 255, 255, ${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * -10 + 5, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let y = 0; y < height; y += 4) {
      if (Math.random() > 0.7) {
        ctx.fillRect(0, y, width, 2);
      }
    }

    const noiseBlocks = Math.floor(Math.random() * 8) + 2;
    for (let i = 0; i < noiseBlocks; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const w = Math.random() * 100 + 20;
      const h = Math.random() * 30 + 5;

      ctx.fillStyle = config.colors.glitch[Math.floor(Math.random() * config.colors.glitch.length)];
      ctx.globalAlpha = Math.random() * 0.3;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = 1;
    }
  }

  function animate() {
    if (!ctx || !canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const glitchOffset = glitchActive ? {
      x: (Math.random() - 0.5) * glitchIntensity,
      y: (Math.random() - 0.5) * glitchIntensity
    } : { x: 0, y: 0 };

    nodes.forEach(node => {
      node.update(width, height);
    });

    drawConnections(glitchOffset);

    nodes.forEach(node => {
      node.draw(ctx, glitchOffset);
    });

    if (Math.random() < 0.1) spawnSignal();

    signals = signals.filter(signal => {
      const completed = signal.update();
      if (!completed) {
        signal.draw(ctx, glitchOffset);
      }
      return !completed;
    });

    if (Math.random() < config.glitchChance && !glitchActive) {
      triggerGlitch();
    }

    drawGlitchEffect(width, height);

    animationId = requestAnimationFrame(animate);
  }

  function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initNodes(canvas.width, canvas.height);
  }

  function start() {
    handleResize();
    animate();
  }

  function cleanup() {
    cancelAnimationFrame(animationId);
  }

  return { start, cleanup, handleResize };
}
