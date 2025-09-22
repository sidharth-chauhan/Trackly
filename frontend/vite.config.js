import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// For Vercel, remove the /Trackly/ base
export default defineConfig({
  plugins: [react()],
  base: "/" 
})
