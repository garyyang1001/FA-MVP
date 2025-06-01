# FA-Game MVP 環境變數檢查指南

遊戲創建功能出現500錯誤時，請按照以下步驟檢查環境變數配置：

## 🔍 問題診斷

### 1. 檢查 .env.local 檔案

確保您的專案根目錄有 `.env.local` 檔案，包含以下環境變數：

```bash
# 複製 .env.example 為 .env.local
cp .env.example .env.local
```

### 2. Firebase 配置檢查

必須正確設定以下 Firebase 環境變數：

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=你的_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=你的專案.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=你的專案ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=你的專案.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=你的sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=你的app_id
```

### 3. Gemini API 配置（可選）

如需 AI 功能，設定：

```bash
NEXT_PUBLIC_GEMINI_API_KEY=你的_gemini_api_key
```

## 🔧 快速修復

### 情況1：Firebase 連接失敗

**症狀**：控制台顯示 Firebase 相關錯誤

**解決方案**：
1. 檢查 Firebase 專案是否正常運作
2. 確認 API 金鑰是否有效
3. 檢查 Firestore 安全規則是否正確設定

### 情況2：Gemini API 調用失敗

**症狀**：AI 功能無法使用

**解決方案**：
1. 檢查 Gemini API 金鑰是否有效
2. 確認 API 調用額度是否足夠
3. 即使沒有 API 金鑰，遊戲創建功能仍應正常運作

### 情況3：完全無法運作

**症狀**：500 錯誤持續出現

**解決方案**：
1. 檢查控制台錯誤訊息
2. 確認所有環境變數都已正確設定
3. 重啟開發伺服器：`npm run dev`

## 📝 環境變數優先級

1. **必要**：Firebase 配置（遊戲儲存功能）
2. **重要**：APP_URL（分享功能）
3. **可選**：Gemini API（AI 引導功能）

## 🚨 常見錯誤

### Firebase 初始化失敗
```bash
Error: Firebase config missing or invalid
```
**解決**：檢查所有 NEXT_PUBLIC_FIREBASE_* 環境變數

### API 調用失敗
```bash
Error: 創建遊戲失敗
```
**解決**：查看瀏覽器開發者工具的 Network 標籤，檢查具體的 API 錯誤

### Gemini API 問題
```bash
Warning: Gemini AI 未配置，使用預設引導
```
**解決**：這是正常的警告，不影響核心功能

## 🛠️ 除錯步驟

1. **檢查環境變數**
   ```bash
   # 確認檔案存在
   ls -la .env.local
   
   # 檢查內容（不要包含實際 API 金鑰）
   cat .env.local | grep -v "="
   ```

2. **重啟服務**
   ```bash
   # 停止開發伺服器
   Ctrl + C
   
   # 重新啟動
   npm run dev
   ```

3. **檢查控制台輸出**
   - 瀏覽器開發者工具的 Console 標籤
   - 終端機的伺服器日誌
   - Network 標籤中的 API 請求詳情

## ✅ 驗證設定

如果環境變數設定正確，您應該看到：

1. **首頁**：顯示 "✅ Firebase 認證系統已就位"
2. **創作頁面**：可以正常登入並開始創作
3. **遊戲創建**：完成創作流程後能成功生成遊戲

## 🆘 如果問題持續

如果按照上述步驟仍無法解決問題：

1. 檢查 GitHub Issues 是否有類似問題
2. 提供完整的錯誤訊息
3. 說明您的環境（Node.js 版本、瀏覽器等）

記住：即使 Gemini API 未配置，核心的遊戲創建功能仍應正常運作！
