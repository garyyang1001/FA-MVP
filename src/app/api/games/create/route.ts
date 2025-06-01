import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { generateShareText } from '@/lib/gemini';
import { interpretChildInput, generateEffectDescription } from '@/lib/game-mappings';

export interface CreationStep {
  id: string;
  question: string;
  answer: string;
}

export interface GameCreateRequest {
  userId: string;
  creationSteps: CreationStep[];
  gameTitle?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 記錄請求開始
    console.log('🎮 開始創建遊戲...');

    const requestData = await request.json();
    console.log('📝 請求資料:', requestData);

    const { userId, creationSteps, gameTitle }: GameCreateRequest = requestData;

    // 驗證必要欄位
    if (!userId || !creationSteps || creationSteps.length === 0) {
      console.error('❌ 缺少必要資料');
      return NextResponse.json(
        { success: false, error: '缺少必要的創作資料' },
        { status: 400 }
      );
    }

    console.log('✅ 驗證通過，解析創作內容...');

    // 解析創作內容，生成遊戲配置
    const objectStep = creationSteps.find(s => s.id === 'object');
    const catcherStep = creationSteps.find(s => s.id === 'catcher');
    const colorStep = creationSteps.find(s => s.id === 'color');
    const speedStep = creationSteps.find(s => s.id === 'speed');

    if (!objectStep || !catcherStep) {
      console.error('❌ 創作資料不完整');
      return NextResponse.json(
        { success: false, error: '創作資料不完整' },
        { status: 400 }
      );
    }

    console.log('🎯 解析遊戲配置...');

    // 使用映射系統解析遊戲配置
    const objectInterpretation = interpretChildInput(objectStep.answer);
    const catcherInterpretation = interpretChildInput(catcherStep.answer);
    const colorInterpretation = colorStep ? interpretChildInput(colorStep.answer) : {};
    const speedInterpretation = speedStep ? interpretChildInput(speedStep.answer) : {};

    // 建立遊戲配置
    const gameConfig = {
      objectType: objectInterpretation.objectKey || objectStep.answer,
      catcherType: catcherInterpretation.catcherKey || catcherStep.answer,
      objectColor: colorInterpretation.colorKey || colorStep?.answer,
      difficulty: speedInterpretation.speedDescription === 'fast' ? 'hard' : 
                 speedInterpretation.speedDescription === 'slow' ? 'easy' : 'medium',
      gameTitle: gameTitle || `${objectStep.answer}接接樂`,
    };

    console.log('📋 遊戲配置:', gameConfig);

    // 生成遊戲效果描述
    const gameEffect = generateEffectDescription(
      gameConfig.objectType,
      gameConfig.catcherType,
      gameConfig.objectColor
    );

    console.log('🎨 遊戲效果:', gameEffect);

    // 生成分享文案
    console.log('✍️ 生成分享文案...');
    let shareText = '';
    try {
      shareText = await generateShareText(
        gameConfig.gameTitle,
        creationSteps
      );
    } catch (error) {
      console.warn('⚠️ 生成分享文案失敗，使用預設文案:', error);
      shareText = `我家寶貝創作了「${gameConfig.gameTitle}」！充滿創意的遊戲，快來一起玩吧！🎮✨`;
    }

    console.log('💬 分享文案:', shareText);

    // 儲存到 Firestore
    console.log('💾 儲存到 Firestore...');
    const gameData = {
      userId,
      gameConfig,
      creationSteps,
      gameEffect,
      shareText,
      createdAt: serverTimestamp(),
      playCount: 0,
      isPublic: true, // MVP 階段所有遊戲都是公開的
      likes: 0
    };

    try {
      const docRef = await addDoc(collection(db, 'games'), gameData);
      console.log('✅ 遊戲儲存成功，ID:', docRef.id);

      // 建立分享連結
      const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/play/${docRef.id}`;

      console.log('🎉 遊戲創建完成');

      return NextResponse.json({
        success: true,
        gameId: docRef.id,
        shareUrl,
        shareText,
        gameConfig,
        gameEffect
      });
    } catch (firestoreError) {
      console.error('💥 Firestore 儲存失敗:', firestoreError);
      
      // 回傳臨時遊戲配置（即使無法儲存）
      return NextResponse.json({
        success: true,
        gameId: 'temp_' + Date.now(),
        shareUrl: '',
        shareText,
        gameConfig,
        gameEffect,
        isTemporary: true,
        error: 'Unable to save permanently, but game created'
      });
    }

  } catch (error) {
    console.error('💥 API 錯誤:', error);
    
    // 詳細錯誤記錄
    const errorMessage = error instanceof Error ? error.message : '未知錯誤';
    const errorStack = error instanceof Error ? error.stack : '';
    
    console.error('錯誤詳情:', {
      message: errorMessage,
      stack: errorStack
    });
    
    // 檢查是否是特定錯誤類型
    if (errorMessage.includes('Firebase')) {
      return NextResponse.json(
        { success: false, error: '資料庫連線失敗，請稍後再試' },
        { status: 503 }
      );
    }

    if (errorMessage.includes('API')) {
      return NextResponse.json(
        { success: false, error: 'AI 服務暫時不可用，請稍後再試' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: '創建遊戲失敗，請稍後再試',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

// 獲取用戶的遊戲列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '需要用戶 ID' },
        { status: 400 }
      );
    }

    // 這裡暫時返回空列表，完整實作需要查詢 Firestore
    // 在 MVP 階段，我們專注於創建遊戲功能
    return NextResponse.json({
      success: true,
      games: [],
      message: 'MVP 階段：遊戲列表功能開發中'
    });

  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { success: false, error: '獲取遊戲列表失敗' },
      { status: 500 }
    );
  }
}
