import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' lets the built site work on any static host, including sub-folders.
export default defineConfig({
  base: './',
  plugins: [react()],
})
