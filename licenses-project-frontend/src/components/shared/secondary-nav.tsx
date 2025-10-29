import { useState, useEffect } from 'react'
import { MenuItem } from '@/types/navigation/menu.types'
import { ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/ui/icons'

interface SecondaryNavProps {
  items: MenuItem[]
  className?: string
}

export function SecondaryNav({ items, className }: SecondaryNavProps) {
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger enter animation when mounted
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  if (!items?.length) return null

  const isItemActive = (href: string, dropdownItems?: MenuItem[]) => {
    // Check direct path match
    if (
      location.pathname === href ||
      location.pathname.startsWith(href + '/')
    ) {
      return true
    }

    // Check dropdown items if they exist
    if (dropdownItems) {
      return dropdownItems.some(
        (item) =>
          location.pathname === item.href ||
          location.pathname.startsWith(item.href + '/')
      )
    }

    return false
  }

  return (
    <div className='secondary-nav-container'>
      <div
        className={cn(
          'secondary-nav-wrapper',
          isVisible ? 'secondary-nav-enter' : 'secondary-nav-exit',
          'border-b bg-primary backdrop-blur supports-[backdrop-filter]:bg-primary/95',
          'shadow-sm',
          className
        )}
      >
        <div className='flex h-12 items-center px-6'>
          <nav className='flex space-x-8'>
            {items.map((item, index) => {
              const Icon = item.icon && Icons[item.icon as keyof typeof Icons]

              if (item.dropdown) {
                return (
                  <DropdownMenu key={index}>
                    <DropdownMenuTrigger
                      className={cn(
                        'flex items-center space-x-2 text-xs font-medium',
                        'transition-all duration-200 ease-in-out',
                        'hover:text-white/90 focus:outline-none',
                        isItemActive(item.href, item.dropdown)
                          ? 'text-white font-semibold'
                          : 'text-white/70',
                        // Only apply underline effect when not a dropdown
                        !item.dropdown && [
                          'relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-white after:transition-transform after:duration-200',
                          'hover:after:scale-x-100',
                          isItemActive(item.href) && 'after:scale-x-100',
                        ]
                      )}
                    >
                      {Icon && <Icon className='h-3.5 w-3.5' />}
                      <span>{item.label}</span>
                      <ChevronDown className='h-3.5 w-3.5 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align='start'
                      className='w-52 animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1'
                    >
                      {item.dropdown.map((dropdownItem, dropdownIndex) => {
                        const DropdownIcon = dropdownItem.icon
                          ? Icons[dropdownItem.icon as keyof typeof Icons]
                          : null
                        return (
                          <DropdownMenuItem
                            key={dropdownIndex}
                            asChild
                            className={cn(
                              'py-2',
                              isItemActive(dropdownItem.href) && 'bg-muted'
                            )}
                          >
                            <Link
                              to={dropdownItem.href}
                              className='flex items-center space-x-2 text-xs'
                            >
                              {DropdownIcon && (
                                <DropdownIcon className='h-3.5 w-3.5 text-muted-foreground' />
                              )}
                              <span>{dropdownItem.label}</span>
                            </Link>
                          </DropdownMenuItem>
                        )
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }

              return (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-2 text-xs font-medium',
                    'transition-all duration-200 ease-in-out',
                    'hover:text-white/90 focus:outline-none',
                    'relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-white after:transition-transform after:duration-200',
                    'hover:after:scale-x-100',
                    isItemActive(item.href)
                      ? 'text-white font-semibold after:scale-x-100'
                      : 'text-white/70 after:scale-x-0'
                  )}
                >
                  {Icon && <Icon className='h-3.5 w-3.5' />}
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
