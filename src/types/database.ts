import { Timestamp } from 'firebase/firestore'

// ===================
// 用戶相關型別
// ===================

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: Timestamp
  lastLoginAt: Timestamp
  gameCount: number
  totalPlays: number
  
  // 可選的額外資訊
  preferences?: {
    language?: string
    notifications?: boolean
    theme?: 'light' | 'dark' | 'auto'
  }
}

// ===================
// 遊戲相關型別
// ===================

// 遊戲配置 - 描述遊戲的所有設定
export interface GameConfig {
  // 基本資訊
  title: string
  description?: string
  
  // 遊戲機制設定
  objectType: string        // 掉落物類型 (如：蘋果、星星)
  objectEmoji: string       // 掉落物表情符號
  objectColor: string       // 顏色名稱
  catcherType: string       // 接取工具類型 (如：籃子、魔法棒)
  catcherEmoji: string      // 接取工具表情符號
  
  // 行為設定
  behaviors: {
    fallPattern: 'straight' | 'zigzag' | 'floating' | 'spinning'
    fallSpeed: 'slow' | 'medium' | 'fast'
    spawnRate: 'low' | 'medium' | 'high'
    specialEffect?: string
  }
  
  // 視覺效果
  visualEffects: {
    hasGlow?: boolean
    hasTrail?: boolean
    isAnimated?: boolean
    backgroundColor?: string
    particleEffect?: string
  }
  
  // 遊戲參數
  gameSettings: {
    duration?: number         // 遊戲時長 (秒)
    targetScore?: number      // 目標分數
    difficulty: 'easy' | 'medium' | 'hard'
  }
}

// 創作亮點 - 記錄創作過程中的精彩對話
export interface CreationHighlight {
  question: string          // AI 提出的問題
  answer: string           // 孩子的回答
  timestamp: Timestamp     // 回答時間
  aiResponse?: string      // AI 的回應
}

// 遊戲資料 - 完整的遊戲記錄
export interface Game {
  id: string               // 遊戲 ID
  userId: string           // 創作者 ID
  
  // 遊戲內容
  gameConfig: GameConfig
  creationHighlights: CreationHighlight[]
  
  // AI 生成內容
  shareText: string        // AI 生成的分享文案
  aiInsights?: string      // AI 對創作過程的洞察
  
  // 元數據
  createdAt: Timestamp
  updatedAt: Timestamp
  isPublic: boolean        // 是否公開分享
  isActive: boolean        // 是否啟用
  
  // 互動數據
  playCount: number        // 遊玩次數
  shareCount: number       // 分享次數
  likeCount: number        // 點讚次數
  
  // 標籤與分類
  tags?: string[]          // 遊戲標籤
  category?: string        // 遊戲分類
  
  // 技術資訊
  version: string          // 遊戲版本
  gameEngine: string       // 遊戲引擎版本
}

// ===================
// 互動記錄型別
// ===================

// 遊戲遊玩記錄
export interface GamePlay {
  id: string
  gameId: string           // 對應的遊戲 ID
  playerId?: string        // 遊玩者 ID (可以是匿名)
  
  // 遊玩資料
  score: number            // 最終分數
  duration: number         // 遊玩時長 (秒)
  completedAt: Timestamp
  
  // 遊玩統計
  itemsCaught: number      // 接到的物品數量
  itemsMissed: number      // 錯過的物品數量
  maxCombo: number         // 最大連擊數
  
  // 設備資訊
  platform: 'mobile' | 'desktop' | 'tablet'
  userAgent?: string
  
  // 可選的額外資訊
  feedback?: {
    rating: number         // 1-5 星評價
    comment?: string       // 評論
  }
}

// 分享記錄
export interface ShareRecord {
  id: string
  gameId: string
  sharerId?: string        // 分享者 ID
  
  // 分享資訊
  platform: 'facebook' | 'twitter' | 'line' | 'link' | 'other'
  sharedAt: Timestamp
  
  // 效果追蹤
  clickCount: number       // 點擊次數
  conversionCount: number  // 轉換次數 (點擊後實際遊玩)
}

// ===================
// 系統型別
// ===================

// API 回應格式
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp: Timestamp
}

// 分頁查詢結果
export interface PaginatedResult<T> {
  items: T[]
  totalCount: number
  hasMore: boolean
  nextCursor?: string
}

// 搜尋查詢參數
export interface SearchQuery {
  keyword?: string
  category?: string
  tags?: string[]
  sortBy?: 'newest' | 'popular' | 'trending'
  limit?: number
  cursor?: string
}

// ===================
// 創作流程型別
// ===================

// 創作步驟定義
export interface CreationStep {
  stepNumber: number
  stepId: string
  title: string
  description: string
  
  // AI 引導內容
  aiPrompt: string
  suggestedQuestions: string[]
  
  // 使用者輸入
  userInput?: string
  completedAt?: Timestamp
  
  // 驗證規則
  validation?: {
    required: boolean
    minLength?: number
    maxLength?: number
    pattern?: string
  }
}

// 創作會話 - 記錄完整的創作過程
export interface CreationSession {
  id: string
  userId: string
  
  // 會話狀態
  currentStep: number
  isCompleted: boolean
  steps: CreationStep[]
  
  // 時間記錄
  startedAt: Timestamp
  completedAt?: Timestamp
  lastActiveAt: Timestamp
  
  // 會話結果
  resultGameId?: string    // 如果完成創作，對應的遊戲 ID
  
  // 會話統計
  totalTimeSpent: number   // 總花費時間 (秒)
  interactionCount: number // 互動次數
}

// ===================
// 匯出常用型別組合
// ===================

export type DatabaseCollections = {
  users: UserProfile
  games: Game
  gamePlays: GamePlay
  shareRecords: ShareRecord
  creationSessions: CreationSession
}

export type GameWithCreator = Game & {
  creator: Pick<UserProfile, 'displayName' | 'photoURL'>
}

export type PopularGame = Game & {
  ranking: number
  trendingScore: number
}