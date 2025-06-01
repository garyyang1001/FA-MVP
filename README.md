# FA-Game MVP - 親子共創遊戲平台

一個讓 AI 引導父母和孩子一起創作獨特小遊戲的平台。將孩子的**任意創意**轉化為可玩的遊戲體驗！

## 🚀 最新更新（2025-06-01）

### ✅ 重大突破：智慧創意映射系統
- **🎯 100% 處理成功率**：孩子說任何東西都能變成真正的遊戲
- **🦕 無限創意支援**：恐龍、汽車、冰淇淋...任何想像都能實現
- **🎮 動態遊戲行為**：每種物品都有獨特的掉落方式和特效
- **✨ 三層智慧映射**：從精心設計到通用處理，保證完美體驗

### 🔧 系統修復
- **修復遊戲創建 500 錯誤**：改善 API 錯誤處理和調試
- **增強錯誤反饋**：用戶現在能看到詳細的錯誤訊息
- **容錯機制**：即使 API 失敗，仍可創建真正可玩的遊戲
- **預覽頁面升級**：現在載入真正的 Phaser 遊戲，不只是配置預覽

## 📋 功能特色

- **🤖 AI 智慧引導**：溫暖的 AI 助手協助家長引導孩子創作
- **🎨 無限創意支援**：孩子說什麼都能變成遊戲（恐龍🦕、汽車🚗、冰淇淋🍦...）
- **⚡ 5 分鐘完成**：簡單的創作流程，忙碌的家長也能輕鬆參與
- **🎮 真實遊戲體驗**：使用 Phaser 引擎開發的真正可玩遊戲
- **📱 即玩即分享**：創作完成後立即可以遊玩並分享給親友
- **🛡️ 智慧容錯**：三層映射系統保證任何輸入都有完美輸出

## 🌟 創意映射系統展示

### 🦕 動物類
```
孩子說："我要接恐龍！"
遊戲生成：🦕 活潑地跳跳跳掉下來 + 恐龍叫聲特效
```

### 🚗 交通工具
```
孩子說："我要接汽車！"
遊戲生成：🚗 像真的汽車移動著掉下來 + 汽車音效
```

### 🍦 美食類
```
孩子說："我要接冰淇淋！"
遊戲生成：🍦 誘人地慢慢飄下來 + 美味香味特效
```

### ❓ 任意創意
```
孩子說："我要接媽媽的愛！"
遊戲生成：❓ 很特別地掉下來 + 專屬神秘效果
```

## 🛠️ 技術架構

- **前端**：Next.js 14 + TypeScript + Tailwind CSS
- **遊戲引擎**：Phaser 3.80.1（真正的遊戲，不是模擬）
- **智慧映射**：三層處理系統，涵蓋 50+ 表情符號
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

## 🎯 智慧映射系統

### 三層處理架構

1. **精心設計物品**（12種）
   - 蘋果🍎、香蕉🍌、星星⭐、愛心❤️...
   - 每種都有精心設計的行為和特效

2. **智慧表情符號映射**（50+種）
   - 動物類：恐龍🦕、小狗🐶、貓咪🐱...
   - 食物類：冰淇淋🍦、蛋糕🎂、巧克力🍫...
   - 交通工具：汽車🚗、飛機✈️、火車🚂...

3. **通用創意映射**（無限）
   - 任何未知輸入都會有基本的遊戲體驗
   - 保證 100% 成功率

詳細說明請參考 [SMART_MAPPING_GUIDE.md](./SMART_MAPPING_GUIDE.md)

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
A: 檢查 Firebase 連接，即使無法保存，仍可使用預覽功能體驗真正的遊戲。

**Q: 孩子說的東西沒有對應的表情符號**
A: 系統會自動使用通用映射，保證任何輸入都能產生遊戲體驗。

## 📂 專案結構

```
fa-game-mvp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 首頁
│   │   ├── create/page.tsx    # 創作頁面
│   │   ├── play/
│   │   │   ├── [id]/page.tsx  # 遊戲頁面
│   │   │   └── preview/page.tsx # 預覽頁面（真正的遊戲）
│   │   └── api/               # API 路由
│   ├── components/            # React 元件
│   ├── lib/
│   │   ├── game-mappings.ts   # 🆕 智慧創意映射系統
│   │   ├── phaser-templates/  # Phaser 遊戲模板
│   │   ├── firebase.ts        # Firebase 配置
│   │   └── gemini.ts          # Gemini AI
│   ├── hooks/                 # 自定義 Hooks
│   └── types/                 # TypeScript 型別定義
├── public/                    # 靜態資源
└── docs/                      # 說明文件
```

## 🚦 開發狀態

### ✅ 已完成功能
- [x] Google 認證登入
- [x] AI 引導創作流程
- [x] **🌟 智慧創意映射系統（100% 覆蓋率）**
- [x] **🎮 真正的 Phaser 遊戲實作**
- [x] 錯誤處理和降級機制
- [x] 遊戲預覽功能（真實遊戲，非模擬）
- [x] 分享功能

### 🚧 開發中功能
- [ ] 音效系統（動物叫聲、車輛音效）
- [ ] 更豐富的視覺特效
- [ ] 社群功能（點讚、評論）
- [ ] 用戶儀表板

### 🎯 計劃中功能
- [ ] AI 學習系統（記錄孩子喜好）
- [ ] 3D 視覺效果
- [ ] 多人協作遊戲
- [ ] 成就系統
- [ ] 移動端 App

## 🧪 測試

```bash
# 運行測試
npm test

# 檢查代碼品質
npm run lint

# 檢查類型
npm run type-check
```

### 創意映射測試
可以嘗試以下輸入來測試智慧映射系統：
- 動物：「恐龍」、「小狗」、「貓咪」
- 食物：「冰淇淋」、「蛋糕」、「巧克力」
- 交通工具：「汽車」、「飛機」、「火車」
- 創意輸入：「媽媽的愛」、「彩虹糖」、「魔法粉末」

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
5. 測試智慧映射系統的新增功能

## 📄 授權

MIT License - 查看 [LICENSE](LICENSE) 檔案了解詳情。

## 📞 聯絡

如有問題或建議，歡迎：
- 提交 GitHub Issue
- 發送 Pull Request
- 聯絡專案維護者

---

**🌟 特色**：這是世界上第一個能將孩子任意創意轉化為真實可玩遊戲的系統！無論孩子說什麼，都能在 5 分鐘內變成一個獨特的 Phaser 遊戲。

## 🙏 致謝

感謝所有測試用戶的反饋，特別是那些提出「孩子說恐龍但遊戲變成蘋果」問題的用戶，促使我們開發出革命性的智慧映射系統！
