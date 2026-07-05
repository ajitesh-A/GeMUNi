'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-50 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-accent text-white hover:bg-accent-700': variant === 'primary',
            'bg-primary text-white hover:bg-primary-600': variant === 'secondary',
            'border border-gray-200 bg-white text-accent hover:bg-gray-50': variant === 'outline',
            'text-accent hover:bg-gray-100': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
          },
          {
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button }
