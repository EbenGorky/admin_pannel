import * as React from 'react'
import { cn } from '@/lib/utils'

const Avatar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { src?: string; alt?: string; fallback?: string; size?: 'sm' | 'md' | 'lg' }>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const [error, setError] = React.useState(false)
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-card border border-border-light overflow-hidden shrink-0',
          {
            'w-8 h-8 text-xs': size === 'sm',
            'w-10 h-10 text-sm': size === 'md',
            'w-14 h-14 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {src && !error ? (
          <img
            src={src}
            alt={alt || ''}
            className="w-full h-full object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <span className="font-semibold uppercase text-text-muted">
            {fallback || alt?.charAt(0) || '?'}
          </span>
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

export { Avatar }
