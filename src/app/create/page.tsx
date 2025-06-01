'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { GoogleLogin } from '@/components/auth/GoogleLogin';
import { CreationFlow } from '@/components/creation/CreationFlow';

export default function CreatePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreation, setShowCreation] = useState(false);

  // 監聽認證狀態變化
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        setShowCreation(true);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  // 如果用戶未登入，顯示登入頁面
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 text-lg"
            >
              ← 回到首頁
            </Link>
            
            <div className="max-w-lg mx-auto">
              <div className="text-6xl mb-6">🎨</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                開始創作你的遊戲
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                讓 AI 引導你和孩子一起創造獨特的遊戲體驗
              </p>
              
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  請先登入開始創作
                </h2>
                <p className="text-gray-600 mb-6">
                  我們需要建立您的帳戶來儲存創作的遊戲
                </p>
                
                <GoogleLogin />
                
                <div className="mt-6 text-xs text-gray-500">
                  登入即表示您同意我們的服務條款和隱私政策
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 用戶已登入，顯示創作流程
  if (showCreation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* 頁面標題 */}
          <div className="text-center mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 text-lg"
            >
              ← 回到首頁
            </Link>
            
            <div className="max-w-lg mx-auto mb-8">
              <div className="text-6xl mb-4">🎨</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                歡迎，{user.displayName}！
              </h1>
              <p className="text-lg text-gray-600">
                讓我們一起創作專屬於孩子的遊戲吧
              </p>
            </div>
          </div>

          {/* 創作流程說明 */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                📋 <span className="ml-2">創作流程說明</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">🎯 AI 會引導您：</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 提供適合的問題讓您問孩子</li>
                    <li>• 解釋每個步驟的重要性</li>
                    <li>• 即時預覽遊戲效果</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">👨‍👩‍👧‍👦 您需要做的：</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 按照提示詢問孩子</li>
                    <li>• 記錄孩子的創意回答</li>
                    <li>• 享受親子創作的樂趣</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 創作流程元件 */}
          <div className="bg-white rounded-xl shadow-sm">
            <CreationFlow />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
