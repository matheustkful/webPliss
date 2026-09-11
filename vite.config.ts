import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Caminhos relativos permitem publicar o build tanto na raiz quanto em
  // https://<usuario>.github.io/webPLiss/ sem procurar /src/main.tsx na raiz do domínio.
  base: './',
  build: { rollupOptions: { input: { index: 'source-index.html' } } },
  server: { port: 5173 },
})
