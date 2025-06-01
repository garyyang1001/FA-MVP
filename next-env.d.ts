/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Next.js 自動生成的類型聲明文件
// 注意：此文件不應手動編輯，因為 Next.js 會自動維護

// 為我們的專案添加額外的全域類型定義
declare global {
  // 為 Phaser 遊戲添加全域類型支援
  interface Window {
    Phaser: typeof import('phaser');
  }
  
  // 為環境變數添加類型定義
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_FIREBASE_API_KEY: string;
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
      NEXT_PUBLIC_FIREBASE_APP_ID: string;
      GEMINI_API_KEY: string;
      NEXT_PUBLIC_APP_URL: string;
    }
  }
}

export {}