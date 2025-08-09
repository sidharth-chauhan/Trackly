import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Trackly/', // GitHub Pages subfolder
  plugins: [react()],
})
