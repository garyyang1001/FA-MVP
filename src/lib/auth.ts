import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User,
  UserCredential
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, db } from './firebase'

// 用戶資料型別定義
export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: any
  lastLoginAt: any
  gameCount: number
  totalPlays: number
}

// 認證結果型別
export interface AuthResult {
  success: boolean
  user?: UserProfile
  error?: string
}

/**
 * Google 登入功能
 * 使用彈出視窗方式，提供最佳的用戶體驗
 */
export const signInWithGoogle = async (): Promise<AuthResult> => {
  try {
    console.log('🚀 開始 Google 登入流程...')
    
    // 執行 Google 登入
    const result: UserCredential = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    if (!user) {
      throw new Error('登入成功但未獲取到用戶資訊')
    }

    console.log('✅ Google 登入成功:', user.displayName)
    
    // 建立或更新用戶資料
    const userProfile = await createOrUpdateUserProfile(user)
    
    return {
      success: true,
      user: userProfile
    }
    
  } catch (error: any) {
    console.error('❌ Google 登入失敗:', error)
    
    // 處理常見錯誤
    let errorMessage = '登入失敗，請稍後再試'
    
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = '登入視窗被關閉，請重新嘗試'
        break
      case 'auth/popup-blocked':
        errorMessage = '彈出視窗被瀏覽器阻擋，請允許彈出視窗後重試'
        break
      case 'auth/network-request-failed':
        errorMessage = '網路連線失敗，請檢查網路設定'
        break
      case 'auth/too-many-requests':
        errorMessage = '登入嘗試次數過多，請稍後再試'
        break
    }
    
    return {
      success: false,
      error: errorMessage
    }
  }
}

/**
 * 登出功能
 */
export const signOutUser = async (): Promise<AuthResult> => {
  try {
    await signOut(auth)
    console.log('✅ 用戶已登出')
    
    return { success: true }
  } catch (error: any) {
    console.error('❌ 登出失敗:', error)
    return {
      success: false,
      error: '登出失敗，請重新整理頁面'
    }
  }
}

/**
 * 建立或更新用戶資料
 * 確保 Firestore 中有完整的用戶資訊
 */
export const createOrUpdateUserProfile = async (user: User): Promise<UserProfile> => {
  const userRef = doc(db, 'users', user.uid)
  
  try {
    // 檢查用戶是否已存在
    const userDoc = await getDoc(userRef)
    const now = serverTimestamp()
    
    if (userDoc.exists()) {
      // 用戶已存在，更新最後登入時間
      const existingData = userDoc.data() as UserProfile
      
      await setDoc(userRef, {
        ...existingData,
        displayName: user.displayName || existingData.displayName,
        photoURL: user.photoURL || existingData.photoURL,
        lastLoginAt: now
      }, { merge: true })
      
      console.log('✅ 用戶資料已更新')
      return {
        ...existingData,
        displayName: user.displayName || existingData.displayName,
        photoURL: user.photoURL || existingData.photoURL
      }
      
    } else {
      // 新用戶，建立完整資料
      const newUserProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '匿名用戶',
        photoURL: user.photoURL || undefined,
        createdAt: now,
        lastLoginAt: now,
        gameCount: 0,
        totalPlays: 0
      }
      
      await setDoc(userRef, newUserProfile)
      console.log('✅ 新用戶資料已建立')
      
      return newUserProfile
    }
    
  } catch (error) {
    console.error('❌ 用戶資料處理失敗:', error)
    
    // 如果資料庫操作失敗，返回基本用戶資訊
    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '匿名用戶',
      photoURL: user.photoURL || undefined,
      createdAt: null,
      lastLoginAt: null,
      gameCount: 0,
      totalPlays: 0
    }
  }
}

/**
 * 監聽認證狀態變化
 * 用於 React Hook 中追蹤登入狀態
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

/**
 * 獲取當前用戶
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

/**
 * 檢查用戶是否已登入
 */
export const isUserLoggedIn = (): boolean => {
  return !!auth.currentUser
}