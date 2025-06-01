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
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// 使用最新的 Gemini 2.5 Flash 模型
const MODEL_NAME = "gemini-2.5-flash-preview-04-17";

// API 狀態檢查
export const getGeminiStatus = () => {
  const hasApiKey = !!API_KEY;
  const isConfigured = hasApiKey && API_KEY !== 'your_gemini_api_key_here';
  
  return {
    hasApiKey,
    isConfigured,
    status: isConfigured ? 'ready' : hasApiKey ? 'invalid-key' : 'no-key'
  };
};

console.log('🤖 Gemini AI 狀態:', getGeminiStatus());

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
5. 回應要簡潔，大約50-100字

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

請用繁體中文回應，語氣要溫暖有趣。
`;

export async function createGameFromVoice(
  prompt: GameCreationPrompt
): Promise<GameData> {
  const status = getGeminiStatus();
  
  if (!status.isConfigured) {
    throw new Error(`Gemini AI 未正確配置 (狀態: ${status.status})`);
  }

  const model = genAI!.getGenerativeModel({ model: MODEL_NAME });

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
  isAiGenerated: boolean;
}> {
  const status = getGeminiStatus();
  
  // 如果 API 沒有正確配置，使用預設引導
  if (!status.isConfigured) {
    console.warn(`🤖 Gemini AI 未配置，使用預設引導 (狀態: ${status.status})`);
    const defaultResult = getDefaultGuidance(currentStep, childAnswer);
    return { ...defaultResult, isAiGenerated: false };
  }

  const model = genAI!.getGenerativeModel({ model: MODEL_NAME });
  
  try {
    // 根據當前步驟生成引導
    let prompt = CATCH_GAME_PROMPT + "\n\n";
    
    if (childAnswer) {
      // 解析孩子的回答
      const interpretation = interpretChildInput(childAnswer);
      
      prompt += `
      孩子剛才說："${childAnswer}"
      
      我的理解：${JSON.stringify(interpretation, null, 2)}
      
      請給出一段溫暖的回應（50-100字），包含：
      1. 對孩子選擇的讚美
      2. 生動描述這會產生什麼遊戲效果
      3. 對家長的下一步建議
      
      請直接回應，不要使用JSON格式。
      `;
    } else {
      // 初始引導
      prompt += `
      這是創作的第一步：選擇要接的物品。
      
      請給家長一段溫暖的引導（50-100字），包含：
      1. 鼓勵的開場
      2. 解釋這個步驟的重要性
      3. 如何引導孩子表達想法
      
      請直接回應，不要使用JSON格式。
      `;
    }

    console.log('🤖 調用 Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('🤖 Gemini AI 回應:', text.substring(0, 100) + '...');
    
    // 生成建議問題（基於步驟）
    const suggestedQuestions = getSuggestedQuestions(currentStep);
    
    return {
      guidance: text.trim(),
      suggestedQuestions,
      gameEffect: childAnswer ? generateEffectDescription(
        previousAnswers.find(a => a.id === 'object')?.answer || '',
        previousAnswers.find(a => a.id === 'catcher')?.answer || '',
        previousAnswers.find(a => a.id === 'color')?.answer
      ) : undefined,
      nextStep: determineNextStep(currentStep),
      isAiGenerated: true
    };
  } catch (error) {
    console.error("🤖 Gemini AI 調用失敗:", error);
    console.warn("回退到預設引導");
    const defaultResult = getDefaultGuidance(currentStep, childAnswer);
    return { ...defaultResult, isAiGenerated: false };
  }
}

// 根據步驟生成建議問題
function getSuggestedQuestions(currentStep: string): string[] {
  const questions: Record<string, string[]> = {
    'start': [
      '寶貝想接什麼水果呢？',
      '想要接可愛的小動物嗎？',
      '要不要接天上掉下來的星星？'
    ],
    'object': [
      '我們用什麼來接呢？',
      '要用籃子還是小手手接？',
      '想要用什麼特別的工具嗎？'
    ],
    'catcher': [
      '你喜歡什麼顏色呢？',
      '要不要有彩虹的顏色？',
      '想要閃閃發光的嗎？'
    ],
    'color': [
      '東西要掉得快快的還是慢慢的？',
      '要很多一起掉下來嗎？',
      '想要簡單一點還是有挑戰一點？'
    ]
  };
  
  return questions[currentStep] || questions['start'];
}

// 預設引導（當 API 不可用時）
function getDefaultGuidance(currentStep: string, childAnswer?: string): any {
  const guides: Record<string, any> = {
    'start': {
      guidance: '讓我們一起創作一個有趣的接東西遊戲吧！首先，問問孩子想接什麼東西呢？每個選擇都會創造出不同的遊戲效果喔！',
      suggestedQuestions: getSuggestedQuestions('start'),
      nextStep: 'object'
    },
    'object': {
      guidance: childAnswer ? 
        `哇！孩子選擇了「${childAnswer}」，真是很棒的想法！現在讓我們選擇用什麼工具來接這些寶貝吧！` :
        '很棒的選擇！現在問問孩子想用什麼來接住這些東西呢？',
      suggestedQuestions: getSuggestedQuestions('object'),
      nextStep: 'catcher'
    },
    'catcher': {
      guidance: childAnswer ? 
        `太有創意了！用「${childAnswer}」來接東西一定很有趣！現在讓孩子選擇喜歡的顏色，讓遊戲更加繽紛！` :
        '太有創意了！讓孩子選擇喜歡的顏色吧！',
      suggestedQuestions: getSuggestedQuestions('catcher'),
      nextStep: 'color'
    },
    'color': {
      guidance: childAnswer ? 
        `「${childAnswer}」的顏色會讓遊戲變得很特別！最後，問問孩子想要什麼樣的遊戲速度呢？` :
        '最後，問問孩子想要遊戲的速度如何？',
      suggestedQuestions: getSuggestedQuestions('color'),
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
  const status = getGeminiStatus();
  
  if (!status.isConfigured) {
    return "遊戲素材生成中...";
  }

  const model = genAI!.getGenerativeModel({ model: MODEL_NAME });
  
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
  const status = getGeminiStatus();
  
  if (!status.isConfigured) {
    // 如果 API 不可用，返回基於創作內容的預設文案
    const objectAnswer = creationSteps.find(s => s.id === 'object')?.answer || '東西';
    const catcherAnswer = creationSteps.find(s => s.id === 'catcher')?.answer || '工具';
    return `我家寶貝創作了「${gameTitle}」！用${catcherAnswer}接${objectAnswer}的遊戲，充滿了孩子的創意和想像力！快來一起玩吧！🎮✨`;
  }

  const model = genAI!.getGenerativeModel({ model: MODEL_NAME });
  
  const prompt = `
    根據以下親子創作過程，生成一段溫馨的分享文案（50-80字）：
    遊戲名稱：${gameTitle}
    創作過程：${creationSteps.map(s => `${s.question} - ${s.answer}`).join('\n')}
    
    要求：
    1. 突出孩子的可愛創意
    2. 表達創作的樂趣
    3. 邀請其他人也來嘗試
    4. 加入2-3個相關表情符號
    5. 用繁體中文
    
    請直接回應文案，不要額外說明。
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating share text:", error);
    const objectAnswer = creationSteps.find(s => s.id === 'object')?.answer || '東西';
    return `我家寶貝創作了「${gameTitle}」！用創意接${objectAnswer}的遊戲，快來一起玩吧！🎮`;
  }
}