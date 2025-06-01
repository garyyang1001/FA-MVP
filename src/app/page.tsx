'use client'

import Link from 'next/link'
import { GoogleLogin, UserInfo } from '@/components/auth/GoogleLogin'
import { useUser } from '@/hooks/useAuth'
import { Loading } from '@/components/ui/Loading'

// 首頁元件 - 這是使用者進入網站時看到的第一個頁面
export default function HomePage() {
  const { user, userProfile, isLoggedIn, loading } = useUser()

  // 載入狀態
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="載入中..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl text-center space-y-8">
        {/* 用戶狀態區域 */}
        {isLoggedIn && userProfile && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <UserInfo className="justify-center" />
          </div>
        )}

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
        <div className="space-y-6">
          {isLoggedIn ? (
            // 已登入用戶
            <div className="space-y-4">
              <Link 
                href="/create" 
                className="btn-primary inline-block text-lg px-8 py-4"
              >
                🚀 開始創作遊戲
              </Link>
              
              <div className="text-sm text-gray-500">
                <p>🎉 歡迎回來！準備好與孩子一起創造新的遊戲了嗎？</p>
              </div>
              
              {userProfile && userProfile.gameCount > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-700 text-sm">
                    🎯 你已經創作了 {userProfile.gameCount} 個遊戲，
                    總共被遊玩了 {userProfile.totalPlays} 次！
                  </p>
                </div>
              )}
            </div>
          ) : (
            // 未登入用戶
            <div className="space-y-4">
              <div className="max-w-sm mx-auto">
                <GoogleLogin 
                  redirectTo="/create"
                  size="lg"
                  onSuccess={() => {
                    console.log('從首頁登入成功')
                  }}
                />
              </div>
              
              <div className="text-sm text-gray-500">
                <p>💡 提示：準備好與孩子一起度過 5 分鐘的創意時光</p>
              </div>
            </div>
          )}
        </div>

        {/* 專案狀態指示器 - 開發階段時顯示 */}
        <div className="mt-12 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">
              ✅ Firebase 認證系統已就位
            </span>
          </div>
          <p className="text-green-600 text-sm mt-2">
            階段三第一步：Firebase 連接與 Google 登入功能完成
          </p>
        </div>
      </div>
    </div>
  )
}