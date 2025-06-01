'use client';

import { useState } from 'react';
import { guideCatchGameCreation, generateShareText } from '@/lib/gemini';
import { generateEffectDescription } from '@/lib/game-mappings';

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
}

export function CreationFlow() {
  const [state, setState] = useState<CreationState>({
    currentStep: 'start',
    steps: [],
    guidance: '讓我們開始創作一個有趣的遊戲吧！',
    suggestedQuestions: [
      '寶貝想接什麼東西呢？水果還是星星？',
      '想要接可愛的小動物嗎？',
      '要不要接天上掉下來的愛心？'
    ],
    isLoading: false
  });

  const [parentInput, setParentInput] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);

  // 開始創作流程
  const startCreation = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const guidance = await guideCatchGameCreation('start', []);
      setState(prev => ({
        ...prev,
        guidance: guidance.guidance,
        suggestedQuestions: guidance.suggestedQuestions,
        currentStep: 'object',
        isLoading: false
      }));
    } catch (error) {
      console.error('Failed to start creation:', error);
      setState(prev => ({ ...prev, isLoading: false }));
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
    setState(prev => ({ ...prev, isLoading: true, steps: newSteps }));

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
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Failed to process answer:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }

    setParentInput('');
  };

  // 完成創作流程
  const completeCreation = async (finalSteps: CreationStep[]) => {
    try {
      // 生成遊戲配置
      const objectAnswer = finalSteps.find(s => s.id === 'object')?.answer || '';
      const catcherAnswer = finalSteps.find(s => s.id === 'catcher')?.answer || '';
      const colorAnswer = finalSteps.find(s => s.id === 'color')?.answer;

      const gameEffect = generateEffectDescription(objectAnswer, catcherAnswer, colorAnswer);
      const shareText = await generateShareText(`${objectAnswer}接接樂`, finalSteps);

      setState(prev => ({
        ...prev,
        gameEffect,
        guidance: shareText,
        isLoading: false
      }));
      
      setShowCompletion(true);
    } catch (error) {
      console.error('Failed to complete creation:', error);
      setState(prev => ({ ...prev, isLoading: false }));
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
          
          <button
            onClick={() => {
              // TODO: 導向遊戲頁面
              console.log('Navigate to game');
            }}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            立即遊玩！
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
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
          💡 <span className="ml-2">給爸爸媽媽的提示</span>
        </h3>
        
        {state.isLoading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            <span className="text-gray-600">AI 思考中...</span>
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
