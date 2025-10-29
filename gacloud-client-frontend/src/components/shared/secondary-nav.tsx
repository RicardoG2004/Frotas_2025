import { useState, useEffect } from 'react'
import { MenuItem } from '@/types/navigation/menu.types'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { usePermissionsStore } from '@/stores/permissions-store'
import { cn } from '@/lib/utils'
import { shouldManageWindow } from '@/utils/window-utils'
import { useIconThemeColor } from '@/hooks/use-icon-theme'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { Icons } from '@/components/ui/icons'

interface SecondaryNavProps {
  items: MenuItem[]
  className?: string
}

export function SecondaryNav({ items, className }: SecondaryNavProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { hasPermission } = usePermissionsStore()

  useEffect(() => {
    // Trigger enter animation when mounted
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  if (!items?.length) {
    return null
  }

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

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    // If this is a route that should manage windows, add a new instance ID
    if (shouldManageWindow(href)) {
      e.preventDefault()
      const instanceId = crypto.randomUUID()
      navigate(`${href}?instanceId=${instanceId}`)
    }

    // Close any open dropdowns
    setOpenDropdown(null)
  }

  const hasItemPermission = (item: MenuItem): boolean => {
    if (item.funcionalidadeId) {
      return hasPermission(item.funcionalidadeId, 'AuthVer')
    }
    return true
  }

  const renderDropdownItem = (item: MenuItem, index: number) => {
    // Skip rendering if user doesn't have permission
    if (!hasItemPermission(item)) {
      return null
    }

    const Icon = item.icon ? Icons[item.icon as keyof typeof Icons] : null
    const isActive = isItemActive(item.href)

    if (item.dropdown) {
      const filteredDropdown = item.dropdown.filter(hasItemPermission)
      if (filteredDropdown.length === 0) {
        return null
      }

      return (
        <DropdownMenuSub key={index}>
          <DropdownMenuSubTrigger
            className={cn(
              'flex items-center justify-between w-full',
              'px-3 py-2 text-xs',
              'transition-all duration-200',
              'hover:bg-accent/50',
              'group',
              isActive && [
                'bg-primary/10',
                'text-primary',
                'font-medium',
                'hover:bg-primary/15',
              ]
            )}
          >
            <div className='flex items-center gap-2'>
              {Icon && (
                <span
                  className={`h-4 w-4 p-0.5 rounded-md flex items-center justify-center ${useIconThemeColor(item.href)}`}
                >
                  <Icon className='h-2.5 w-2.5 text-white' />
                </span>
              )}
              <span>{item.label}</span>
            </div>
            <ChevronRight
              className={cn(
                'h-3.5 w-3.5 transition-all',
                'opacity-50 group-hover:opacity-70',
                isActive && 'text-primary'
              )}
            />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            className={cn(
              'min-w-[180px]',
              'p-1',
              'animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=right]:slide-in-from-left-1'
            )}
          >
            {filteredDropdown.map((subItem, subIndex) =>
              renderDropdownItem(subItem, subIndex)
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      )
    }

    return (
      <DropdownMenuItem key={index} asChild>
        <Link
          to={item.href}
          className={cn(
            'flex items-center gap-2 w-full',
            'px-3 py-2 text-xs',
            'transition-all duration-200',
            'group',
            'hover:bg-accent/50',
            isActive && [
              'bg-primary/10',
              'text-primary',
              'font-medium',
              'hover:bg-primary/15',
            ]
          )}
          onClick={(e) => handleLinkClick(e, item.href)}
        >
          {Icon && (
            <span
              className={`h-4 w-4 p-0.5 rounded-md flex items-center justify-center ${useIconThemeColor(item.href)}`}
            >
              <Icon className='h-2.5 w-2.5 text-white' />
            </span>
          )}
          <span>{item.label}</span>
        </Link>
      </DropdownMenuItem>
    )
  }

  const filteredItems = items.filter(hasItemPermission)

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
            {filteredItems.map((item, index) => {
              const Icon = item.icon && Icons[item.icon as keyof typeof Icons]

              if (item.dropdown) {
                const filteredDropdown = item.dropdown.filter(hasItemPermission)
                if (filteredDropdown.length === 0) {
                  return null
                }

                return (
                  <DropdownMenu
                    key={index}
                    open={openDropdown === item.label}
                    onOpenChange={(open) =>
                      setOpenDropdown(open ? item.label : null)
                    }
                  >
                    <DropdownMenuTrigger
                      className={cn(
                        'flex items-center gap-2',
                        'px-2 py-1.5 text-xs font-medium',
                        'transition-all duration-200 ease-in-out',
                        'hover:text-white/90 focus:outline-none',
                        'group relative',
                        isItemActive(item.href, item.dropdown)
                          ? 'text-white font-semibold'
                          : 'text-white/70'
                      )}
                    >
                      {Icon && (
                        <span
                          className={`h-4 w-4 p-0.5 rounded-md flex items-center justify-center ${useIconThemeColor(item.href)}`}
                        >
                          <Icon className='h-2.5 w-2.5 text-white' />
                        </span>
                      )}
                      <span>{item.label}</span>
                      <ChevronDown className='h-3.5 w-3.5 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align='start'
                      className={cn(
                        'min-w-[220px]',
                        'p-1',
                        'animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1',
                        'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
                        'border border-border/50',
                        'shadow-lg shadow-black/10'
                      )}
                    >
                      {filteredDropdown.map((dropdownItem, dropdownIndex) =>
                        renderDropdownItem(dropdownItem, dropdownIndex)
                      )}
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
                  onClick={(e) => handleLinkClick(e, item.href)}
                >
                  {Icon && (
                    <span
                      className={`h-4 w-4 p-0.5 rounded-md flex items-center justify-center ${useIconThemeColor(item.href)}`}
                    >
                      <Icon className='h-2.5 w-2.5 text-white' />
                    </span>
                  )}
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
