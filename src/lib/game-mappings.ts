/**
 * 創意映射系統
 * 將孩子的創意想法映射到具體的遊戲效果
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

// 物品類型映射
export const OBJECT_MAPPINGS: Record<string, CreativeMapping> = {
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

// 接取工具映射
export const CATCHER_MAPPINGS: Record<string, {
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

// 根據孩子的描述推斷遊戲配置
export function interpretChildInput(input: string): {
  objectKey?: string;
  catcherKey?: string;
  colorKey?: string;
  speedDescription?: string;
} {
  const result: any = {};
  
  // 檢測物品類型
  for (const [key, mapping] of Object.entries(OBJECT_MAPPINGS)) {
    if (input.includes(key) || input.includes(mapping.visual)) {
      result.objectKey = key;
      break;
    }
  }
  
  // 檢測接取工具
  for (const [key, mapping] of Object.entries(CATCHER_MAPPINGS)) {
    if (input.includes(key) || input.includes(mapping.visual)) {
      result.catcherKey = key;
      break;
    }
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

// 生成遊戲效果描述（給家長看的）
export function generateEffectDescription(
  objectType: string,
  catcherType: string,
  color?: string
): string {
  const object = OBJECT_MAPPINGS[objectType];
  const catcher = CATCHER_MAPPINGS[catcherType];
  
  if (!object || !catcher) {
    return "創造一個有趣的接物遊戲！";
  }
  
  let description = `寶貝選擇了用${catcher.visual}來接${object.visual}！\n`;
  description += `${object.behavior}，`;
  description += `${object.specialEffect}。\n`;
  description += `${catcher.visual}有特殊能力：${catcher.specialAbility}！`;
  
  if (color && COLOR_EFFECTS[color]) {
    description += `\n而且是${color}的，${COLOR_EFFECTS[color].effect}！`;
  }
  
  return description;
}

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
