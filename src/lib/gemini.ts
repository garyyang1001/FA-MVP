import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  OBJECT_MAPPINGS, 
  CATCHER_MAPPINGS, 
  COLOR_EFFECTS,
  interpretChildInput,
  generateEffectDescription
} from "./game-mappings";

// 檢查 API key 配置
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY && typeof window !== 'undefined') {
  console.warn("Gemini API key is not configured");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface GameCreationPrompt {
  voiceInput: string;
  ageGroup: string;
  language?: string;
}

export interface GameData {
  title: string;
  description: string;
  template: string;
  ageGroup: string;
  educationalGoals: string[];
  gameConfig: any;
}

// 對話步驟定義
export interface CreationStep {
  id: string;
  question: string;
  answer?: string;
}

// 增強的 AI 提示詞 - 專注於理解創意和描述效果
const CATCH_GAME_PROMPT = `
你是一個親子遊戲創作助手，專門幫助家長引導孩子創作「接東西」遊戲。

重要原則：
1. 你只需要理解孩子的想法，不需要了解遊戲技術細節
2. 專注於描述遊戲效果會多麼有趣
3. 用溫暖、充滿想像力的語言回應
4. 每個選擇都會產生獨特的視覺效果

可選擇的物品（每個都有特殊效果）：
${Object.entries(OBJECT_MAPPINGS).map(([key, value]) => 
  `- ${key}${value.visual}：${value.behavior}，${value.specialEffect}`
).join('\n')}

可選擇的接取工具：
${Object.entries(CATCHER_MAPPINGS).map(([key, value]) => 
  `- ${key}${value.visual}：${value.specialAbility}`
).join('\n')}

特殊顏色效果：
${Object.entries(COLOR_EFFECTS).map(([key, value]) => 
  `- ${key}：${value.effect}`
).join('\n')}

回應格式：
1. 理解孩子的選擇
2. 生動地描述這會創造出什麼效果
3. 給家長一個引導下一步的建議
`;

export async function createGameFromVoice(
  prompt: GameCreationPrompt
): Promise<GameData> {
  // 檢查 API 可用性
  if (!genAI) {
    throw new Error("Gemini AI is not configured");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const systemPrompt = `
    You are an AI assistant that helps parents create educational games for children.
    Based on the voice input, create a game configuration.
    
    Voice Input: "${prompt.voiceInput}"
    Age Group: ${prompt.ageGroup}
    Language: ${prompt.language || "zh-TW"}
    
    Respond with a JSON object containing:
    - title: Game title
    - description: Brief description
    - template: One of ["matching", "sorting", "story", "puzzle", "catch"]
    - ageGroup: Age range
    - educationalGoals: Array of learning objectives
    - gameConfig: Specific configuration for the chosen template
    
    For catch games, gameConfig should include:
    - objectType: The type of object to catch
    - catcherType: The tool to catch with
    - difficulty: Game difficulty settings
    
    Make it educational, fun, and age-appropriate.
  `;

  try {
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error("Failed to parse game data");
  } catch (error) {
    console.error("Error creating game:", error);
    throw error;
  }
}

// 新增：專門用於接水果遊戲的創作流程
export async function guideCatchGameCreation(
  currentStep: string,
  previousAnswers: CreationStep[],
  childAnswer?: string
): Promise<{
  guidance: string;
  suggestedQuestions: string[];
  gameEffect?: string;
  nextStep?: string;
}> {
  if (!genAI) {
    // 如果沒有 API Key，返回預設引導
    return getDefaultGuidance(currentStep, childAnswer);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  // 根據當前步驟生成引導
  let prompt = CATCH_GAME_PROMPT + "\n\n";
  
  if (childAnswer) {
    // 解析孩子的回答
    const interpretation = interpretChildInput(childAnswer);
    
    prompt += `
    孩子剛才說："${childAnswer}"
    
    我的理解：${JSON.stringify(interpretation, null, 2)}
    
    請給出：
    1. 對這個選擇的熱情回應（讚美孩子的創意）
    2. 生動描述這會產生什麼遊戲效果
    3. 給家長的下一步引導建議
    `;
  } else {
    // 初始引導
    prompt += `
    這是創作的第一步。
    請提供：
    1. 溫暖的開場引導
    2. 3個建議的問題讓家長問孩子
    3. 解釋為什麼這個步驟重要
    `;
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // 簡單解析回應
    return {
      guidance: text,
      suggestedQuestions: [
        "寶貝想接什麼東西呢？水果還是星星？",
        "要用什麼來接呢？籃子還是魔法棒？",
        "想要什麼顏色的呢？"
      ],
      gameEffect: childAnswer ? generateEffectDescription(
        previousAnswers.find(a => a.id === 'object')?.answer || '',
        previousAnswers.find(a => a.id === 'catcher')?.answer || '',
        previousAnswers.find(a => a.id === 'color')?.answer
      ) : undefined,
      nextStep: determineNextStep(currentStep)
    };
  } catch (error) {
    console.error("Error in game guidance:", error);
    return getDefaultGuidance(currentStep, childAnswer);
  }
}

// 預設引導（當 API 不可用時）
function getDefaultGuidance(currentStep: string, childAnswer?: string): any {
  const guides: Record<string, any> = {
    'start': {
      guidance: '讓我們一起創作一個有趣的接東西遊戲吧！首先，問問孩子想接什麼東西呢？',
      suggestedQuestions: [
        '寶貝想接什麼水果呢？',
        '想要接可愛的小動物嗎？',
        '要不要接天上掉下來的星星？'
      ],
      nextStep: 'object'
    },
    'object': {
      guidance: '很棒的選擇！現在問問孩子想用什麼來接住這些東西呢？',
      suggestedQuestions: [
        '我們用什麼來接呢？',
        '要用籃子還是盤子接呢？',
        '小手手可以接住嗎？'
      ],
      nextStep: 'catcher'
    },
    'catcher': {
      guidance: '太有創意了！讓孩子選擇喜歡的顏色吧！',
      suggestedQuestions: [
        '你喜歡什麼顏色呢？',
        '要不要有彩虹色？',
        '想要閃閃發光的嗎？'
      ],
      nextStep: 'color'
    },
    'color': {
      guidance: '最後，問問孩子想要遊戲的速度如何？',
      suggestedQuestions: [
        '東西要掉得快快的還是慢慢的？',
        '要很多一起掉下來嗎？',
        '想要簡單一點還是有挑戰一點？'
      ],
      nextStep: 'complete'
    }
  };
  
  return guides[currentStep] || guides['start'];
}

function determineNextStep(currentStep: string): string {
  const steps = ['start', 'object', 'catcher', 'color', 'speed', 'complete'];
  const currentIndex = steps.indexOf(currentStep);
  return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : 'complete';
}

export async function generateGameAssets(gameData: GameData) {
  // 檢查 API 可用性
  if (!genAI) {
    return "遊戲素材生成中...";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `
    Generate creative content for this educational game:
    Title: ${gameData.title}
    Template: ${gameData.template}
    Age Group: ${gameData.ageGroup}
    
    Provide additional content like:
    - Character names and descriptions
    - Story elements
    - Fun facts
    - Encouraging messages
    
    Make it engaging and educational for children.
  `;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating assets:", error);
    return "遊戲素材生成中...";
  }
}

// 新增：生成遊戲分享文案
export async function generateShareText(
  gameTitle: string,
  creationSteps: CreationStep[]
): Promise<string> {
  if (!genAI) {
    // 如果 API 不可用，返回預設文案
    return `我家寶貝創作了「${gameTitle}」！一起來玩吧！🎮`;
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `
    根據以下親子創作過程，生成一段溫馨的分享文案（50-80字）：
    遊戲名稱：${gameTitle}
    創作過程：${creationSteps.map(s => `${s.question} - ${s.answer}`).join('\n')}
    
    要求：
    1. 突出孩子的可愛創意
    2. 表達創作的樂趣
    3. 邀請其他人也來嘗試
    4. 加入2-3個相關表情符號
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating share text:", error);
    return `我家寶貝創作了「${gameTitle}」！一起來玩吧！🎮`;
  }
}
