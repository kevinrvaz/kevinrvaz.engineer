import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  base: '',
  optimizeDeps: {
    exclude: ['onnxruntime-web']
  },
  worker: {
    format: 'es'
  },
  assetsInclude: ['**/*.wasm', '**/*.onnx'],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
})
