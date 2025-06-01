'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { createCatchGame, GameConfig } from '@/lib/phaser-templates/CatchGame';

interface PlayPageProps {
  params: {
    id: string;
  };
}

interface GameData {
  id: string;
  gameConfig: GameConfig;
  gameEffect: string;
  shareText: string;
  creationSteps: Array<{ id: string; question: string; answer: string }>;
  createdAt: any;
  playCount: number;
  likes: number;
  creator: {
    userId: string;
  };
}

export default function PlayPage({ params }: PlayPageProps) {
  const { id } = params;
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // 基本的 ID 驗證
  if (!id || id.length < 3) {
    notFound();
  }

  // 載入遊戲資料
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch(`/api/games/${id}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || '載入遊戲失敗');
        }

        setGameData(data.game);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知錯誤');
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id]);

  // 啟動遊戲 - 修復異步問題
  const startGame = async () => {
    if (!gameData || !gameContainerRef.current) return;

    try {
      // 清理現有遊戲
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
      }

      // 創建新遊戲
      const gameConfig: GameConfig = {
        objectType: gameData.gameConfig.objectType,
        catcherType: gameData.gameConfig.catcherType,
        objectColor: gameData.gameConfig.objectColor,
        difficulty: gameData.gameConfig.difficulty || 'medium',
        gameTitle: gameData.gameConfig.gameTitle
      };

      // 使用 await 等待異步函數完成
      phaserGameRef.current = await createCatchGame('game-container', gameConfig);
      setGameStarted(true);
    } catch (error) {
      console.error('遊戲啟動失敗:', error);
      setError('遊戲啟動失敗，請重試');
    }
  };

  // 分享遊戲
  const shareGame = async () => {
    if (!gameData || typeof window === 'undefined') return;

    try {
      const shareUrl = window.location.href;
      const shareData = {
        title: gameData.gameConfig.gameTitle || '我創作的遊戲',
        text: gameData.shareText,
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
    if (typeof window === 'undefined') return;
    
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
  if (error) {
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

  if (!gameData) return null;

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {gameData.gameConfig.gameTitle}
          </h1>
          <p className="text-lg text-gray-600">
            {gameData.gameEffect}
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <span>🎮 {gameData.playCount} 次遊玩</span>
            <span>❤️ {gameData.likes} 個讚</span>
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
                    {gameData.gameEffect}
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
                用滑鼠或鍵盤方向鍵控制移動，接住所有掉下來的{gameData.gameConfig.objectType}！
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
                  <p>• 物品類型：{gameData.gameConfig.objectType}</p>
                  <p>• 接取工具：{gameData.gameConfig.catcherType}</p>
                  {gameData.gameConfig.objectColor && (
                    <p>• 顏色效果：{gameData.gameConfig.objectColor}</p>
                  )}
                  <p>• 難度等級：{
                    gameData.gameConfig.difficulty === 'easy' ? '簡單' :
                    gameData.gameConfig.difficulty === 'hard' ? '困難' : '中等'
                  }</p>
                  <p>• 遊玩次數：{gameData.playCount}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-3">分享這個遊戲</h4>
                <div className="space-y-3">
                  <button
                    onClick={shareGame}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    disabled={typeof window === 'undefined'}
                  >
                    📱 分享遊戲
                  </button>
                  <button
                    onClick={copyLink}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    disabled={typeof window === 'undefined'}
                  >
                    🔗 複製連結
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 創作過程回顧 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              📝 <span className="ml-2">創作過程回顧</span>
            </h3>
            <div className="space-y-3">
              {gameData.creationSteps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-600 mb-1">{step.question}</div>
                    <div className="font-medium text-gray-800">{step.answer}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">✨ 分享文案</h4>
              <p className="text-green-700 text-sm">{gameData.shareText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}