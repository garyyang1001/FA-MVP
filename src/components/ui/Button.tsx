import { clsx } from 'clsx'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

// 使用 CVA (Class Variance Authority) 來管理按鈕變體
const buttonVariants = cva(
  // 基礎樣式 - 所有按鈕共用
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      // 按鈕樣式變體
      variant: {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg active:transform active:scale-95 focus:ring-blue-500',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 focus:ring-gray-500',
        success: 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg focus:ring-green-500',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600 shadow-md hover:shadow-lg focus:ring-yellow-500',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg focus:ring-red-500',
        ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
        outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-500',
      },
      
      // 按鈕大小變體
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
      },
      
      // 按鈕寬度變體
      width: {
        auto: 'w-auto',
        full: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      width: 'auto',
    },
  }
)

// 按鈕元件的屬性型別
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

// 按鈕元件 - 使用 forwardRef 以支援 ref 傳遞
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    width,
    loading = false,
    leftIcon,
    rightIcon,
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={clsx(buttonVariants({ variant, size, width, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* 載入狀態或左側圖示 */}
        {loading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        
        {/* 按鈕文字內容 */}
        {children}
        
        {/* 右側圖示 */}
        {rightIcon && !loading && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

// 匯出按鈕變體型別，方便其他元件使用
export type { VariantProps }
export { buttonVariants }