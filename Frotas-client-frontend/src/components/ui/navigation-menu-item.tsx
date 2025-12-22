import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { shouldManageWindow } from '@/utils/window-utils'
import { Icons } from '@/components/ui/icons'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'
import { useWindowsStore } from '@/stores/use-windows-store'

interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  title: string
  to: string
  icon?: keyof typeof Icons
  iconBackgroundClassName?: string
  iconBackgroundStyle?: React.CSSProperties
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, ListItemProps>(
  (
    {
      className,
      title,
      children,
      to,
      icon,
      iconBackgroundClassName,
      iconBackgroundStyle,
      ...props
    },
    ref
  ) => {
    const navigate = useNavigate()

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // If this is a route that should manage windows, check if window already exists
      if (shouldManageWindow(to)) {
        e.preventDefault()
        
        const { windows, restoreWindow } = useWindowsStore.getState()
        
        // Check if there's already a window for this path (including minimized ones)
        // If multiple exist, get the most recently accessed one
        const existingWindows = windows.filter((w) => w.path === to)
        const existingWindow = existingWindows.length > 0
          ? existingWindows.reduce((latest, current) =>
              (current.lastAccessed || 0) > (latest.lastAccessed || 0)
                ? current
                : latest
            )
          : undefined
        
        if (existingWindow) {
          // Restore/activate the existing window instead of creating a new one
          restoreWindow(existingWindow.id)
          const searchParams = new URLSearchParams()
          if (existingWindow.searchParams) {
            Object.entries(existingWindow.searchParams).forEach(([key, value]) => {
              searchParams.set(key, value)
            })
          }
          searchParams.set('instanceId', existingWindow.instanceId)
          navigate(`${to}?${searchParams.toString()}`)
          return
        }
        
        // If no existing window, create a new one
        const instanceId = crypto.randomUUID()
        navigate(`${to}?instanceId=${instanceId}`)
        return
      }

      // Otherwise, let the default Link behavior handle it
      if (props.onClick) {
        props.onClick(e)
      }
    }

    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            to={to}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            onClick={handleClick}
            {...props}
          >
            <div className='flex items-center gap-2 text-sm font-medium leading-none'>
              {icon && Icons[icon] && (
                <span
                  className={cn(
                    'h-5 w-5 p-0.5 rounded-md flex items-center justify-center text-white shadow',
                    iconBackgroundStyle ? '' : iconBackgroundClassName
                  )}
                  style={iconBackgroundStyle}
                >
                  {React.createElement(
                    Icons[icon] as React.ComponentType<any>,
                    {
                      className: 'h-3 w-3 text-white',
                    }
                  )}
                </span>
              )}
              {title}
            </div>
            <span className='line-clamp-2 text-xs leading-snug text-muted-foreground'>
              {children}
            </span>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = 'ListItem'

export { ListItem }
