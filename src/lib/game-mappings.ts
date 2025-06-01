/**
 * 智慧創意映射系統
 * 能夠處理孩子的任意創意想法，不局限於預定義清單
 */

export interface CreativeMapping {
  visual: string;           // 視覺表現（表情符號）
  behavior: string;         // 行為描述
  specialEffect: string;    // 特殊效果
  emotionalValue: string;   // 情感價值
}

export interface GameEffectMapping {
  fallPattern: 'straight' | 'zigzag' | 'floating' | 'spinning';
  visualEffect: string;
  encouragement: string[];
}

// 預定義的精心設計物品（已知的好效果）
export const PREDEFINED_OBJECTS: Record<string, CreativeMapping> = {
  // 水果類
  "蘋果": {
    visual: "🍎",
    behavior: "正常掉落，像真的蘋果一樣",
    specialEffect: "接到時有咬一口的音效",
    emotionalValue: "健康、營養"
  },
  "香蕉": {
    visual: "🍌",
    behavior: "會左右搖擺著掉下來",
    specialEffect: "接到時會剝皮的動畫",
    emotionalValue: "趣味、活潑"
  },
  "西瓜": {
    visual: "🍉",
    behavior: "比較重，掉得快一點",
    specialEffect: "接到時濺出西瓜汁",
    emotionalValue: "夏天、清涼"
  },
  
  // 天空類
  "星星": {
    visual: "⭐",
    behavior: "輕飄飄地，之字形飄落",
    specialEffect: "接到時整個畫面會閃閃發光",
    emotionalValue: "夢想、希望"
  },
  "月亮": {
    visual: "🌙",
    behavior: "慢慢地、優雅地飄下來",
    specialEffect: "接到時背景變成美麗的夜空",
    emotionalValue: "寧靜、神秘"
  },
  "雲朵": {
    visual: "☁️",
    behavior: "輕飄飄地左右飄動",
    specialEffect: "接到時會下小雨",
    emotionalValue: "柔軟、舒適"
  },
  
  // 情感類
  "愛心": {
    visual: "❤️",
    behavior: "溫柔地飄落下來",
    specialEffect: "接到時畫面充滿愛心",
    emotionalValue: "愛、溫暖"
  },
  "擁抱": {
    visual: "🤗",
    behavior: "會稍微停留一下再落下",
    specialEffect: "接到時有溫暖的光環",
    emotionalValue: "關懷、安全感"
  },
  "笑臉": {
    visual: "😊",
    behavior: "邊轉圈邊掉下來",
    specialEffect: "接到時會有笑聲",
    emotionalValue: "快樂、正能量"
  },
  
  // 奇幻類
  "魔法": {
    visual: "✨",
    behavior: "閃閃發光地飛舞下來",
    specialEffect: "接到時變出彩虹",
    emotionalValue: "神奇、想像力"
  },
  "彩虹": {
    visual: "🌈",
    behavior: "劃出彩虹軌跡",
    specialEffect: "接到時畫面變七彩",
    emotionalValue: "希望、美好"
  },
  "獨角獸": {
    visual: "🦄",
    behavior: "優雅地跳躍式下降",
    specialEffect: "接到時有魔法粉塵",
    emotionalValue: "夢幻、特別"
  }
};

// 🆕 智慧表情符號映射表 - 處理任意輸入
export const EMOJI_MAPPINGS: Record<string, string> = {
  // 動物類
  "恐龍": "🦕", "小狗": "🐶", "貓咪": "🐱", "熊": "🐻", "兔子": "🐰",
  "老虎": "🐯", "獅子": "🦁", "熊貓": "🐼", "小鳥": "🐦", "企鵝": "🐧",
  "魚": "🐟", "鯨魚": "🐋", "海豚": "🐬", "蝴蝶": "🦋", "蜜蜂": "🐝",
  
  // 食物類
  "冰淇淋": "🍦", "蛋糕": "🎂", "餅乾": "🍪", "巧克力": "🍫", "糖果": "🍭",
  "漢堡": "🍔", "披薩": "🍕", "壽司": "🍣", "麵條": "🍜", "飯糰": "🍙",
  "草莓": "🍓", "櫻桃": "🍒", "葡萄": "🍇", "橘子": "🍊", "檸檬": "🍋",
  
  // 交通工具
  "汽車": "🚗", "飛機": "✈️", "火車": "🚂", "船": "⛵", "腳踏車": "🚲",
  "公車": "🚌", "消防車": "🚒", "救護車": "🚑", "警車": "🚓", "計程車": "🚕",
  
  // 玩具類
  "球": "⚽", "娃娃": "🎎", "積木": "🧱", "玩具": "🧸", "風箏": "🪁",
  "氣球": "🎈", "禮物": "🎁", "鑽石": "💎", "寶石": "💍",
  
  // 自然類
  "花": "🌸", "樹": "🌳", "葉子": "🍃", "太陽": "☀️", "雪花": "❄️",
  "雨滴": "💧", "火": "🔥", "石頭": "🪨", "貝殼": "🐚",
  
  // 符號類
  "愛": "💕", "心": "💖", "星": "⭐", "音樂": "🎵", "燈泡": "💡",
  "鑰匙": "🔑", "皇冠": "👑", "魔法棒": "🪄", "閃電": "⚡"
};

