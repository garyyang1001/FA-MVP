# FA-MVP (FA-Game 最小可行產品)

## 專案簡介
FA-Game MVP 是一個親子共創遊戲平台，讓爸媽能夠在 AI 的引導下，與孩子一起創作簡單的小遊戲。透過引導式的對話流程，將孩子的想像力轉化為可玩的遊戲。

## 核心特色
- 🤖 AI 引導創作：Gemini AI 提供溫暖的引導文字，幫助家長知道如何提問
- 🎮 即時遊戲生成：根據孩子的回答，自動生成客製化的接水果遊戲
- 📱 輕鬆分享：一鍵生成分享連結和溫馨文案，讓親友也能玩到孩子的創作
- 🎯 5分鐘完成：簡單的創作流程，讓忙碌的家長也能輕鬆參與

## 技術架構
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
│   ├── lib/                    # 工具函式與設定
│   ├── hooks/                  # 自定義 Hooks
│   └── types/                  # TypeScript 型別定義
├── public/                     # 靜態資源
└── package.json
```

## 開發進度
詳見 [todo.md](./todo.md)

## 授權
MIT License
