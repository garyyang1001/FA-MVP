'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Loading } from '@/components/ui/Loading'
import { useAuth } from '@/hooks/useAuth'

interface GoogleLoginProps {
  redirectTo?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function GoogleLogin({ 
  redirectTo = '/create',
  size = 'md',
  className = '',
  onSuccess,
  onError
}: GoogleLoginProps) {
  const router = useRouter()
  const { login, loading, error, clearError } = useAuth()
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true)
      clearError()

      console.log('🚀 開始登入流程...')
      const result = await login()

      if (result.success) {
        console.log('✅ 登入成功！')
        
        // 執行成功回調
        onSuccess?.()
        
        // 導向指定頁面
        router.push(redirectTo)
      } else {
        console.error('❌ 登入失敗:', result.error)
        onError?.(result.error || '登入失敗')
      }
    } catch (error: any) {
      console.error('❌ 登入過程發生錯誤:', error)
      onError?.(error.message || '登入過程發生錯誤')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const isLoadingState = loading || isLoggingIn

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      {/* Google 登入按鈕 */}
      <Button
        variant="outline"
        size={size}
        width="full"
        loading={isLoadingState}
        onClick={handleGoogleLogin}
        disabled={isLoadingState}
        leftIcon={
          !isLoadingState ? (
            <svg 
              className="w-5 h-5" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285f4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34a853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#fbbc05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#ea4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          ) : undefined
        }
      >
        {isLoadingState ? '登入中...' : '使用 Google 登入'}
      </Button>

      {/* 錯誤訊息 */}
      {error && (
        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="text-red-500">⚠️</div>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {/* 載入狀態指示 */}
      {isLoadingState && (
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Loading size="sm" />
          <span>正在連接 Google 服務...</span>
        </div>
      )}

      {/* 使用說明 */}
      <p className="text-xs text-gray-500 text-center max-w-sm">
        登入後即可開始創作遊戲。我們會保護你的隱私，
        只會使用基本的帳號資訊來個人化你的體驗。
      </p>
    </div>
  )
}

// 簡化版本的 Google 登入按鈕
export function QuickGoogleLogin({ className = '' }: { className?: string }) {
  return (
    <GoogleLogin 
      size="sm"
      className={className}
      onSuccess={() => console.log('快速登入成功')}
      onError={(error) => console.error('快速登入失敗:', error)}
    />
  )
}

// 用戶資訊顯示元件
export function UserInfo({ className = '' }: { className?: string }) {
  const { user, userProfile, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (!user || !userProfile) {
    return null
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error('登出失敗:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* 用戶頭像 */}
      {userProfile.photoURL && (
        <img
          src={userProfile.photoURL}
          alt={userProfile.displayName}
          className="w-8 h-8 rounded-full border border-gray-200"
        />
      )}
      
      {/* 用戶資訊 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {userProfile.displayName}
        </p>
        <p className="text-xs text-gray-500 truncate">
          已創作 {userProfile.gameCount} 個遊戲
        </p>
      </div>
      
      {/* 登出按鈕 */}
      <Button
        variant="ghost"
        size="sm"
        loading={isLoggingOut}
        onClick={handleLogout}
      >
        登出
      </Button>
    </div>
  )
}