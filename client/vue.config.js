const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.BASE_URL || '/', 
  outputDir: 'dist', 
  assetsDir: 'assets',
  indexPath: 'index.html', 
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Backend local
        changeOrigin: true,
      },
    },
  },
});