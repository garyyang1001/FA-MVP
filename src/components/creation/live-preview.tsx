'use client';

import React, { useEffect, useState } from 'react';
import { OBJECT_MAPPINGS, CATCHER_MAPPINGS, COLOR_EFFECTS } from '@/lib/game-mappings';

interface LivePreviewProps {
  currentChoices: {
    object?: string;
    catcher?: string;
    color?: string;
    speed?: string;
  };
}

export function LivePreview({ currentChoices }: LivePreviewProps) {
  const [animationKey, setAnimationKey] = useState(0);

  // 當選擇改變時重新觸發動畫
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [currentChoices]);

  const objectMapping = currentChoices.object ? OBJECT_MAPPINGS[currentChoices.object] : null;
  const catcherMapping = currentChoices.catcher ? CATCHER_MAPPINGS[currentChoices.catcher] : null;
  const colorEffect = currentChoices.color ? COLOR_EFFECTS[currentChoices.color] : null;

  return (
    <div className="bg-gradient-to-b from-sky-200 to-sky-300 rounded-lg p-6 h-64 relative overflow-hidden">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">遊戲預覽</h3>
      
      {/* 掉落物預覽 */}
      {objectMapping && (
        <div
          key={`object-${animationKey}`}
          className="absolute left-1/2 -translate-x-1/2 text-4xl animate-fall"
          style={{
            top: '-50px',
            animation: `fall ${currentChoices.speed === 'fast' ? '2s' : currentChoices.speed === 'slow' ? '4s' : '3s'} ease-in forwards`
          }}
        >
          <span className={colorEffect?.effect.includes('變換') ? 'animate-rainbow' : ''}>
            {objectMapping.visual}
          </span>
          {colorEffect?.effect.includes('發光') && (
            <div className="absolute inset-0 w-12 h-12 bg-yellow-300 rounded-full blur-xl opacity-50 -z-10" />
          )}
        </div>
      )}

      {/* 接取工具預覽 */}
      {catcherMapping && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-4xl">
          {catcherMapping.visual}
          {catcherMapping.specialAbility.includes('吸引') && (
            <div className="absolute inset-0 w-16 h-16 border-2 border-purple-400 rounded-full animate-pulse -z-10" />
          )}
        </div>
      )}

      {/* 效果描述 */}
      <div className="absolute bottom-20 left-0 right-0 px-4">
        {objectMapping && (
          <p className="text-sm text-gray-700 text-center mb-1">
            {objectMapping.behavior}
          </p>
        )}
        {catcherMapping && (
          <p className="text-sm text-gray-600 text-center">
            {catcherMapping.visual} {catcherMapping.specialAbility}
          </p>
        )}
      </div>

      {/* 特殊效果預覽 */}
      {objectMapping?.specialEffect && (
        <div className="absolute top-4 right-4 bg-yellow-100 px-3 py-1 rounded-full">
          <span className="text-xs">✨ {objectMapping.specialEffect}</span>
        </div>
      )}

      <style jsx>{`
        @keyframes fall {
          to {
            top: 200px;
          }
        }
        
        @keyframes rainbow {
          0% { color: red; }
          16.66% { color: orange; }
          33.33% { color: yellow; }
          50% { color: green; }
          66.66% { color: blue; }
          83.33% { color: indigo; }
          100% { color: violet; }
        }
        
        .animate-rainbow {
          animation: rainbow 2s linear infinite;
        }
      `}</style>
    </div>
  );
}

interface EffectDescriptionProps {
  objectType?: string;
  catcherType?: string;
  color?: string;
}

export function EffectDescription({ objectType, catcherType, color }: EffectDescriptionProps) {
  if (!objectType && !catcherType) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          開始選擇遊戲元素，這裡會顯示特殊效果說明！
        </p>
      </div>
    );
  }

  const object = objectType ? OBJECT_MAPPINGS[objectType] : null;
  const catcher = catcherType ? CATCHER_MAPPINGS[catcherType] : null;
  const colorEffect = color ? COLOR_EFFECTS[color] : null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 space-y-3">
      <h4 className="font-semibold text-purple-900">遊戲效果預覽 ✨</h4>
      
      {object && (
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-medium">掉落物：</span>
            <span className="text-2xl mx-2">{object.visual}</span>
            {object.behavior}
          </p>
          <p className="text-sm text-purple-700">
            <span className="font-medium">特殊效果：</span> {object.specialEffect}
          </p>
          <p className="text-xs text-gray-600">
            <span className="font-medium">情感價值：</span> {object.emotionalValue}
          </p>
        </div>
      )}

      {catcher && (
        <div className="space-y-1 pt-2 border-t border-purple-100">
          <p className="text-sm">
            <span className="font-medium">接取工具：</span>
            <span className="text-2xl mx-2">{catcher.visual}</span>
            {catcher.specialAbility}
          </p>
          <p className="text-xs text-gray-600">
            <span className="font-medium">情感價值：</span> {catcher.emotionalValue}
          </p>
        </div>
      )}

      {colorEffect && (
        <div className="pt-2 border-t border-purple-100">
          <p className="text-sm">
            <span className="font-medium">顏色效果：</span> {colorEffect.effect}
          </p>
          <p className="text-xs text-gray-600">
            <span className="font-medium">氛圍：</span> {colorEffect.mood}
          </p>
        </div>
      )}

      {object && catcher && (
        <div className="mt-4 p-3 bg-white rounded-lg border border-purple-100">
          <p className="text-sm font-medium text-purple-900 mb-1">組合效果：</p>
          <p className="text-sm text-gray-700">
            用{catcher.visual}來接{object.visual}會創造出
            {colorEffect ? `${colorEffect.mood}的` : ''}
            {object.emotionalValue}與{catcher.emotionalValue}相結合的獨特體驗！
          </p>
        </div>
      )}
    </div>
  );
}
