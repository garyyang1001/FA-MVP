import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id;

    if (!gameId) {
      return NextResponse.json(
        { success: false, error: '遊戲 ID 無效' },
        { status: 400 }
      );
    }

    // 從 Firestore 獲取遊戲資料
    const gameDoc = await getDoc(doc(db, 'games', gameId));
    
    if (!gameDoc.exists()) {
      return NextResponse.json(
        { success: false, error: '遊戲不存在' },
        { status: 404 }
      );
    }

    const gameData = gameDoc.data();

    // 增加遊玩次數（異步處理，不阻塞回應）
    updateDoc(doc(db, 'games', gameId), {
      playCount: increment(1)
    }).catch(error => {
      console.error('Failed to update play count:', error);
      // 不需要阻塞用戶，只記錄錯誤
    });

    // 格式化回傳資料
    const response = {
      success: true,
      game: {
        id: gameId,
        gameConfig: gameData.gameConfig,
        gameEffect: gameData.gameEffect,
        shareText: gameData.shareText,
        creationSteps: gameData.creationSteps,
        createdAt: gameData.createdAt,
        playCount: (gameData.playCount || 0) + 1, // 立即反映新的播放次數
        likes: gameData.likes || 0,
        isPublic: gameData.isPublic !== false, // 預設為 true
        creator: {
          userId: gameData.userId,
          // 可以在此加入創作者的公開資訊
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching game:', error);
    
    // 檢查是否是 Firebase 錯誤
    if (error instanceof Error && error.message.includes('Firebase')) {
      return NextResponse.json(
        { success: false, error: '資料庫連線失敗，請稍後再試' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: '獲取遊戲失敗，請稍後再試' },
      { status: 500 }
    );
  }
}

// 更新遊戲資料（例如點讚）
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id;
    const { action, userId } = await request.json();

    if (!gameId) {
      return NextResponse.json(
        { success: false, error: '遊戲 ID 無效' },
        { status: 400 }
      );
    }

    // 檢查遊戲是否存在
    const gameDoc = await getDoc(doc(db, 'games', gameId));
    if (!gameDoc.exists()) {
      return NextResponse.json(
        { success: false, error: '遊戲不存在' },
        { status: 404 }
      );
    }

    const gameRef = doc(db, 'games', gameId);

    switch (action) {
      case 'like':
        await updateDoc(gameRef, {
          likes: increment(1)
        });
        
        return NextResponse.json({
          success: true,
          message: '點讚成功',
          newLikes: (gameDoc.data().likes || 0) + 1
        });

      case 'unlike':
        await updateDoc(gameRef, {
          likes: increment(-1)
        });
        
        return NextResponse.json({
          success: true,
          message: '取消點讚',
          newLikes: Math.max(0, (gameDoc.data().likes || 0) - 1)
        });

      default:
        return NextResponse.json(
          { success: false, error: '不支援的操作' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error updating game:', error);
    
    return NextResponse.json(
      { success: false, error: '更新遊戲失敗' },
      { status: 500 }
    );
  }
}

// 刪除遊戲（只有創作者可以刪除）
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id;
    const { userId } = await request.json();

    if (!gameId || !userId) {
      return NextResponse.json(
        { success: false, error: '缺少必要參數' },
        { status: 400 }
      );
    }

    // 檢查遊戲是否存在且用戶是否為創作者
    const gameDoc = await getDoc(doc(db, 'games', gameId));
    if (!gameDoc.exists()) {
      return NextResponse.json(
        { success: false, error: '遊戲不存在' },
        { status: 404 }
      );
    }

    const gameData = gameDoc.data();
    if (gameData.userId !== userId) {
      return NextResponse.json(
        { success: false, error: '只有創作者可以刪除遊戲' },
        { status: 403 }
      );
    }

    // 軟刪除（標記為已刪除，而不是真正刪除）
    await updateDoc(doc(db, 'games', gameId), {
      isDeleted: true,
      deletedAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: '遊戲已刪除'
    });

  } catch (error) {
    console.error('Error deleting game:', error);
    
    return NextResponse.json(
      { success: false, error: '刪除遊戲失敗' },
      { status: 500 }
    );
  }
}
