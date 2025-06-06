import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from 'path' //导入 node.js path 处理路径相关
// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: { //配置路径别名
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [vue(),WindiCSS(),],
      
})
