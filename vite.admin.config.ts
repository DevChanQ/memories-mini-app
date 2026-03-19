import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { nodePolyfills } from "vite-plugin-node-polyfills"

function adminHtmlPlugin(): Plugin {
  return {
    name: 'admin-html',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url === '/') {
          req.url = '/admin.html'
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [adminHtmlPlugin(), react(), tailwindcss(), nodePolyfills()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "./",
  build: {
    outDir: "dist-admin",
    rollupOptions: {
      input: path.resolve(__dirname, "admin.html"),
    },
  },
})
