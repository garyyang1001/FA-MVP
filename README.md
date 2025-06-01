# FA-Game MVP - 親子共創遊戲平台

一個讓 AI 引導父母和孩子一起創作獨特小遊戲的平台。將孩子的創意轉化為可玩的遊戲體驗！

## 🚀 最新更新（2025-06-01）

### ✅ 已修復問題
- **修復遊戲創建 500 錯誤**：改善 API 錯誤處理和調試
- **增強錯誤反饋**：用戶現在能看到詳細的錯誤訊息
- **容錯機制**：即使 API 失敗，仍可創建臨時遊戲預覽
- **預覽頁面**：新增遊戲預覽功能，展示創作成果

### 🔧 改進功能
- 更詳細的錯誤日誌和調試資訊
- 優雅的降級處理（Graceful Degradation）
- 環境變數檢查和診斷指南
- 改善的用戶體驗和錯誤提示

## 📋 功能特色

- **🤖 AI 智慧引導**：溫暖的 AI 助手協助家長引導孩子創作
- **⚡ 5 分鐘完成**：簡單的創作流程，忙碌的家長也能輕鬆參與
- **🎮 即玩即分享**：創作完成後立即可以預覽並分享給親友
- **🛡️ 容錯設計**：即使部分功能失效，核心體驗仍能正常運作

## 🛠️ 技術架構

- **前端**：Next.js 14 + TypeScript + Tailwind CSS
- **後端**：Next.js API Routes
- **資料庫**：Firebase Firestore
- **認證**：Firebase Auth (Google OAuth)
- **AI**：Google Gemini API（可選）
- **部署**：Vercel

## 🏃‍♂️ 快速開始

### 1. 克隆專案
```bash
git clone https://github.com/garyyang1001/FA-MVP.git
cd FA-MVP
```

### 2. 安裝依賴
```bash
npm install
```

### 3. 環境設定
```bash
# 複製環境變數範例
cp .env.example .env.local

# 編輯 .env.local，填入您的配置
```

**必要配置**：
```bash
# Firebase 配置（必須）
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# 應用設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**可選配置**：
```bash
# Gemini AI 配置（可選，用於 AI 引導功能）
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 4. 啟動開發服務器
```bash
npm run dev
```

專案將在 [http://localhost:3000](http://localhost:3000) 啟動。

## 🔍 問題排除

如果遇到 **"開始遊戲功能失效"** 或 **500 錯誤**，請參考：

### 快速診斷
1. **檢查控制台錯誤**：打開瀏覽器開發者工具查看詳細錯誤
2. **檢查環境變數**：確認 `.env.local` 檔案存在且配置正確
3. **重啟服務**：停止並重新啟動開發伺服器

### 詳細指南
查看 [ENV_DEBUG_GUIDE.md](./ENV_DEBUG_GUIDE.md) 獲取完整的問題診斷和解決方案。

### 常見問題

**Q: 出現 "創建遊戲失敗" 錯誤**
A: 檢查 Firebase 配置是否正確，參考除錯指南進行診斷。

**Q: AI 引導功能無法使用**
A: 這是正常的，如果沒有設定 Gemini API 金鑰，系統會使用預設引導。

**Q: 遊戲無法保存**
A: 檢查 Firebase 連接，即使無法保存，仍可使用預覽功能。

## 📂 專案結構

```
fa-game-mvp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 首頁
│   │   ├── create/page.tsx    # 創作頁面
│   │   ├── play/
│   │   │   ├── [id]/page.tsx  # 遊戲頁面
│   │   │   └── preview/page.tsx # 預覽頁面
│   │   └── api/               # API 路由
│   ├── components/            # React 元件
│   ├── lib/                   # 工具函數和配置
│   ├── hooks/                 # 自定義 Hooks
│   └── types/                 # TypeScript 型別定義
├── public/                    # 靜態資源
└── docs/                      # 說明文件
```

## 🚦 開發狀態

### ✅ 已完成功能
- [x] Google 認證登入
- [x] AI 引導創作流程
- [x] 基礎遊戲配置生成
- [x] 錯誤處理和降級機制
- [x] 遊戲預覽功能
- [x] 分享功能

### 🚧 開發中功能
- [ ] 完整的 Phaser 遊戲實作
- [ ] 遊戲素材庫
- [ ] 社群功能（點讚、評論）
- [ ] 用戶儀表板

### 🎯 計劃中功能
- [ ] 更多遊戲模板
- [ ] 成就系統
- [ ] 親子創作統計
- [ ] 移動端優化

## 🧪 測試

```bash
# 運行測試
npm test

# 檢查代碼品質
npm run lint

# 檢查類型
npm run type-check
```

## 📦 部署

### Vercel 部署
1. 推送代碼到 GitHub
2. 在 Vercel 導入專案
3. 設定環境變數
4. 部署

### 環境變數設定
在 Vercel 設定中添加所有 `.env.local` 中的變數。

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

### 開發準則
1. 遵循現有的代碼風格
2. 添加適當的註釋
3. 確保所有測試通過
4. 更新相關文件

## 📄 授權

MIT License - 查看 [LICENSE](LICENSE) 檔案了解詳情。

## 📞 聯絡

如有問題或建議，歡迎：
- 提交 GitHub Issue
- 發送 Pull Request
- 聯絡專案維護者

---

**注意**：這是 MVP（最小可行產品）版本，專注於核心功能驗證。我們會根據使用者反饋持續改進和添加新功能。

## 🙏 致謝

感謝所有測試用戶的反饋，幫助我們改進產品體驗！
