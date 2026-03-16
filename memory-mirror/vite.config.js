import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // <--- This forces files to be relative, fixing the blank screen
  build: {
    outDir: 'dist',
  }
})
