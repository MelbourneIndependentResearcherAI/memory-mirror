import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 'base: ./ ' is the most important part!
  // It forces paths to be relative instead of looking at the server root.
  base: './', 
  build: {
    outDir: 'dist',
  }
})
