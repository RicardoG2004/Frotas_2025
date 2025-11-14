import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { shouldManageWindow } from '@/utils/window-utils'
import { useIconThemeColor } from '@/hooks/use-icon-theme'
import { Icons } from '@/components/ui/icons'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'

interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  title: string
  to: string
  icon?: keyof typeof Icons
  iconGradient?: string
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, ListItemProps>(
  ({ className, title, children, to, icon, iconGradient, ...props }, ref) => {
    const navigate = useNavigate()
    const themeColorClass = useIconThemeColor(to)

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // If this is a route that should manage windows, add a new instance ID
      if (shouldManageWindow(to)) {
        e.preventDefault()
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
                  className={`h-5 w-5 p-0.5 rounded-md flex items-center justify-center ${
                    iconGradient ? '' : themeColorClass
                  }`}
                  style={
                    iconGradient ? { backgroundImage: iconGradient } : undefined
                  }
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
