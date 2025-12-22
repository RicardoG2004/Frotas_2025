'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { useHeaderNav } from '@/contexts/header-nav-context'
import { NavItem } from '@/types'
import { ChevronRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { shouldManageWindow } from '@/utils/window-utils'
import { useSidebar } from '@/hooks/use-sidebar'
import { Icons } from '@/components/ui/icons'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useWindowsStore } from '@/stores/use-windows-store'

interface DashboardNavProps {
  items: NavItem[]
  setOpen?: Dispatch<SetStateAction<boolean>>
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const { isMinimized, toggle } = useSidebar()
  const { setCurrentMenu, currentMenu, setActiveMenuItem } = useHeaderNav()
  const location = useLocation()
  const navigate = useNavigate()
  const { windows, restoreWindow } = useWindowsStore()
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  )

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }))
  }

  const handleMenuClick = (
    title: string | undefined,
    hasSubItems?: boolean
  ) => {
    const menuTitle = title?.toLowerCase() ?? ''
    if (menuTitle !== currentMenu) {
      setActiveMenuItem(null)
      setCurrentMenu(menuTitle)
    }
    if (setOpen) setOpen(false)

    // Auto-expand sidebar if minimized and item has subitems
    if (isMinimized && hasSubItems) {
      toggle()
    }
  }

  const isItemActive = (
    _itemTitle: string | undefined,
    itemHref: string,
    items?: NavItem[]
  ) => {
    const isExactMatch = location.pathname === itemHref
    const isNestedMatch = location.pathname.startsWith(itemHref + '/')
    const isChildActive = items?.some(
      (item) =>
        location.pathname === item.href ||
        location.pathname.startsWith(item.href + '/')
    )

    return isExactMatch || isNestedMatch || isChildActive
  }

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    // If this is a route that should manage windows, check if window already exists
    if (shouldManageWindow(href)) {
      e.preventDefault()
      
      // Check if there's already a window for this path (including minimized ones)
      // If multiple exist, get the most recently accessed one
      const existingWindows = windows.filter((w) => w.path === href)
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
        navigate(`${href}?${searchParams.toString()}`)
        return
      }
      
      // If no existing window, create a new one
      const instanceId = crypto.randomUUID()
      navigate(`${href}?instanceId=${instanceId}`)
      return
    }
  }

  const renderMenuItem = (item: NavItem, depth: number = 0) => {
    const Icon = item.icon
      ? Icons[item.icon] || Icons.arrowRight
      : Icons.arrowRight
    const hasSubItems = item.items && item.items.length > 0
    const menuId = `${item.title}-${depth}`
    const isExpanded = expandedMenus[menuId]

    return (
      <div
        key={menuId}
        className={cn(
          'space-y-1',
          depth > 0 && !isMinimized && 'ml-4',
          isMinimized && 'space-y-0.5'
        )}
      >
        {hasSubItems ? (
          <>
            <button
              onClick={() => {
                toggleMenu(menuId)
                if (isMinimized) toggle()
              }}
              className={cn(
                'sidebar-link relative',
                isItemActive(item.title, item.href, item.items) && 'active',
                isMinimized && 'justify-center px-0'
              )}
            >
              <div className='flex items-center gap-3'>
                <div className='icon-wrapper'>
                  <Icon
                    className={cn('size-4', isMinimized ? 'mx-auto' : 'ml-0')}
                  />
                </div>
                {!isMinimized && (
                  <span className='truncate'>{item.label || item.title}</span>
                )}
              </div>
              {!isMinimized && (
                <ChevronRight
                  className={cn(
                    'mr-2 h-4 w-4 transition-transform text-primary',
                    isExpanded && 'rotate-90'
                  )}
                />
              )}
            </button>
            {isExpanded && !isMinimized && (
              <div className='pl-4'>
                {item.items?.map((subItem) =>
                  renderMenuItem(subItem, depth + 1)
                )}
              </div>
            )}
          </>
        ) : (
          <Link
            to={item.disabled ? '/' : item.href}
            className={cn(
              'sidebar-nav-item',
              isItemActive(item.title, item.href, item.items) && 'active',
              item.disabled && 'cursor-not-allowed opacity-80',
              isMinimized && 'justify-center'
            )}
            onClick={(e) => {
              handleLinkClick(e, item.href)
              handleMenuClick(item.title, hasSubItems)
            }}
          >
            <div className='icon-wrapper'>
              <Icon
                className={cn('size-4', isMinimized ? 'mx-auto' : 'ml-0')}
              />
            </div>
            {!isMinimized && (
              <span className='truncate'>{item.label || item.title}</span>
            )}
          </Link>
        )}
      </div>
    )
  }

  if (!items?.length) {
    return null
  }

  return (
    <nav className={cn('grid items-start', isMinimized ? 'gap-1' : 'gap-2')}>
      <TooltipProvider>
        {items.map((item) => renderMenuItem(item))}
      </TooltipProvider>
    </nav>
  )
}