// 預定義接取工具
export const PREDEFINED_CATCHERS: Record<string, {
  visual: string;
  size: 'small' | 'medium' | 'large';
  specialAbility: string;
  emotionalValue: string;
}> = {
  "籃子": {
    visual: "🧺",
    size: "medium",
    specialAbility: "穩穩地接住東西",
    emotionalValue: "實用、可靠"
  },
  "手": {
    visual: "🤲",
    size: "medium",
    specialAbility: "可以溫柔地接住",
    emotionalValue: "親密、直接"
  },
  "擁抱": {
    visual: "🤗",
    size: "large",
    specialAbility: "有吸引力，東西會自動靠近",
    emotionalValue: "溫暖、包容"
  },
  "魔法棒": {
    visual: "🪄",
    size: "small",
    specialAbility: "點擊可以瞬間移動",
    emotionalValue: "神奇、有力量"
  },
  "盤子": {
    visual: "🍽️",
    size: "medium",
    specialAbility: "接到食物類會加倍分數",
    emotionalValue: "優雅、精緻"
  },
  "網子": {
    visual: "🥅",
    size: "large",
    specialAbility: "不容易漏接",
    emotionalValue: "安全、保護"
  }
};

// 工具表情符號映射
export const CATCHER_EMOJI_MAPPINGS: Record<string, string> = {
  "盒子": "📦", "袋子": "🎒", "帽子": "🎩", "杯子": "☕", "碗": "🥣",
  "鍋子": "🍳", "桶子": "🪣", "傘": "☂️", "毯子": "🛏️", "袋": "👜"
};

// 顏色效果映射
export const COLOR_EFFECTS: Record<string, {
  effect: string;
  mood: string;
  gameImpact: string;
}> = {
  "彩虹": {
    effect: "物品會不斷變換顏色",
    mood: "歡樂、繽紛",
    gameImpact: "增加視覺趣味"
  },
  "金色": {
    effect: "物品會發出金光",
    mood: "珍貴、特別",
    gameImpact: "接到時加倍得分"
  },
  "透明": {
    effect: "物品若隱若現",
    mood: "神秘、挑戰",
    gameImpact: "增加遊戲難度"
  },
  "閃亮": {
    effect: "物品一閃一閃發光",
    mood: "活潑、吸引注意",
    gameImpact: "更容易看見"
  }
};

// 🆕 智慧映射函數 - 能處理任意輸入
export function smartObjectMapping(input: string): CreativeMapping {
  const cleanInput = input.trim().toLowerCase();
  
  // 1. 先檢查預定義的精心設計物品
  for (const [key, mapping] of Object.entries(PREDEFINED_OBJECTS)) {
    if (cleanInput.includes(key.toLowerCase())) {
      return mapping;
    }
  }
  
  // 2. 檢查智慧表情符號映射
  for (const [keyword, emoji] of Object.entries(EMOJI_MAPPINGS)) {
    if (cleanInput.includes(keyword.toLowerCase())) {
      return createDynamicMapping(keyword, emoji, input);
    }
  }
  
  // 3. 如果都找不到，創建通用映射
  return createGenericMapping(input);
}

// 🆕 動態創建映射
function createDynamicMapping(keyword: string, emoji: string, originalInput: string): CreativeMapping {
  // 根據物品類型推斷行為
  let behavior = "正常掉落下來";
  let specialEffect = `接到時會有${keyword}的特效`;
  let emotionalValue = "孩子的創意想像";
  
  // 動物類 - 添加生動行為
  if (["恐龍", "小狗", "貓咪", "熊", "兔子", "老虎", "獅子", "熊貓", "小鳥", "企鵝"].includes(keyword)) {
    behavior = "活潑地跳跳跳地掉下來";
    specialEffect = `接到時會聽到${keyword}的叫聲`;
    emotionalValue = "可愛、活潑";
  }
  
  // 食物類 - 美味效果
  else if (["冰淇淋", "蛋糕", "餅乾", "巧克力", "糖果"].includes(keyword)) {
    behavior = "誘人地慢慢飄下來";
    specialEffect = `接到時有美味的${keyword}香味`;
    emotionalValue = "甜蜜、幸福";
  }
  
  // 交通工具 - 有趣移動
  else if (["汽車", "飛機", "火車", "船", "腳踏車"].includes(keyword)) {
    behavior = `像真的${keyword}一樣移動著掉下來`;
    specialEffect = `接到時會有${keyword}的音效`;
    emotionalValue = "冒險、速度";
  }
  
  return {
    visual: emoji,
    behavior,
    specialEffect,
    emotionalValue
  };
}

