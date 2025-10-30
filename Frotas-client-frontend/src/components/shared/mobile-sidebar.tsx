import { Dispatch, SetStateAction, useState } from 'react'
import { useHeaderNav } from '@/contexts/header-nav-context'
import { MenuItem } from '@/types/navigation/menu.types'
import { ChevronRight } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogoLumaAdapt } from '@/assets/logo-luma-adapt'
import { useWindowsStore } from '@/stores/use-windows-store'
import { cn } from '@/lib/utils'
import { useHeaderMenu } from '@/hooks/use-header-menu'
import { useMobileMenuItems } from '@/hooks/use-mobile-menu-items'
import { Icons } from '@/components/ui/icons'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { HeaderMemoryMonitor } from './header-memory-monitor'
import { ModeToggle } from './theme-toggle'
import UserNav from './user-nav'

type TMobileSidebarProps = {
  className?: string
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  sidebarOpen: boolean
}

type ExpandedMenus = {
  [key: string]: boolean
}

export default function MobileSidebar({
  setSidebarOpen,
  sidebarOpen,
}: TMobileSidebarProps) {
  const menuItems = useMobileMenuItems()
  const [expandedMenus, setExpandedMenus] = useState<ExpandedMenus>({})
  const location = useLocation()
  const navigate = useNavigate()
  const { setActiveMenuItem, setCurrentMenu } = useHeaderNav()
  const { windows, minimizeWindow } = useWindowsStore()

  const handleLogoClick = () => {
    // Reset navigation state when clicking the logo
    setActiveMenuItem(null)
    setCurrentMenu('dashboard')
    // Minimize all windows and clear active window since dashboard is not managed as a window
    windows.forEach((window) => {
      if (!window.isMinimized) {
        minimizeWindow(window.id)
      }
    })
    useWindowsStore.setState({ activeWindow: null })
    // Close mobile sidebar
    setSidebarOpen(false)
    // Navigate to dashboard
    navigate('/')
  }

  const isItemActive = (href: string, items?: MenuItem[]) => {
    // For menu items with subitems
    if (items) {
      const hasActiveChild = items.some((subItem) => {
        // Check direct match with subitems
        const isDirectMatch = location.pathname === subItem.href

        // Check nested items (for dropdown menus)
        const hasNestedMatch = subItem.secondaryMenu?.some((secondary) =>
          secondary.dropdown?.some(
            (dropdownItem) => location.pathname === dropdownItem.href
          )
        )

        return isDirectMatch || hasNestedMatch
      })

      return hasActiveChild
    }

    // For exact matches, return true immediately
    if (location.pathname === href) {
      return true
    }

    // Split paths into segments for comparison
    const currentPathSegments = location.pathname.split('/').filter(Boolean)
    const hrefSegments = href.split('/').filter(Boolean)

    // For parent routes, we need to be more specific about the relationship
    if (href !== '/' && currentPathSegments.length > hrefSegments.length) {
      // Check if all segments of the href match the corresponding segments in the current path
      const isParentMatch = hrefSegments.every(
        (segment, index) => segment === currentPathSegments[index]
      )

      // Only consider it a match if the next segment after the parent path
      // is not a sibling route (i.e., it's a true child route)
      if (isParentMatch) {
        const nextSegment = currentPathSegments[hrefSegments.length]

        // Dynamic sibling route detection
        // If we're at a level where we have sibling routes (like in cemiterios/configuracoes/sepulturas)
        // and the next segment is at the same level as other routes, treat it as a sibling
        if (nextSegment) {
          // Check if this is a sibling route by looking at the current path structure
          // For example: cemiterios/configuracoes/sepulturas/proprietarios vs cemiterios/configuracoes/sepulturas/tipos
          // Both 'proprietarios' and 'tipos' are siblings at the same level
          const currentPathWithoutLastSegment = currentPathSegments
            .slice(0, -1)
            .join('/')
          const hrefPath = hrefSegments.join('/')

          // If the current path without the last segment matches the href exactly,
          // and we have an additional segment, it's likely a sibling route
          if (currentPathWithoutLastSegment === hrefPath) {
            return false
          }
        }

        return true
      }
    }

    return false
  }

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }))
  }

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    const headerMenuItems =
      depth === 0 ? useHeaderMenu(item.label.toLowerCase()) : []
    const hasSubItems =
      headerMenuItems.length > 0 ||
      (item.items && item.items.length > 0) ||
      (item.secondaryMenu && item.secondaryMenu.length > 0)

    const menuId = `${item.label}-${depth}`
    const Icon = item.icon && Icons[item.icon]
    const isExpanded = expandedMenus[menuId]

    return (
      <div
        key={menuId}
        className={cn(
          'group relative',
          depth > 0 && 'ml-3 border-l border-border/40 pl-3',
          'animate-in fade-in-50 duration-200'
        )}
      >
        {hasSubItems ? (
          <>
            <button
              onClick={() => toggleMenu(menuId)}
              className={cn(
                'flex w-full items-center justify-between',
                'rounded-md px-4 py-3',
                'text-sm font-medium',
                'transition-all duration-200',
                'hover:bg-accent/50 active:bg-accent/70',
                'text-foreground/70 hover:text-foreground',
                isExpanded && 'bg-accent/30 text-foreground',
                isItemActive(item.href, item.items) &&
                  'bg-primary/10 text-primary hover:bg-primary/15'
              )}
            >
              <div className='flex items-center gap-2'>
                {Icon && (
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isExpanded || isItemActive(item.href, item.items)
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  />
                )}
                <span className='truncate'>{item.label}</span>
              </div>
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-all duration-200',
                  isExpanded
                    ? 'rotate-90 text-primary'
                    : 'text-muted-foreground',
                  'group-hover:text-foreground'
                )}
              />
            </button>
            {isExpanded && (
              <div className='mt-1 space-y-1 animate-in slide-in-from-left-2'>
                {headerMenuItems.map((headerItem) =>
                  renderMenuItem(headerItem, depth + 1)
                )}
                {item.items?.map((subItem) =>
                  renderMenuItem(subItem, depth + 1)
                )}
                {item.secondaryMenu?.map((subItem) =>
                  renderMenuItem(subItem, depth + 1)
                )}
              </div>
            )}
          </>
        ) : (
          <Link
            to={item.href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              'flex w-full items-center gap-3',
              'rounded-md px-4 py-3',
              'text-sm font-medium',
              'transition-all duration-200',
              'hover:bg-accent/50 active:bg-accent/70',
              'text-foreground/70 hover:text-foreground',
              'group-hover:translate-x-1',
              isItemActive(item.href) &&
                'bg-primary/10 text-primary hover:bg-primary/15'
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  'h-4 w-4 transition-colors',
                  isItemActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-primary'
                )}
              />
            )}
            <span className='truncate'>{item.label}</span>
          </Link>
        )}
      </div>
    )
  }

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent
        side='left'
        className={cn(
          'w-[300px] p-0',
          'bg-background/95 backdrop-blur-sm',
          'border-r shadow-lg'
        )}
      >
        <SheetHeader className='sr-only'>
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            Application navigation menu for mobile devices
          </SheetDescription>
        </SheetHeader>

        <div className='flex h-full flex-col'>
          <div className='border-b bg-card/30'>
            <div className='flex items-center justify-between p-4'>
              <div
                className='flex items-center gap-2 transition-opacity hover:opacity-80 cursor-pointer'
                onClick={handleLogoClick}
              >
                <LogoLumaAdapt
                  width={95}
                  className='text-primary'
                  disableLink
                />
              </div>
            </div>
          </div>
          <div className='flex-1 overflow-y-auto'>
            <div className='space-y-1 p-3'>
              {menuItems.map((item) =>
                renderMenuItem({
                  ...item,
                  label: item.label || item.title || '',
                  href: item.href || '',
                  items: item.items?.map((subItem) => ({
                    ...subItem,
                    label: subItem.label || subItem.title || '',
                    href: subItem.href || '',
                  })),
                } as MenuItem)
              )}
            </div>
          </div>
          <div className='border-t bg-card/30 p-4'>
            <div className='flex items-center justify-between'>
              <UserNav />
              <div className='flex items-center space-x-2'>
                <HeaderMemoryMonitor />
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
