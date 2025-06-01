'use client';

import { useState, useEffect } from 'react';
import { guideCatchGameCreation, generateShareText, getGeminiStatus } from '@/lib/gemini';
import { generateEffectDescription } from '@/lib/game-mappings';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface CreationStep {
  id: string;
  question: string;
  answer?: string;
}

interface CreationState {
  currentStep: string;
  steps: CreationStep[];
  guidance: string;
  suggestedQuestions: string[];
  gameEffect?: string;
  isLoading: boolean;
  isAiGenerated: boolean;
  error?: string;
}

export function CreationFlow() {
  const router = useRouter();
  const [geminiStatus, setGeminiStatus] = useState(getGeminiStatus());
  const [state, setState] = useState<CreationState>({
    currentStep: 'start',
    steps: [],
    guidance: '讓我們開始創作一個有趣的遊戲吧！',
    suggestedQuestions: [
      '寶貝想接什麼東西呢？水果還是星星？',
      '想要接可愛的小動物嗎？',
      '要不要接天上掉下來的愛心？'
    ],
    isLoading: false,
    isAiGenerated: false
  });

  const [parentInput, setParentInput] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [gameData, setGameData] = useState<any>(null);

  // 檢查 Gemini 狀態
  useEffect(() => {
    setGeminiStatus(getGeminiStatus());
  }, []);

  // 清除錯誤
  const clearError = () => {
    setState(prev => ({ ...prev, error: undefined }));
  };

  // 開始創作流程
  const startCreation = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: undefined }));
    
    try {
      const guidance = await guideCatchGameCreation('start', []);
      setState(prev => ({
        ...prev,
        guidance: guidance.guidance,
        suggestedQuestions: guidance.suggestedQuestions,
        currentStep: 'object',
        isLoading: false,
        isAiGenerated: guidance.isAiGenerated
      }));
    } catch (error) {
      console.error('Failed to start creation:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: '啟動創作流程失敗，請重試'
      }));
    }
  };

  // 處理家長輸入孩子的回答
  const handleChildAnswer = async () => {
    if (!parentInput.trim()) return;

    const newStep: CreationStep = {
      id: state.currentStep,
      question: state.suggestedQuestions[0] || '孩子的想法',
      answer: parentInput
    };

    const newSteps = [...state.steps, newStep];
    setState(prev => ({ ...prev, isLoading: true, steps: newSteps, error: undefined }));

    try {
      const guidance = await guideCatchGameCreation(
        state.currentStep,
        newSteps,
        parentInput
      );

      if (guidance.nextStep === 'complete' || newSteps.length >= 4) {
        // 創作完成
        await completeCreation(newSteps);
      } else {
        setState(prev => ({
          ...prev,
          currentStep: guidance.nextStep || getNextStep(state.currentStep),
          guidance: guidance.guidance,
          suggestedQuestions: guidance.suggestedQuestions,
          gameEffect: guidance.gameEffect,
          isLoading: false,
          isAiGenerated: guidance.isAiGenerated
        }));
      }
    } catch (error) {
      console.error('Failed to process answer:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: '處理回答失敗，請重試'
      }));
    }

    setParentInput('');
  };

  // 完成創作流程
  const completeCreation = async (finalSteps: CreationStep[]) => {
    try {
      console.log('🎮 開始完成創作流程...');
      
      // 生成基本遊戲配置
      const objectAnswer = finalSteps.find(s => s.id === 'object')?.answer || '';
      const catcherAnswer = finalSteps.find(s => s.id === 'catcher')?.answer || '';
      const colorAnswer = finalSteps.find(s => s.id === 'color')?.answer;

      const gameEffect = generateEffectDescription(objectAnswer, catcherAnswer, colorAnswer);
      
      console.log('🎨 生成遊戲效果:', gameEffect);

      // 檢查用戶是否已登入
      const currentUser = auth.currentUser;
      console.log('👤 當前用戶:', currentUser?.uid || '未登入');

      if (!currentUser) {
        // 如果沒登入，創建臨時遊戲配置
        console.log('📝 創建臨時遊戲配置...');
        const shareText = `我家寶貝創作了「${objectAnswer}接接樂」！充滿創意的遊戲，快來一起玩吧！🎮✨`;
        
        const tempGameData = {
          gameConfig: {
            objectType: objectAnswer,
            catcherType: catcherAnswer,
            objectColor: colorAnswer,
            difficulty: 'medium',
            gameTitle: `${objectAnswer}接接樂`
          },
          creationSteps: finalSteps,
          gameEffect,
          shareText,
          isTemporary: true
        };
        
        setState(prev => ({
          ...prev,
          gameEffect,
          guidance: shareText,
          isLoading: false
        }));
        
        setGameData(tempGameData);
        setShowCompletion(true);
        return;
      }

      // 用戶已登入，調用 API 創建遊戲
      console.log('🌐 調用 API 創建遊戲...');
      
      const requestBody = {
        userId: currentUser.uid,
        creationSteps: finalSteps,
        gameTitle: `${objectAnswer}接接樂`
      };
      
      console.log('📤 API 請求內容:', requestBody);
      
      const response = await fetch('/api/games/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 API 回應狀態:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ API 錯誤回應:', errorData);
        throw new Error(`API 錯誤 (${response.status}): ${errorData}`);
      }

      const apiGameData = await response.json();
      console.log('✅ API 成功回應:', apiGameData);

      // 生成或使用 API 返回的分享文案
      let shareText = apiGameData.shareText;
      if (!shareText) {
        try {
          shareText = await generateShareText(`${objectAnswer}接接樂`, finalSteps);
        } catch (error) {
          console.warn('⚠️ 生成分享文案失敗:', error);
          shareText = `我家寶貝創作了「${objectAnswer}接接樂」！充滿創意的遊戲，快來一起玩吧！🎮✨`;
        }
      }
      
      setState(prev => ({
        ...prev,
        gameEffect,
        guidance: shareText,
        isLoading: false
      }));
      
      setGameData(apiGameData);
      setShowCompletion(true);
      
    } catch (error) {
      console.error('💥 完成創作失敗:', error);
      
      // 即使 API 調用失敗，也創建臨時遊戲配置
      const objectAnswer = finalSteps.find(s => s.id === 'object')?.answer || '';
      const catcherAnswer = finalSteps.find(s => s.id === 'catcher')?.answer || '';
      const colorAnswer = finalSteps.find(s => s.id === 'color')?.answer;
      
      const gameEffect = generateEffectDescription(objectAnswer, catcherAnswer, colorAnswer);
      const shareText = '遊戲創作完成！雖然保存時遇到問題，但您可以在此預覽遊戲效果。';
      
      const tempGameData = {
        gameConfig: {
          objectType: objectAnswer,
          catcherType: catcherAnswer,
          objectColor: colorAnswer,
          difficulty: 'medium',
          gameTitle: `${objectAnswer}接接樂`
        },
        creationSteps: finalSteps,
        gameEffect,
        shareText,
        isTemporary: true,
        error: error instanceof Error ? error.message : '未知錯誤'
      };
      
      setState(prev => ({
        ...prev,
        gameEffect,
        guidance: shareText,
        isLoading: false,
        error: '遊戲已創建但無法保存，您仍可以預覽遊戲'
      }));
      
      setGameData(tempGameData);
      setShowCompletion(true);
    }
  };

  // 導向遊戲頁面或顯示遊戲預覽
  const goToGame = () => {
    if (gameData) {
      if (gameData.gameId && !gameData.gameId.startsWith('temp_')) {
        // 有真實的遊戲 ID，導向遊戲頁面
        router.push(`/play/${gameData.gameId}`);
      } else {
        // 創建臨時遊戲頁面
        const gameConfigEncoded = encodeURIComponent(JSON.stringify(gameData.gameConfig));
        router.push(`/play/preview?config=${gameConfigEncoded}`);
      }
    }
  };

  const getNextStep = (current: string): string => {
    const steps = ['start', 'object', 'catcher', 'color', 'speed'];
    const currentIndex = steps.indexOf(current);
    return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : 'complete';
  };

  const getStepTitle = (step: string): string => {
    const titles: Record<string, string> = {
      'start': '開始創作',
      'object': '選擇要接的東西',
      'catcher': '選擇接取工具',
      'color': '選擇顏色',
      'speed': '選擇難度',
      'complete': '完成創作'
    };
    return titles[step] || step;
  };

  if (showCompletion) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-green-50 p-8 rounded-lg mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green-800 mb-4">創作完成！</h2>
          
          {/* 錯誤警告（如果有的話） */}
          {state.error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <span className="text-yellow-600 mr-2">⚠️</span>
                <p className="text-yellow-800 text-sm">{state.error}</p>
              </div>
            </div>
          )}
          
          {state.gameEffect && (
            <div className="bg-white p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">遊戲效果預覽：</h3>
              <p className="text-gray-700 whitespace-pre-line">{state.gameEffect}</p>
            </div>
          )}
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">分享文案：</h3>
            <p className="text-blue-800">{state.guidance}</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={goToGame}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
            >
              🎮 立即遊玩！
            </button>
            
            <button
              onClick={() => {
                setShowCompletion(false);
                setState({
                  currentStep: 'start',
                  steps: [],
                  guidance: '讓我們開始創作一個有趣的遊戲吧！',
                  suggestedQuestions: [
                    '寶貝想接什麼東西呢？水果還是星星？',
                    '想要接可愛的小動物嗎？',
                    '要不要接天上掉下來的愛心？'
                  ],
                  isLoading: false,
                  isAiGenerated: false
                });
                setParentInput('');
                setGameData(null);
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              創作新遊戲
            </button>
          </div>

          {gameData?.isTemporary && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-yellow-700 text-sm">
                💡 提示：登入後可以永久保存您的遊戲作品！
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* 錯誤警告 */}
      {state.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-red-600 mr-2">❌</span>
              <p className="text-red-800">{state.error}</p>
            </div>
            <button 
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* AI 狀態指示器 */}
      {!geminiStatus.isConfigured && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-amber-600">⚠️</span>
            <div className="flex-1">
              <h3 className="font-medium text-amber-800">AI 引導功能未啟用</h3>
              <p className="text-sm text-amber-700 mt-1">
                目前使用預設引導。要啟用 AI 個性化引導，請設定 Gemini API 金鑰。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 進度指示器 */}
      <div className="flex justify-between mb-8">
        {['開始', '物品', '工具', '顏色', '完成'].map((label, index) => {
          const stepNumber = index + 1;
          const isActive = index <= state.steps.length;
          const isCurrent = index === state.steps.length;
          
          return (
            <div key={label} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium
                  ${isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                  ${isCurrent ? 'ring-4 ring-blue-200' : ''}
                `}
              >
                {stepNumber}
              </div>
              <span className="text-xs mt-1 text-gray-600">{label}</span>
            </div>
          );
        })}
      </div>

      {/* 當前步驟標題 */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {getStepTitle(state.currentStep)}
        </h2>
      </div>

      {/* AI 引導區域（只有家長看得到） */}
      <div className="bg-blue-50 p-6 rounded-lg mb-6">
        <h3 className="font-bold text-lg mb-2 flex items-center">
          {state.isAiGenerated ? '🤖' : '💡'} 
          <span className="ml-2">
            {state.isAiGenerated ? 'AI 智慧引導' : '給爸爸媽媽的提示'}
          </span>
          {state.isAiGenerated && (
            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              AI 生成
            </span>
          )}
        </h3>
        
        {state.isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-gray-600">
              {geminiStatus.isConfigured ? 'AI 思考中...' : '處理中...'}
            </span>
          </div>
        ) : (
          <>
            <p className="text-gray-700 mb-4">{state.guidance}</p>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">您可以這樣問孩子：</p>
              {state.suggestedQuestions.map((question, index) => (
                <div key={index} className="bg-white p-3 rounded border-l-4 border-blue-300">
                  <span className="text-blue-700">"{question}"</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 遊戲效果預覽 */}
      {state.gameEffect && (
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium text-green-800 mb-2">🎮 遊戲效果預覽</h4>
          <p className="text-green-700 text-sm whitespace-pre-line">{state.gameEffect}</p>
        </div>
      )}

      {/* 家長輸入區 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          孩子的回答是什麼呢？
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={parentInput}
            onChange={(e) => setParentInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleChildAnswer()}
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="輸入孩子的回答..."
            disabled={state.isLoading}
          />
          <button
            onClick={handleChildAnswer}
            disabled={!parentInput.trim() || state.isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {state.isLoading ? '處理中...' : '下一步'}
          </button>
        </div>
      </div>

      {/* 顯示創作歷程 */}
      {state.steps.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3 text-gray-800 flex items-center">
            📝 <span className="ml-2">創作記錄</span>
          </h4>
          <div className="space-y-2">
            {state.steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-3 p-3 bg-white rounded">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">{step.question}</div>
                  <div className="font-medium text-gray-800">{step.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 開始按鈕（只在初始狀態顯示） */}
      {state.currentStep === 'start' && state.steps.length === 0 && (
        <div className="text-center mt-6">
          <button
            onClick={startCreation}
            disabled={state.isLoading}
            className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors text-lg font-medium"
          >
            {state.isLoading ? '準備中...' : '開始創作遊戲！'}
          </button>
        </div>
      )}
    </div>
  );
}
