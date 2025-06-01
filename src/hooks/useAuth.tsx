'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { 
  signInWithGoogle, 
  signOutUser, 
  onAuthStateChange,
  createOrUpdateUserProfile,
  UserProfile,
  AuthResult
} from '@/lib/auth'

// 認證上下文型別定義
interface AuthContextType {
  // 狀態
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  error: string | null
  
  // 操作方法
  login: () => Promise<AuthResult>
  logout: () => Promise<AuthResult>
  clearError: () => void
  
  // 便利屬性
  isLoggedIn: boolean
}

// 建立認證上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 認證提供者元件
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // 狀態管理
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 清除錯誤
  const clearError = () => setError(null)

  // Google 登入
  const login = async (): Promise<AuthResult> => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await signInWithGoogle()
      
      if (!result.success) {
        setError(result.error || '登入失敗')
      }
      
      return result
    } catch (error: any) {
      const errorMessage = '登入過程發生錯誤'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 登出
  const logout = async (): Promise<AuthResult> => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await signOutUser()
      
      if (result.success) {
        setUser(null)
        setUserProfile(null)
      } else {
        setError(result.error || '登出失敗')
      }
      
      return result
    } catch (error: any) {
      const errorMessage = '登出過程發生錯誤'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // 監聽認證狀態變化
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      try {
        setLoading(true)
        
        if (firebaseUser) {
          // 用戶已登入
          setUser(firebaseUser)
          
          // 建立或更新用戶資料
          const profile = await createOrUpdateUserProfile(firebaseUser)
          setUserProfile(profile)
          
          console.log('✅ 用戶認證狀態已更新:', firebaseUser.displayName)
        } else {
          // 用戶已登出
          setUser(null)
          setUserProfile(null)
          console.log('ℹ️ 用戶已登出')
        }
      } catch (error: any) {
        console.error('❌ 認證狀態處理失敗:', error)
        setError('認證狀態同步失敗')
      } finally {
        setLoading(false)
      }
    })

    // 清理函數
    return () => unsubscribe()
  }, [])

  // 計算便利屬性
  const isLoggedIn = !!user

  // 上下文值
  const contextValue: AuthContextType = {
    user,
    userProfile,
    loading,
    error,
    login,
    logout,
    clearError,
    isLoggedIn
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// 自定義 Hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth 必須在 AuthProvider 內部使用')
  }
  
  return context
}

// 便利 Hook：只獲取用戶資訊
export function useUser() {
  const { user, userProfile, isLoggedIn, loading } = useAuth()
  
  return {
    user,
    userProfile,
    isLoggedIn,
    loading
  }
}

// 便利 Hook：只獲取認證操作
export function useAuthActions() {
  const { login, logout, clearError } = useAuth()
  
  return {
    login,
    logout,
    clearError
  }
}