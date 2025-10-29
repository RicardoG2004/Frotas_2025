import { cn } from '@/lib/utils'
import { Icons } from '@/components/ui/icons'

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function LoadingSpinner({
  size = 'default',
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <Icons.spinner
        className={cn('animate-spin', {
          'h-4 w-4': size === 'sm',
          'h-6 w-6': size === 'default',
          'h-8 w-8': size === 'lg',
        })}
      />
    </div>
  )
}
