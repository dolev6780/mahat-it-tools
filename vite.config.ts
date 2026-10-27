import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' + HashRouter: the same build works on GitHub Pages (any repo path) and Netlify.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
