import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Label = forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'block text-sm font-medium text-accent',
        className,
      )}
      {...props}
    />
  )
})
Label.displayName = 'Label'

export { Label }
