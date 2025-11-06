import path from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

const devUrl = 'localhost'
// const proUrl = '43.138.244.158'

export default defineConfig({
  main: {
    build: {
      outDir: 'out/main',
      rollupOptions: {
        external: [],
        output: {
          assetFileNames: 'assets/[name].[ext]',
          chunkFileNames: 'chunks/[name].js',
          entryFileNames: '[name].js'
        }
      }
    }
  },
  preload: {
    plugins: [
      externalizeDepsPlugin({
        exclude: ['@electron-toolkit/preload']
      })
    ],
    build: {
      outDir: 'out/preload/index.cjs',
      rollupOptions: {
        input: path.resolve(__dirname, 'src/preload/index.js'),
        output: {
          entryFileNames: 'index.js',
          format: 'cjs'
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/renderer/src'),
        '@renderer': path.resolve(__dirname, 'src/renderer/src')
      }
    },
    plugins: [react()],
    build: {
      outDir: 'out/renderer',
      rollupOptions: {
        input: path.resolve(__dirname, 'src/renderer/index.html')
      }
    },
    server: {
      port: 5137,
      proxy: {
        '/api': {
          target: `http://${devUrl}:8080`,
          changeOrigin: true,
          secure: false
        },
        '/socket.io:': {
          target: `http://${devUrl}:8080`,
          changeOrigin: true,
          ws: true
        }
      }
    }
  }
})
