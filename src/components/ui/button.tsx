import * as React from 'react'
import { cn } from '@/lib/utils'

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'secondary' | 'ghost' | 'danger' | 'outline'; size?: 'sm' | 'md' | 'lg' }>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-radius-button transition-all duration-200 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary text-white hover:bg-primary-dark active:scale-[0.98]': variant === 'default',
            'bg-card border border-border-light text-text-heading hover:bg-card-hover': variant === 'secondary',
            'text-text hover:text-text-heading hover:bg-card': variant === 'ghost',
            'bg-danger text-white hover:bg-red-600': variant === 'danger',
            'border border-border-light text-text-heading bg-transparent hover:bg-card': variant === 'outline',
            'h-8 px-3 text-xs': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
