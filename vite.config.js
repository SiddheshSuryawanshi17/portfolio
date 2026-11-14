import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Puts the site's CSS directly inside index.html so the first screen can paint
// without waiting for a separate stylesheet download (better Lighthouse scores).
function inlineCss() {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = Object.values(bundle).find((f) => f.fileName === 'index.html')
      if (!html) return
      for (const [name, file] of Object.entries(bundle)) {
        if (!name.endsWith('.css')) continue
        const tag = new RegExp(`<link rel="stylesheet"[^>]*href="/${name}"[^>]*>`)
        if (!tag.test(html.source)) continue
        html.source = html.source.replace(tag, `<style>${file.source}</style>`)
        delete bundle[name]
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), inlineCss()],
})