// 🆕 通用映射創建 - 保證任何輸入都有輸出
function createGenericMapping(input: string): CreativeMapping {
  // 使用問號表情符號表示未知但可愛的東西
  const emoji = "❓";
  
  return {
    visual: emoji,
    behavior: `很特別地掉下來（這是寶貝獨特的「${input}」！）`,
    specialEffect: `接到時會有專屬於「${input}」的神秘效果`,
    emotionalValue: "獨特、創意"
  };
}

// 🆕 智慧工具映射
export function smartCatcherMapping(input: string): {
  visual: string;
  size: 'small' | 'medium' | 'large';
  specialAbility: string;
  emotionalValue: string;
} {
  const cleanInput = input.trim().toLowerCase();
  
  // 1. 檢查預定義工具
  for (const [key, mapping] of Object.entries(PREDEFINED_CATCHERS)) {
    if (cleanInput.includes(key.toLowerCase())) {
      return mapping;
    }
  }
  
  // 2. 檢查工具表情符號映射
  for (const [keyword, emoji] of Object.entries(CATCHER_EMOJI_MAPPINGS)) {
    if (cleanInput.includes(keyword.toLowerCase())) {
      return {
        visual: emoji,
        size: "medium",
        specialAbility: `用${keyword}來接住東西`,
        emotionalValue: "孩子的創意選擇"
      };
    }
  }
  
  // 3. 通用工具映射
  return {
    visual: "🤲", // 預設用手
    size: "medium",
    specialAbility: `用創意的方式接住「${input}」`,
    emotionalValue: "獨特想法"
  };
}

// 🆕 整合的智慧解釋函數
export function interpretChildInput(input: string): {
  objectKey?: string;
  catcherKey?: string;
  colorKey?: string;
  speedDescription?: string;
  objectMapping?: CreativeMapping;
  catcherMapping?: any;
} {
  const result: any = {};
  
  // 智慧物品映射 - 現在能處理任意輸入
  result.objectMapping = smartObjectMapping(input);
  result.objectKey = input; // 保留原始輸入作為key
  
  // 檢測工具
  for (const [key, mapping] of Object.entries(PREDEFINED_CATCHERS)) {
    if (input.includes(key)) {
      result.catcherKey = key;
      result.catcherMapping = mapping;
      break;
    }
  }
  
  // 如果沒找到預定義工具，使用智慧映射
  if (!result.catcherKey) {
    result.catcherMapping = smartCatcherMapping(input);
    result.catcherKey = input;
  }
  
  // 檢測顏色
  for (const colorKey of Object.keys(COLOR_EFFECTS)) {
    if (input.includes(colorKey)) {
      result.colorKey = colorKey;
      break;
    }
  }
  
  // 檢測速度描述
  if (input.includes("快") || input.includes("很快")) {
    result.speedDescription = "fast";
  } else if (input.includes("慢") || input.includes("慢慢")) {
    result.speedDescription = "slow";
  }
  
  return result;
}

// 🆕 智慧效果描述生成
export function generateEffectDescription(
  objectType: string,
  catcherType: string,
  color?: string
): string {
  // 使用智慧映射獲取物品資訊
  const objectMapping = smartObjectMapping(objectType);
  const catcherMapping = smartCatcherMapping(catcherType);
  
  let description = `寶貝選擇了用${catcherMapping.visual}來接${objectMapping.visual}！\n`;
  description += `${objectMapping.behavior}，`;
  description += `${objectMapping.specialEffect}。\n`;
  description += `${catcherMapping.visual}有特殊能力：${catcherMapping.specialAbility}！`;
  
  if (color && COLOR_EFFECTS[color]) {
    description += `\n而且是${color}的，${COLOR_EFFECTS[color].effect}！`;
  }
  
  return description;
}

// 保持向後相容性
export const OBJECT_MAPPINGS = PREDEFINED_OBJECTS;
export const CATCHER_MAPPINGS = PREDEFINED_CATCHERS;

// 推薦相關選擇（引導創意）
export function suggestRelatedChoices(currentChoice: string): string[] {
  const suggestions: string[] = [];
  
  // 如果選了星星，推薦其他天空元素
  if (currentChoice === "星星") {
    suggestions.push("月亮", "雲朵", "彩虹");
  }
  
  // 如果選了愛心，推薦其他情感元素
  if (currentChoice === "愛心") {
    suggestions.push("擁抱", "笑臉", "親親");
  }
  
  // 如果選了水果，推薦其他水果
  if (["蘋果", "香蕉", "西瓜"].includes(currentChoice)) {
    suggestions.push("草莓", "葡萄", "橘子");
  }
  
  return suggestions;
}
