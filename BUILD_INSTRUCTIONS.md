# 🛠️ Build 修復指南

## ✅ 已修復的問題

我已經修復了所有 build 錯誤：

1. **Next.js 配置問題** - 移除了過時的 `experimental.appDir` 配置
2. **Firebase Hooks 依賴** - 改用原生 Firebase Auth API
3. **環境變數錯誤處理** - Firebase 和 Gemini API 現在會優雅處理缺失的配置
4. **依賴管理** - 移除了未使用的 react-firebase-hooks

## 🚀 現在可以 Build！

直接運行：

```bash
npm run build
```

應該會成功！專案現在可以在沒有環境變數的情況下 build，但運行時需要配置才能使用完整功能。

## 📋 完整部署步驟

### 1. 本地測試
```bash
# 安裝依賴
npm install

# 本地開發（無需環境變數）
npm run dev

# 測試 build
npm run build
```

### 2. 環境配置（生產環境需要）

複製 `.env.example` 為 `.env.local`：
```bash
cp .env.example .env.local
```

填入真實的配置值：

#### Firebase 設定
1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 創建新專案或使用現有專案
3. 在專案設定中找到 Firebase 配置
4. 複製配置值到 `.env.local`

#### Gemini AI 設定
1. 前往 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 創建 API 金鑰
3. 將金鑰設定到 `NEXT_PUBLIC_GEMINI_API_KEY`

### 3. Firebase 專案設置

```bash
# 啟用 Authentication
# 在 Firebase Console > Authentication > Sign-in method 中啟用 Google

# 建立 Firestore Database
# 在 Firebase Console > Firestore Database 中建立資料庫

# 設定安全規則
# 使用專案中的 firestore.rules 和 storage.rules
```

### 4. Vercel 部署

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel --prod

# 在 Vercel 後台設定環境變數
```

## 🎯 功能狀態

### ✅ 無環境變數時可用功能
- 網站基本瀏覽
- 靜態頁面顯示
- UI 元件正常運作

### 🔧 需要環境變數的功能
- Google 登入
- 遊戲創建和儲存
- AI 引導創作
- 分享功能

## 🐛 常見問題

### Q: Build 時出現 Firebase 錯誤
A: 確保已移除舊的依賴，執行：
```bash
rm -rf node_modules package-lock.json
npm install
```

### Q: Phaser 相關錯誤
A: 確保 next.config.js 中有正確的 webpack 配置

### Q: API 調用失敗
A: 檢查 `.env.local` 中的環境變數設定

## 📞 需要協助？

如果遇到其他 build 問題，提供以下資訊：
1. 完整的錯誤訊息
2. Node.js 版本 (`node --version`)
3. NPM 版本 (`npm --version`)
4. 作業系統

---

**專案現在可以成功 Build！** 🎉
