'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { createCatchGame, GameConfig } from '@/lib/phaser-templates/CatchGame';

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

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

  // 啟動真正的 Phaser 遊戲
  const startGame = async () => {
    if (!gameConfig || !gameContainerRef.current) return;

    try {
      // 清理現有遊戲
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
      }

      console.log('🎮 啟動 Phaser 遊戲:', gameConfig);
      
      // 使用真正的 Phaser 遊戲
      phaserGameRef.current = await createCatchGame('game-container', gameConfig);
      setGameStarted(true);
      
    } catch (error) {
      console.error('遊戲啟動失敗:', error);
      setError('遊戲啟動失敗：' + (error instanceof Error ? error.message : '未知錯誤'));
    }
  };

  // 清理遊戲
  useEffect(() => {
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
      }
    };
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 頁面標題 */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/create"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-lg"
          >
            ← 返回創作
          </Link>
          
          <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            🎮 即玩模式
          </div>
        </div>

        {/* 遊戲標題 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {gameConfig.gameTitle}
          </h1>
          <p className="text-gray-600">立即體驗你的創作！</p>
        </div>

        {/* 遊戲容器 */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {!gameStarted ? (
              <div className="aspect-[2/3] bg-gradient-to-br from-sky-100 to-purple-100 flex flex-col items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎮</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    準備開始遊戲！
                  </h3>
                  <div className="bg-white p-4 rounded-lg mb-6 text-left">
                    <h4 className="font-medium mb-2">🎯 遊戲設定</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>要接的東西: {gameConfig.objectType}</p>
                      <p>使用工具: {gameConfig.catcherType}</p>
                      {gameConfig.objectColor && <p>顏色: {gameConfig.objectColor}</p>}
                      <p>難度: {
                        gameConfig.difficulty === 'easy' ? '簡單' :
                        gameConfig.difficulty === 'hard' ? '困難' : '中等'
                      }</p>
                    </div>
                  </div>
                  <button
                    onClick={startGame}
                    className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-medium"
                  >
                    🚀 開始遊戲！
                  </button>
                </div>
              </div>
            ) : (
              <div id="game-container" ref={gameContainerRef} className="w-full" />
            )}
          </div>
        </div>

        {/* 遊戲說明 */}
        {gameStarted && (
          <div className="max-w-md mx-auto mb-8 text-center">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium text-gray-800 mb-2">🎯 遊戲說明</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>🖱️ 使用滑鼠移動</p>
                <p>⌨️ 或用方向鍵 ← → 控制</p>
                <p>🎯 接住所有 {gameConfig.objectType}！</p>
              </div>
            </div>
          </div>
        )}

        {/* 遊戲資訊 */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              ✨ <span className="ml-2">關於這個遊戲</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">🎨 創作特色</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• 這是根據孩子創意製作的真實可玩遊戲</p>
                  <p>• 使用 Phaser 遊戲引擎開發</p>
                  <p>• 支援觸控和鍵盤操作</p>
                  <p>• 具備計分和時間挑戰</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">📤 分享與保存</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const shareText = `我家寶貝創作了「${gameConfig.gameTitle}」！用${gameConfig.catcherType}接${gameConfig.objectType}的遊戲，充滿了孩子的創意和想像力！快來玩玩看！🎮✨`;
                      
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
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    📱 分享這個遊戲
                  </button>
                  
                  <Link
                    href="/create"
                    className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm text-center"
                  >
                    🎨 創作新遊戲
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 技術說明 */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
            <div className="flex items-center mb-3">
              <span className="text-green-600 text-xl mr-2">✅</span>
              <h4 className="font-medium text-green-800">真實遊戲體驗</h4>
            </div>
            <p className="text-green-700 text-sm">
              這不是模擬或預覽 - 這是根據孩子的創意想法實際開發的可玩遊戲！
              即使沒有永久保存，你仍然可以完整體驗遊戲的所有功能。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
