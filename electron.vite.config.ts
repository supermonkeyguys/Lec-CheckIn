import path from 'path'
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
        input: path.resolve(__dirname, 'src/preload/index.js'),
        output: {
          entryFileNames: 'index.js'
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/renderer/src'),
        '@renderer': path.resolve(__dirname,'src/renderer/src')
      }
    },
    plugins: [
      react(),
    ],
    build: {
      rollupOptions: {
        input:path.resolve(__dirname,'src/renderer/index.html')  
      }
    },
    server: {
      port:5137,
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