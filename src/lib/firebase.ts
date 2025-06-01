import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

// Firebase 配置 - 從環境變數讀取
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// 驗證配置完整性
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
]

// 檢查環境變數是否完整
const missingVars = requiredEnvVars.filter(
  varName => !process.env[varName]
)

if (missingVars.length > 0) {
  throw new Error(
    `缺少必要的 Firebase 環境變數: ${missingVars.join(', ')}\n` +
    '請檢查你的 .env.local 檔案配置'
  )
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
  login_hint: 'user@example.com' // 可選：提供登入提示
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
  isConfigured: true
}

// 健康檢查函數
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // 簡單的連接測試
    await db._delegate._databaseId
    return true
  } catch (error) {
    console.error('Firebase 連接失敗:', error)
    return false
  }
}