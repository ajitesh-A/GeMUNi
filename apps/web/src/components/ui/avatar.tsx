import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string
  alt?: string
  initials?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({
  src,
  alt,
  initials,
  className,
  size = 'md',
}: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt || ''}
        className={cn(
          'rounded-full object-cover',
          sizeClasses[size],
          className,
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary-100 font-medium text-primary-700',
        sizeClasses[size],
        className,
      )}
    >
      {initials || '?'}
    </div>
  )
}
