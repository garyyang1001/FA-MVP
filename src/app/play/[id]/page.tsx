import Link from 'next/link'
import { notFound } from 'next/navigation'

// 頁面參數類型定義
interface PlayPageProps {
  params: {
    id: string
  }
}

// 遊戲頁面 - 這裡將是使用者遊玩創作出來的遊戲的地方
export default function PlayPage({ params }: PlayPageProps) {
  const { id } = params

  // 基本的 ID 驗證
  if (!id || id.length < 3) {
    notFound()
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* 導航區域 */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            ← 回到首頁
          </Link>
          <Link 
            href="/create" 
            className="btn-secondary text-sm"
          >
            🎨 創作新遊戲
          </Link>
        </div>

        {/* 遊戲標題區域 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            🎮 遊戲遊玩區
          </h1>
          <p className="text-lg text-gray-600">
            遊戲 ID: {id}
          </p>
        </div>

        {/* 開發階段提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-700 font-medium">
              🚧 開發進行中
            </span>
          </div>
          <p className="text-blue-600 text-sm">
            階段二第二步：正在安裝遊戲引擎 Phaser 和相關套件
          </p>
          <div className="mt-4 space-y-2">
            <div className="text-sm text-blue-700">
              <strong>即將實現的功能：</strong>
            </div>
            <ul className="text-sm text-blue-600 space-y-1 ml-4">
              <li>• 載入用戶創作的遊戲配置</li>
              <li>• Phaser 遊戲引擎渲染</li>
              <li>• 觸控/滑鼠操作支援</li>
              <li>• 分數記錄與分享功能</li>
            </ul>
          </div>
        </div>

        {/* 遊戲容器區域 */}
        <div className="game-container mx-auto mb-8">
          <div className="aspect-[2/3] bg-gradient-to-br from-sky-100 to-purple-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                遊戲載入中...
              </h3>
              <p className="text-gray-500">
                等 Phaser 引擎安裝完成後<br />
                這裡將顯示互動遊戲
              </p>
              <div className="loading-spinner mx-auto mt-4"></div>
            </div>
          </div>
        </div>

        {/* 遊戲資訊與分享區域 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">🎯 遊戲資訊</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">創作詳情</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• 創作者：正在載入...</p>
                <p>• 創作時間：正在載入...</p>
                <p>• 遊戲類型：接物品遊戲</p>
                <p>• 遊玩次數：正在載入...</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">分享這個遊戲</h4>
              <div className="space-y-3">
                <button
                  disabled
                  className="btn-secondary w-full opacity-50 cursor-not-allowed"
                >
                  📱 分享到社群媒體
                </button>
                <button
                  disabled
                  className="btn-secondary w-full opacity-50 cursor-not-allowed"
                >
                  🔗 複製遊戲連結
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 相關遊戲推薦區域 */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            🌟 其他精彩遊戲
          </h3>
          <p className="text-gray-500 text-sm">
            等資料庫連接完成後，這裡將顯示其他家庭創作的遊戲
          </p>
        </div>
      </div>
    </div>
  )
}

// 生成靜態參數（可選，用於 SSG）
export async function generateStaticParams() {
  // 在實際部署時，這裡會從資料庫獲取所有遊戲 ID
  // 現在返回空陣列，表示所有路由都使用 SSR
  return []
}