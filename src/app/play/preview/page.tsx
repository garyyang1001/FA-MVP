'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface GameConfig {
  objectType: string;
  catcherType: string;
  objectColor?: string;
  difficulty: string;
  gameTitle: string;
}

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const configParam = searchParams.get('config');
    
    if (!configParam) {
      setError('缺少遊戲配置參數');
      setLoading(false);
      return;
    }

    try {
      const decodedConfig = decodeURIComponent(configParam);
      const config: GameConfig = JSON.parse(decodedConfig);
      setGameConfig(config);
    } catch (err) {
      console.error('解析遊戲配置失敗:', err);
      setError('遊戲配置格式錯誤');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">載入遊戲中...</p>
        </div>
      </div>
    );
  }

  if (error || !gameConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">無法載入遊戲</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/create"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重新創作遊戲
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <Link 
            href="/create"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 text-lg"
          >
            ← 返回創作
          </Link>
          
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="text-6xl mb-4">🎮</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {gameConfig.gameTitle}
            </h1>
            <p className="text-gray-600">遊戲預覽模式</p>
          </div>
        </div>

        {/* 遊戲配置展示 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              📋 <span className="ml-2">遊戲設定</span>
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">要接的東西：</span>
                <span className="font-medium">{gameConfig.objectType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">使用工具：</span>
                <span className="font-medium">{gameConfig.catcherType}</span>
              </div>
              {gameConfig.objectColor && (
                <div className="flex justify-between">
                  <span className="text-gray-600">顏色：</span>
                  <span className="font-medium">{gameConfig.objectColor}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">難度：</span>
                <span className="font-medium">
                  {gameConfig.difficulty === 'easy' ? '簡單' : 
                   gameConfig.difficulty === 'hard' ? '困難' : '中等'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              ✨ <span className="ml-2">預覽提示</span>
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                💡 這是遊戲預覽模式。完整的遊戲功能正在開發中，
                目前您可以看到根據孩子的創意生成的遊戲設定。
              </p>
            </div>
          </div>
        </div>

        {/* 簡化遊戲預覽 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            🎯 <span className="ml-2">遊戲概念預覽</span>
          </h2>
          
          <div className="bg-gradient-to-b from-sky-200 to-green-200 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">
              {gameConfig.objectType.includes('水果') || gameConfig.objectType.includes('蘋果') ? '🍎' :
               gameConfig.objectType.includes('星') ? '⭐' :
               gameConfig.objectType.includes('心') ? '💝' :
               gameConfig.objectType.includes('動物') ? '🐱' : '🎁'}
            </div>
            
            <p className="text-gray-700 mb-6">
              想像一下：{gameConfig.objectColor ? `${gameConfig.objectColor}的` : ''}
              {gameConfig.objectType}從天空中掉落，
              你要用{gameConfig.catcherType}來接住它們！
            </p>
            
            <div className="text-2xl mb-4">
              {gameConfig.catcherType.includes('籃') ? '🧺' :
               gameConfig.catcherType.includes('手') ? '👐' :
               gameConfig.catcherType.includes('網') ? '🥅' : '🔧'}
            </div>
            
            <p className="text-sm text-gray-600">
              難度：{gameConfig.difficulty === 'easy' ? '東西掉得慢慢的，很好接' : 
                   gameConfig.difficulty === 'hard' ? '東西掉得快快的，要眼明手快' : '速度剛剛好，有點挑戰'}
            </p>
          </div>
        </div>

        {/* 行動按鈕 */}
        <div className="text-center space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              🚧 完整的遊戲功能正在開發中。目前您可以：
            </p>
            <ul className="text-blue-700 text-sm mt-2 space-y-1">
              <li>• 查看根據孩子創意生成的遊戲設定</li>
              <li>• 分享創作過程給親友</li>
              <li>• 創作更多不同的遊戲</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/create"
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              🎨 創作新遊戲
            </Link>
            
            <button 
              onClick={() => {
                const shareText = `我家寶貝創作了「${gameConfig.gameTitle}」！用${gameConfig.catcherType}接${gameConfig.objectType}的遊戲，充滿了孩子的創意和想像力！🎮✨`;
                
                if (navigator.share) {
                  navigator.share({
                    title: gameConfig.gameTitle,
                    text: shareText,
                    url: window.location.href
                  }).catch(console.error);
                } else {
                  navigator.clipboard.writeText(shareText + '\n\n' + window.location.href)
                    .then(() => alert('分享內容已複製到剪貼簿！'))
                    .catch(() => console.error('複製失敗'));
                }
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              📤 分享創作
            </button>
          </div>
        </div>

        {/* 開發說明 */}
        <div className="mt-12 text-center">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">
              💝 感謝您體驗 FA-Game！我們正在努力開發完整的遊戲功能，
              讓孩子的創意能真正變成可以遊玩的遊戲。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
