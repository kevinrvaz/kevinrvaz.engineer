# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with hot reload
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
npm run deploy   # Build and deploy to GitHub Pages
```

## Architecture

This is a Svelte 4 portfolio website built with Vite, deployed to GitHub Pages.

### Component Structure
- `src/App.svelte` - Main app shell, initializes background animations, manages scroll-based canvas opacity
- `src/components/` - Page sections (Hero, About, Experience, Projects, Skills, Contact, Nav) and visual components (CodeSnippets, CircuitBoard, OwlChatButton)

### Visual Effects System
Three layered background animations managed from App.svelte:
- **Neural Network** (`src/lib/neuralNetwork.js`) - Canvas-based animated nodes with connections and glitch effects
- **Code Snippets** (`src/lib/codeSnippets.js`) - Floating code snippet overlays
- **Circuit Board** (`src/lib/circuitTiles.js`) - Tiled circuit pattern background

All effect managers follow the pattern: `createXManager(callback)` returning `{start(), stop(), handleResize?()}`.

### AI Chatbot (Minerva)
- **Component**: `src/components/OwlChatButton.svelte` - Animated owl character with chat interface, speech recognition, and text-to-speech
- **Worker**: `src/lib/minervaWorker.js` - Web Worker running LiquidAI's LFM2.5-1.2B-Thinking model via ONNX runtime
- Uses WebGPU when available, falls back to WASM/CPU (q4 quantization for Safari, q8 for others)
- Model weights are cached in browser's Cache API after first download

### Vite Configuration
- `onnxruntime-web` excluded from optimizeDeps due to WASM loading
- COOP/COEP headers enabled for SharedArrayBuffer (required by ONNX runtime)
- WASM and ONNX files included as assets
