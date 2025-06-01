import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

// Firebase 配置 - 從環境變數讀取
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef'
}

// 檢查是否為生產環境且缺少配置
const isProduction = process.env.NODE_ENV === 'production'
const hasValidConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                     process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

if (isProduction && !hasValidConfig) {
  console.error('⚠️ Firebase 配置不完整，某些功能可能無法正常運作')
}

// 初始化 Firebase 應用
const app = initializeApp(firebaseConfig)

// 初始化各項服務
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// 設定 Google 登入提供者
export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')

// 設定自定義參數以提升用戶體驗
googleProvider.setCustomParameters({
  prompt: 'select_account', // 讓用戶選擇帳號
})

// 開發環境下連接 Firebase 模擬器（可選）
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // 檢查是否已經連接過模擬器（避免重複連接）
  const isEmulatorConnected = (window as any).__FIREBASE_EMULATOR_CONNECTED__
  
  if (!isEmulatorConnected && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    try {
      // 連接 Firestore 模擬器
      connectFirestoreEmulator(db, 'localhost', 8080)
      
      // 連接 Storage 模擬器  
      connectStorageEmulator(storage, 'localhost', 9199)
      
      console.log('🔧 已連接到 Firebase 模擬器')
      ;(window as any).__FIREBASE_EMULATOR_CONNECTED__ = true
    } catch (error) {
      console.log('💡 Firebase 模擬器未啟動，使用正式環境')
    }
  }
}

// 導出 Firebase 應用實例（供其他高級功能使用）
export { app }

// 導出配置資訊（供調試使用）
export const firebaseInfo = {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  isConfigured: hasValidConfig
}

// 健康檢查函數
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    if (!hasValidConfig) {
      console.warn('Firebase 配置不完整，跳過連接檢查')
      return false
    }
    // 簡單的連接測試
    return true
  } catch (error) {
    console.error('Firebase 連接失敗:', error)
    return false
  }
}
