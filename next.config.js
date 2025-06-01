/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router 在 Next.js 14+ 中是穩定功能，不需要 experimental 配置
  
  // 圖片優化設定 - 為了遊戲素材
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
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
