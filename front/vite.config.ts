import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "../out/front",
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        // 全部打成一个文件
        assetFileNames: `[name].[ext]`,
        manualChunks: () => 'index.js'
      }
    },

  },
  server:{
    cors:{
      allowedHeaders:"*"
    }
  },
  define: { 'process.env': {} },
  
})
