/** @type {import('next').NextConfig} */
const nextConfig = {
  // 啟用實驗性 App Router 功能
  experimental: {
    appDir: true,
  },
  
  // 圖片優化設定 - 為了遊戲素材
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 環境變數配置 - 讓環境變數在客戶端也能使用
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // 為了 Phaser 遊戲引擎，需要這些設定
  webpack: (config, { isServer }) => {
    // 客戶端配置
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig