# FA-Game MVP 開發文件 v2.1

## 目錄
1. [MVP 核心理念](#mvp-核心理念)
2. [技術架構優化](#技術架構優化)
3. [創意映射系統](#創意映射系統)
4. [AI 整合策略](#ai-整合策略)
5. [遊戲實作指南](#遊戲實作指南)
6. [部署與測試](#部署與測試)

## MVP 核心理念

### 少即是多的設計哲學

我們的 MVP 專注於**一個遊戲框架，無限種變化**的理念：
- 不是做很多平庸的功能，而是把一個功能做到極致
- 同樣的「接水果」框架，因為孩子的創意不同，每個成品都是獨特的
- 限制中的無限可能反而更能激發創意

### 核心價值主張

**不是**「能創造很多種遊戲」
**而是**「AI 能幫助家長更好地引導孩子創作」

這個價值主張的驗證，只需要一個精心設計的遊戲就足夠了。

## 技術架構優化

### 三層架構設計

```
自然語言層 → 遊戲配置層 → Phaser 實作層
```

1. **自然語言層**：AI 理解孩子的創意表達
2. **遊戲配置層**：將創意映射為抽象的遊戲配置
3. **Phaser 實作層**：將配置轉換為具體的遊戲邏輯

### 關鍵原則

- **AI 不需要理解 Phaser**：就像導演不需要懂攝影機內部構造
- **預設值保護**：每個 AI 決策都有安全的預設值
- **有限選項**：限制 AI 只能從預定義選項中選擇
- **驗證層**：確保 AI 輸出永遠在可控範圍內

## 創意映射系統

### 核心檔案：`src/lib/game-mappings.ts`

定義了 30+ 種預設組合，包括：

#### 物品映射
```typescript
"蘋果": {
  visual: "🍎",
  behavior: "正常掉落，像真的蘋果一樣",
  specialEffect: "接到時有咬一口的音效",
  emotionalValue: "健康、營養"
}
```

#### 接取工具映射
```typescript
"魔法棒": {
  visual: "🪄",
  size: "small",
  specialAbility: "點擊可以瞬間移動",
  emotionalValue: "神奇、有力量"
}
```

#### 特殊效果
- 彩虹色：物品會不斷變換顏色
- 金色：物品會發出金光，接到時加倍得分
- 愛心爆炸：接到時畫面充滿愛心

## AI 整合策略

### 增強的 Gemini 提示詞系統

```typescript
const CATCH_GAME_PROMPT = `
你是一個親子遊戲創作助手，專門幫助家長引導孩子創作「接東西」遊戲。

重要原則：
1. 你只需要理解孩子的想法，不需要了解遊戲技術細節
2. 專注於描述遊戲效果會多麼有趣
3. 用溫暖、充滿想像力的語言回應
4. 每個選擇都會產生獨特的視覺效果
`;
```

### AI 的任務

1. **理解創意**：解析孩子的自然語言輸入
2. **描述效果**：生動地描述選擇會產生什麼效果
3. **引導家長**：提供下一步的引導建議
4. **生成分享文案**：創造溫馨的分享內容

## 遊戲實作指南

### 1. 接水果遊戲場景：`src/game-templates/catch-game.ts`

#### 核心功能
- 動態掉落模式（直線、之字形、飄浮、旋轉）
- 可調整的速度和生成率
- 特殊視覺效果（發光、軌跡、動畫）
- 碰撞檢測和得分系統

#### 配置介面
```typescript
export interface CatchGameConfig {
  objectType: string;        // 掉落物類型
  objectEmoji: string;       // 顯示的表情符號
  objectColor: string;       // 顏色名稱
  catcherType: string;       // 接取工具類型
  catcherEmoji: string;      // 接取工具表情符號
  behaviors: {
    fallPattern: 'straight' | 'zigzag' | 'floating' | 'spinning';
    fallSpeed: 'slow' | 'medium' | 'fast';
    spawnRate: 'low' | 'medium' | 'high';
    specialEffect?: string;
  };
  visualEffects: {
    hasGlow?: boolean;
    hasTrail?: boolean;
    isAnimated?: boolean;
    backgroundColor?: string;
  };
}
```

### 2. 即時預覽組件：`src/components/creation/live-preview.tsx`

提供創作過程中的視覺回饋：
- 動態顯示選擇的物品和工具
- 模擬掉落動畫
- 顯示特殊效果預覽
- 情感價值說明

### 3. 創作流程整合

```typescript
// 步驟定義
const CATCH_GAME_STEPS = [
  {
    id: 'object-type',
    parentGuidance: '問問孩子想接什麼東西呢？',
    suggestedQuestions: [
      '寶貝想接什麼水果呢？',
      '想要接可愛的小動物嗎？',
      '要不要接天上掉下來的星星？'
    ]
  },
  // ... 更多步驟
];
```

## 部署與測試

### 環境變數配置

```env
# 必需的 API Keys
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Firebase 配置
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 測試檢查清單

#### 功能測試
- [x] AI 引導文字清晰易懂
- [x] 創作流程可在 5 分鐘內完成
- [x] 每個選擇都產生不同效果
- [x] 即時預覽正常運作
- [x] 遊戲生成正確
- [x] 分享功能正常

#### 使用者體驗測試
- [x] 手機觸控操作順暢
- [x] 載入狀態明確
- [x] 錯誤提示友善
- [x] 視覺效果吸引人

### 部署步驟

1. **確保所有依賴正確安裝**
   ```bash
   npm install
   npm run build
   ```

2. **設置 Vercel 環境變數**
   - 在 Vercel 後台設置所有必需的環境變數
   - 確保 API Keys 都是有效的

3. **部署到 Vercel**
   ```bash
   vercel --prod
   ```

## 關鍵洞察

### 成功的 MVP 需要

1. **聚焦**：專注於核心體驗，不是功能數量
2. **變化性**：同一框架能產生多種結果
3. **即時回饋**：讓創作過程本身就很有趣
4. **情感連結**：每個選擇都有情感價值

### AI 的真正價值

不在於理解技術，而在於：
- 理解孩子的想像力
- 將創意轉化為可見的效果
- 讓每個家庭都能創造獨特體驗

## 下一步計劃

當 MVP 驗證成功後：
1. 收集使用者回饋
2. 增加更多創意映射選項
3. 優化 AI 引導能力
4. 考慮擴展到其他遊戲類型

---

記住：**少即是多**。專注於把一個遊戲做到極致，讓每個家庭都能創造出獨一無二的作品。
