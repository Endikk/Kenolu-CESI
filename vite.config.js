import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Base path resolution:
 * - Vercel / custom domain / localhost  →  `/` (default, serves at root)
 * - GitHub Pages                        →  `/Kenolu-CESI/` (repo subpath)
 *
 * The GitHub Actions workflow sets `GH_PAGES=true` before running
 * `npm run build`, which switches Vite to the subpath. Any other host
 * (Vercel, Netlify, etc.) gets the clean root build, so the 404s on
 * `/Kenolu-CESI/assets/…` disappear.
 */
export default defineConfig(() => ({
  plugins: [react()],
  base: process.env.GH_PAGES === 'true' ? '/Kenolu-CESI/' : '/',
}))
