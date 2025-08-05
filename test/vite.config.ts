import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  define: {
    'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
  }
})
