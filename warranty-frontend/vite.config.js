import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [react(), vitePluginCompression()],
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
