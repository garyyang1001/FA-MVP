'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { createCatchGame, GameConfig } from '@/lib/phaser-templates/CatchGame';

export default function GamePreviewPage() {
  const searchParams = useSearchParams();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // 載入遊戲配置
  useEffect(() => {
    try {
      const configParam = searchParams.get('config');
      if (!configParam) {
        setError('缺少遊戲配置');
        setLoading(false);
        return;
      }

      const config = JSON.parse(decodeURIComponent(configParam));
      
      const gameConfig: GameConfig = {
        objectType: config.objectType || '蘋果',
        catcherType: config.catcherType || '籃子',
        objectColor: config.objectColor,
        difficulty: config.difficulty || 'medium',
        gameTitle: config.gameTitle || '接東西遊戲'
      };

      setGameConfig(gameConfig);
    } catch (err) {
      setError('遊戲配置解析失敗');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // 啟動遊戲
  const startGame = () => {
    if (!gameConfig || !gameContainerRef.current) return;

    // 清理現有遊戲
    if (phaserGameRef.current) {
      phaserGameRef.current.destroy(true);
    }

    // 創建新遊戲
    phaserGameRef.current = createCatchGame('game-container', gameConfig);
    setGameStarted(true);
  };

  // 分享遊戲
  const shareGame = async () => {
    if (!gameConfig) return;

    try {
      const shareUrl = window.location.href;
      const shareData = {
        title: gameConfig.gameTitle || '我創作的遊戲',
        text: `我和孩子一起創作了「${gameConfig.gameTitle}」！用${gameConfig.catcherType}接${gameConfig.objectType}的遊戲，快來試試看吧！`,
        url: shareUrl
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // 退回到複製連結
        await navigator.clipboard.writeText(shareUrl);
        alert('遊戲連結已複製到剪貼簿！');
      }
    } catch (error) {
      console.error('分享失敗:', error);
    }
  };

  // 複製連結
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('遊戲連結已複製到剪貼簿！');
    } catch (error) {
      console.error('複製失敗:', error);
      alert('複製失敗，請手動複製網址');
    }
  };

  // 載入中狀態
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">載入遊戲中...</h2>
          <p className="text-gray-600">請稍候</p>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (error || !gameConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">遊戲載入失敗</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link 
              href="/create"
              className="block w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              創作新遊戲
            </Link>
            <Link 
              href="/"
              className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              回到首頁
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 導航區域 */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-lg"
          >
            ← 回到首頁
          </Link>
          <Link 
            href="/create" 
            className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors border border-blue-200"
          >
            🎨 創作新遊戲
          </Link>
        </div>

        {/* 遊戲標題區域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm mb-4">
            ✨ 預覽模式
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {gameConfig.gameTitle}
          </h1>
          <p className="text-lg text-gray-600">
            用{gameConfig.catcherType}接{gameConfig.objectType}的遊戲
            {gameConfig.objectColor && `，${gameConfig.objectColor}的特殊效果！`}
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <span>🎯 難度：{
              gameConfig.difficulty === 'easy' ? '簡單' :
              gameConfig.difficulty === 'hard' ? '困難' : '中等'
            }</span>
          </div>
        </div>

        {/* 遊戲容器區域 */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {!gameStarted ? (
              <div className="aspect-[2/3] bg-gradient-to-br from-sky-100 to-purple-100 flex flex-col items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎮</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    準備開始遊戲！
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm">
                    這是根據孩子的創意製作的專屬遊戲
                  </p>
                  <button
                    onClick={startGame}
                    className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
                  >
                    開始遊戲 🚀
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
              <p className="text-sm text-gray-600">
                用滑鼠或鍵盤方向鍵控制移動，接住所有掉下來的{gameConfig.objectType}！
              </p>
            </div>
          </div>
        )}

        {/* 遊戲資訊與分享區域 */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              🎯 <span className="ml-2">遊戲資訊</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">創作詳情</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• 物品類型：{gameConfig.objectType}</p>
                  <p>• 接取工具：{gameConfig.catcherType}</p>
                  {gameConfig.objectColor && (
                    <p>• 顏色效果：{gameConfig.objectColor}</p>
                  )}
                  <p>• 難度等級：{
                    gameConfig.difficulty === 'easy' ? '簡單' :
                    gameConfig.difficulty === 'hard' ? '困難' : '中等'
                  }</p>
                  <p>• 模式：預覽模式</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">分享這個遊戲</h4>
                <div className="space-y-3">
                  <button
                    onClick={shareGame}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    📱 分享遊戲
                  </button>
                  <button
                    onClick={copyLink}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    🔗 複製連結
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 預覽模式說明 */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-md p-6 border border-yellow-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center text-yellow-800">
              ✨ <span className="ml-2">預覽模式說明</span>
            </h3>
            <div className="space-y-3 text-sm text-yellow-700">
              <p>🎮 這是根據您和孩子的創作生成的遊戲預覽</p>
              <p>💾 登入後可以永久保存遊戲，並獲得分享連結</p>
              <p>📊 保存的遊戲會記錄遊玩次數和創作過程</p>
              <p>🌟 邀請其他家庭一起體驗親子創作的樂趣！</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-yellow-200">
              <Link
                href="/create"
                className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
              >
                🎨 立即登入並保存遊戲
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
