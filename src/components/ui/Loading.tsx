import { clsx } from 'clsx'

// 載入元件的屬性型別定義
interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'blue' | 'purple' | 'green' | 'yellow'
  text?: string
  className?: string
}

// 統一的載入動畫元件 - 提供一致的使用者體驗
export function Loading({ 
  size = 'md', 
  color = 'blue', 
  text, 
  className 
}: LoadingProps) {
  // 根據 size 決定載入動畫大小
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }
  
  // 根據 color 決定顏色主題
  const colorClasses = {
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    green: 'border-green-500',
    yellow: 'border-yellow-500'
  }

  return (
    <div className={clsx('flex flex-col items-center justify-center', className)}>
      {/* 旋轉載入動畫 */}
      <div
        className={clsx(
          'animate-spin rounded-full border-b-2',
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      
      {/* 可選的載入文字 */}
      {text && (
        <p className="mt-3 text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

// 簡化版載入點 - 用於小空間
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={clsx('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )
}