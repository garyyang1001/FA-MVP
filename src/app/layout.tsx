import type { Metadata } from 'next'
import './globals.css'

// 設定網站的 meta 資訊，對 SEO 和分享功能很重要
export const metadata: Metadata = {
  title: 'FA-Game - 親子共創遊戲平台',
  description: '讓爸媽能夠在 AI 的引導下，與孩子一起創作簡單的小遊戲',
  keywords: '親子遊戲, AI, 創作, 教育, 遊戲',
  authors: [{ name: 'FA-Game Team' }],
  
  // Open Graph 設定 - 讓分享到社群媒體時有美觀的預覽
  openGraph: {
    title: 'FA-Game - 親子共創遊戲平台',
    description: '讓孩子的創意變成真實可玩的遊戲！',
    type: 'website',
    locale: 'zh_TW',
  },
  
  // Twitter Card 設定
  twitter: {
    card: 'summary_large_image',
    title: 'FA-Game - 親子共創遊戲平台',
    description: '讓孩子的創意變成真實可玩的遊戲！',
  },
}

// 根佈局元件 - 這是所有頁面的共同外框
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        {/* 這裡是所有頁面共用的外框結構 */}
        <div className="min-h-screen flex flex-col">
          {/* 主要內容區域 */}
          <main className="flex-1">
            {children}
          </main>
          
          {/* 頁尾區域 - 預留給未來的版權資訊等 */}
          <footer className="text-center text-gray-500 text-sm py-4">
            © 2025 FA-Game. 讓每個家庭都能創造獨特的遊戲回憶
          </footer>
        </div>
      </body>
    </html>
  )
}