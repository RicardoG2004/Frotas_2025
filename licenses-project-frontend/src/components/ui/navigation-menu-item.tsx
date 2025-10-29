import * as React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/ui/icons'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'

interface ListItemProps extends React.ComponentPropsWithoutRef<'a'> {
  title: string
  to: string
  icon?: keyof typeof Icons
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, ListItemProps>(
  ({ className, title, children, to, icon, ...props }, ref) => {
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
            {...props}
          >
            <div className='flex items-center gap-2 text-sm font-medium leading-none'>
              {icon && (
                <span className='h-4 w-4'>
                  {React.createElement(Icons[icon], { className: 'h-4 w-4' })}
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
