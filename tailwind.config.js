/** @type {import('tailwindcss').Config} */
module.exports = {
  // 指定要掃描的文件路徑，讓 Tailwind 知道哪些樣式類別會被使用
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/game-templates/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // 自定義顏色系統 - 為親子遊戲設計的溫暖色調
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // 主要藍色
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff', 
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // 主要紫色
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        // 親子遊戲專用的溫暖色調
        warm: {
          orange: '#fb923c',
          yellow: '#fbbf24', 
          green: '#34d399',
          pink: '#f472b6',
        },
        // 系統狀態顏色
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      
      // 自定義字體系列
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
        display: ['Inter', 'Noto Sans TC', 'sans-serif'],
      },
      
      // 自定義動畫
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      
      // 自定義關鍵幀動畫
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6)' },
        },
      },
      
      // 自定義間距
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // 自定義圓角
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      // 響應式斷點微調
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      
      // 自定義盒子陰影 - 為遊戲元件設計
      boxShadow: {
        'game': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'game-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-glow': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [
    // 未來可以在這裡添加更多 Tailwind 插件
  ],
}