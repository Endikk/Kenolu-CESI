import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed at https://endikk.github.io/Kenolu-CESI/ — so the build
// has to reference all assets from `/Kenolu-CESI/…`. The dev server
// stays at `/` so `npm run dev` keeps working unchanged.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/Kenolu-CESI/' : '/',
}))
