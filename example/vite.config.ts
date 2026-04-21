import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: [
      { find: 'preact/jsx-runtime', replacement: path.resolve(__dirname, '../node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs') },
      { find: 'preact/jsx-dev-runtime', replacement: path.resolve(__dirname, '../node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs') },
      { find: /^preact(\/.*)?$/, replacement: path.resolve(__dirname, '../node_modules/preact') + '$1' },
      { find: /^@preact\/signals(\/.*)?$/, replacement: path.resolve(__dirname, '../node_modules/@preact/signals') + '$1' },
      { find: /^deepsignal(\/.*)?$/, replacement: path.resolve(__dirname, '../node_modules/deepsignal') + '$1' }
    ]
  },
  optimizeDeps: {
    exclude: ['preact/jsx-runtime', 'preact/jsx-dev-runtime']
  },
  define: {
    'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
  }
})
