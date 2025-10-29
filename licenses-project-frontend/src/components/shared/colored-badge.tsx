import { cn } from '@/lib/utils'

interface ColoredBadgeProps {
  label: string
  color?: string
  className?: string
  icon?: React.ReactNode
  size?: 'xs' | 'sm' | 'md'
}

export function ColoredBadge({
  label,
  color,
  className,
  icon,
  size = 'sm',
}: ColoredBadgeProps) {
  if (!color) {
    return <div className={cn('text-sm font-medium', className)}>{label}</div>
  }

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-sm px-2.5 py-1 gap-1.5',
  }

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md font-medium',
        'shadow-sm transition-all duration-200',
        'ring-1 ring-inset hover:ring-2',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: `${color}08`,
        color: color,
        borderColor: `${color}30`,
        ['--tw-ring-color' as string]: `${color}30`,
      }}
    >
      {icon && (
        <span className={cn('opacity-70', iconSizes[size])}>{icon}</span>
      )}
      {label}
    </div>
  )
}
