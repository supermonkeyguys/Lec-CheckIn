import path, { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'out/main',
    }
  },
  preload: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['@electron-toolkit/preload'] 
      })
    ],
    build: {
      outDir: 'out/preload',
      rollupOptions: {
        input: resolve(__dirname, 'src/preload/index.js'),
        output: {
          entryFileNames: 'index.js'
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/renderer')
      }
    },
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3005',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
