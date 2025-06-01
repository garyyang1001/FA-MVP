import Link from 'next/link'

// 首頁元件 - 這是使用者進入網站時看到的第一個頁面
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-8">
        {/* 主標題區域 */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FA-Game
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium">
            親子共創遊戲平台
          </p>
          <p className="text-responsive text-gray-500 max-w-lg mx-auto">
            讓 AI 引導你和孩子一起創作獨特的小遊戲，將孩子的創意變成可玩的現實！
          </p>
        </div>

        {/* 功能特色展示 */}
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold text-lg mb-2">AI 智慧引導</h3>
            <p className="text-gray-600 text-sm">
              溫暖的 AI 助手協助家長引導孩子創作
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-lg mb-2">5 分鐘完成</h3>
            <p className="text-gray-600 text-sm">
              簡單的創作流程，忙碌的家長也能輕鬆參與
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">🎮</div>
            <h3 className="font-semibold text-lg mb-2">即玩即分享</h3>
            <p className="text-gray-600 text-sm">
              創作完成後立即可以遊玩並分享給親友
            </p>
          </div>
        </div>

        {/* 行動按鈕區域 */}
        <div className="space-y-4">
          <Link 
            href="/create" 
            className="btn-primary inline-block text-lg px-8 py-4"
          >
            🚀 開始創作遊戲
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>💡 提示：準備好與孩子一起度過 5 分鐘的創意時光</p>
          </div>
        </div>

        {/* 專案狀態指示器 - 開發階段時顯示 */}
        <div className="mt-12 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">
              ✅ Next.js 專案初始化完成
            </span>
          </div>
          <p className="text-green-600 text-sm mt-2">
            階段二第一步：Next.js 基礎架構已成功建立
          </p>
        </div>
      </div>
    </div>
  )
}