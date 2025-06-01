# FA-MVP (FA-Game 最小可行產品)

## 專案簡介
FA-Game MVP 是一個親子共創遊戲平台，讓爸媽能夠在 AI 的引導下，與孩子一起創作簡單的小遊戲。透過引導式的對話流程，將孩子的想像力轉化為可玩的遊戲。

## 🌟 核心特色

### MVP 聚焦：一個遊戲，無限可能
- 🎯 **專注接水果遊戲**：一個框架，千種變化
- 🎨 **創意映射系統**：30+ 種預設物品和效果組合
- 👀 **即時效果預覽**：選擇後立即看到視覺效果
- 🤖 **AI 智慧引導**：Gemini AI 提供溫暖的引導文字
- 📱 **5分鐘完成**：簡單的創作流程，讓忙碌的家長也能輕鬆參與

### 接水果遊戲的無限變化

同一個遊戲框架，因為孩子的創意不同，每個成品都是獨特的：

**小明的創作**：用魔法棒接彩虹色的星星 → 夢幻的魔法遊戲  
**小美的創作**：用擁抱接愛心 → 溫馨的情感表達遊戲  
**小華的創作**：用籃子接會跳的香蕉 → 歡樂的水果派對

每個選擇都有獨特效果：
- 🍎 蘋果：正常掉落，接到時有咬一口的音效
- ⭐ 星星：之字形飄落，接到時整個畫面會閃閃發光
- ❤️ 愛心：溫柔地飄落，接到時畫面充滿愛心
- 🪄 魔法棒：點擊可以瞬間移動
- 🤗 擁抱：有吸引力，東西會自動靠近

## 技術架構

### 三層架構設計
```
自然語言層 → 遊戲配置層 → Phaser 實作層
```

- **前端框架**: Next.js 14 (App Router)
- **遊戲引擎**: Phaser 3
- **AI 服務**: Google Gemini API
- **資料庫**: Firebase Firestore
- **認證**: Firebase Auth (Google Login)
- **部署**: Vercel

## 快速開始

### 環境需求
- Node.js 18+
- npm 或 yarn
- Firebase 專案
- Gemini API Key

### 安裝步驟
```bash
# Clone 專案
git clone https://github.com/garyyang1001/FA-MVP.git
cd FA-MVP

# 安裝套件
npm install

# 設定環境變數
cp .env.example .env.local
# 編輯 .env.local 填入您的 API keys

# 啟動開發伺服器
npm run dev
```

## 專案結構
```
fa-mvp/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React 元件
│   │   └── creation/          # 創作流程元件
│   │       └── live-preview.tsx # 即時預覽
│   ├── lib/                    # 工具函式與設定
│   │   ├── gemini.ts          # AI 整合
│   │   └── game-mappings.ts   # 創意映射系統
│   ├── game-templates/         # 遊戲模板
│   │   └── catch-game.ts      # 接水果遊戲
│   ├── hooks/                  # 自定義 Hooks
│   └── types/                  # TypeScript 型別定義
├── public/                     # 靜態資源
└── package.json
```

## 核心功能實作

### 1. 創意映射系統 (`src/lib/game-mappings.ts`)
- 預定義 30+ 種物品、工具、顏色組合
- 每個選擇都有獨特的視覺效果和情感價值
- AI 只需理解創意，不需了解技術細節

### 2. AI 引導系統 (`src/lib/gemini.ts`)
- 專注於理解孩子的想像力
- 生動描述遊戲效果
- 提供溫暖的引導文字
- 生成分享文案

### 3. 遊戲引擎 (`src/game-templates/catch-game.ts`)
- 支援多種掉落模式（直線、之字形、飄浮、旋轉）
- 豐富的視覺效果（發光、彩虹色、特殊動畫）
- 完全參數化配置

### 4. 即時預覽 (`src/components/creation/live-preview.tsx`)
- 創作過程中的視覺回饋
- 動態效果展示
- 詳細的效果說明

## 開發理念

### 少即是多
- 不是做很多平庸的功能，而是把一個功能做到極致
- 限制中的無限可能反而更能激發創意

### AI 的價值
- 不在於理解技術，而在於理解孩子的想像力
- 將創意轉化為可見的魔法

### 聚焦核心體驗
- 高品質的親子互動時間
- 看到孩子的創意被實現
- 創造獨特的家庭回憶

## 開發進度
詳見 [MVP_DEVELOPMENT_GUIDE.md](./MVP_DEVELOPMENT_GUIDE.md)

## 貢獻指南
歡迎提交 Issue 和 Pull Request！

## 授權
MIT License
