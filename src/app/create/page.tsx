import Link from 'next/link'

// 創作頁面 - 這裡將是孩子與家長共同創作遊戲的地方
export default function CreatePage() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* 頁面標題區域 */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← 回到首頁
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            🎨 開始創作你的遊戲
          </h1>
          <p className="text-lg text-gray-600">
            讓 AI 引導你和孩子一起創造獨特的遊戲體驗
          </p>
        </div>

        {/* 開發階段提示 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-yellow-700 font-medium">
              🚧 開發進行中
            </span>
          </div>
          <p className="text-yellow-600 text-sm">
            階段二第二步：正在安裝核心套件 (Firebase, Phaser, Gemini AI, Tailwind CSS)
          </p>
          <div className="mt-4 space-y-2">
            <div className="text-sm text-yellow-700">
              <strong>即將實現的功能：</strong>
            </div>
            <ul className="text-sm text-yellow-600 space-y-1 ml-4">
              <li>• AI 智慧引導創作流程</li>
              <li>• 即時遊戲預覽</li>
              <li>• 孩子創意映射系統</li>
              <li>• 一鍵生成可玩遊戲</li>
            </ul>
          </div>
        </div>

        {/* 創作流程預覽 */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              step: 1,
              title: "選擇物品",
              description: "孩子想要接什麼東西呢？",
              emoji: "🍎",
              color: "bg-red-50 border-red-200"
            },
            {
              step: 2, 
              title: "選擇顏色",
              description: "這個物品是什麼顏色的？",
              emoji: "🌈",
              color: "bg-purple-50 border-purple-200"
            },
            {
              step: 3,
              title: "選擇工具", 
              description: "用什麼來接這些物品？",
              emoji: "🧺",
              color: "bg-green-50 border-green-200"
            },
            {
              step: 4,
              title: "完成創作",
              description: "生成專屬遊戲並分享",
              emoji: "🎮",
              color: "bg-blue-50 border-blue-200"
            }
          ].map((item) => (
            <div
              key={item.step}
              className={`p-6 rounded-xl border ${item.color} text-center`}
            >
              <div className="text-3xl mb-3">{item.emoji}</div>
              <div className="text-sm text-gray-500 mb-1">步驟 {item.step}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>

        {/* 開始按鈕 */}
        <div className="text-center mt-12">
          <button
            disabled
            className="btn-primary opacity-50 cursor-not-allowed px-8 py-4 text-lg"
          >
            🔧 功能開發中...
          </button>
          <p className="text-sm text-gray-500 mt-2">
            等套件安裝完成後即可開始創作！
          </p>
        </div>
      </div>
    </div>
  )
}