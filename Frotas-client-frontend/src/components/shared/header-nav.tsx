import * as React from 'react'
import { useHeaderNav } from '@/contexts/header-nav-context'
import { MenuItem } from '@/types/navigation/menu.types'
import { Link, useLocation, useNavigate } from 'react-router-dom'
// import { Logo } from '@/assets/logo-letters'
import { useAuthStore } from '@/stores/auth-store'
import { usePermissionsStore } from '@/stores/permissions-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { cn } from '@/lib/utils'
import { shouldManageWindow } from '@/utils/window-utils'
import { useHeaderMenu } from '@/hooks/use-header-menu'
import { useTheme } from '@/providers/theme-provider'
import { createIconGradient } from '@/lib/icon-gradient'
import { getMenuColorByTheme } from '@/utils/menu-colors'
import { Icons } from '@/components/ui/icons'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { ListItem } from '@/components/ui/navigation-menu-item'
import { AppOptionsDrawer } from '@/components/shared/app-options-drawer'
import { HeaderMemoryMonitor } from '@/components/shared/header-memory-monitor'
import { ModeToggle } from '@/components/shared/theme-toggle'
import UserNav from '@/components/shared/user-nav'
import { SecondaryNav } from './secondary-nav'

export function HeaderNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentMenu, setActiveMenuItem, activeMenuItem, setCurrentMenu } =
    useHeaderNav()
  const menuItems = useHeaderMenu(currentMenu) as MenuItem[]
  const roleId = useAuthStore((state) => state.roleId)
  const role = roleId?.toLowerCase()
  const { hasPermission } = usePermissionsStore()
  const { windows, minimizeWindow } = useWindowsStore()
  const { iconTheme } = useTheme()

  const hasItemPermission = (item: MenuItem): boolean => {
    if (item.funcionalidadeId) {
      return hasPermission(item.funcionalidadeId, 'AuthVer')
    }
    return true
  }

  const filteredMenuItems = menuItems.filter(hasItemPermission)

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

    // For administration menu, check role-specific paths
    if (href.includes('administracao')) {
      return location.pathname === `/administracao/${role}`
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

  const handleMenuItemClick = (item: MenuItem, isDropdownTrigger?: boolean) => {
    // Don't modify secondary menu state if just opening a dropdown
    if (isDropdownTrigger) return

    // Check if we're already in the same section
    const currentPath = window.location.pathname
    const isInSameSection = currentPath.includes(item.href)

    // If this is a dropdown item (has a parent with items array), just clear the secondary nav
    if (!item.secondaryMenu?.length) {
      setActiveMenuItem(null)
      return
    }

    // Only show secondary nav if the item has a secondaryMenu
    if (item.secondaryMenu?.length && !isInSameSection) {
      const newActiveMenuItem = {
        label: item.label,
        href: item.href,
        items: item.secondaryMenu,
      }
      setActiveMenuItem(newActiveMenuItem)
    }
  }

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    // If this is a route that should manage windows, check if window already exists
    if (shouldManageWindow(href)) {
      e.preventDefault()
      
      const { windows, restoreWindow } = useWindowsStore.getState()
      
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
    // Navigate to dashboard
    navigate('/')
  }

  const getIconBackground = (
    path: string,
    index: number,
    total: number
  ): { className: string; style?: React.CSSProperties } => {
    if (iconTheme === 'colorful') {
      return {
        className: '',
        style: {
          borderRadius: 'var(--radius)',
          backgroundImage: createIconGradient(index, total),
        },
      }
    }

    return {
      className: getMenuColorByTheme(path, iconTheme),
      style: { borderRadius: 'var(--radius)' },
    }
  }

  return (
    <div>
      <div className='border-b bg-background'>
        <div className='flex h-16 items-center px-4'>
          <div className='mr-6 flex items-center space-x-2'>
            <div
              className='cursor-pointer hover:opacity-80 transition-opacity'
              onClick={handleLogoClick}
              role='button'
              aria-label='Navigate to dashboard'
            >
              {/* <Logo width={95} className='text-primary' disableLink={true} /> */}
            </div>
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              {filteredMenuItems.map((item, index) => {
                const { className: topIconClass, style: topIconStyle } =
                  getIconBackground(item.href, index, filteredMenuItems.length)
                const filteredSubItems =
                  item.items?.filter(hasItemPermission) || []
                if (item.items && filteredSubItems.length === 0) {
                  return null
                }
                return (
                  <NavigationMenuItem key={index}>
                    {item.items ? (
                      <>
                        <NavigationMenuTrigger
                          triggerMode='click'
                          className={cn(
                            isItemActive(item.href, item.items) &&
                              'bg-accent text-accent-foreground'
                          )}
                          onClick={() => handleMenuItemClick(item, true)}
                        >
                          <div className='flex items-center gap-2'>
                            {item.icon && Icons[item.icon] && (
                              <span
                                className={cn(
                                  'h-5 w-5 p-0.5 rounded flex items-center justify-center text-white shadow',
                                  topIconStyle ? '' : topIconClass
                                )}
                                style={topIconStyle}
                              >
                                {React.createElement(
                                  Icons[item.icon] as React.ComponentType<any>,
                                  {
                                    className: 'h-3 w-3 text-white',
                                  }
                                )}
                              </span>
                            )}
                            {item.label}
                          </div>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                            {filteredSubItems.map((subItem, subIndex) => (
                              <ListItem
                                key={subIndex}
                                title={subItem.label}
                                to={subItem.href}
                                icon={subItem.icon as keyof typeof Icons}
                                iconBackgroundStyle={
                                  iconTheme === 'colorful'
                                    ? {
                                        borderRadius: 'var(--radius)',
                                        backgroundImage: createIconGradient(
                                          subIndex,
                                          filteredSubItems.length
                                        ),
                                      }
                                    : undefined
                                }
                                iconBackgroundClassName={
                                  iconTheme === 'colorful'
                                    ? ''
                                    : getMenuColorByTheme(
                                        subItem.href,
                                        iconTheme
                                      )
                                }
                                className={cn(
                                  isItemActive(subItem.href) &&
                                    'bg-accent text-accent-foreground'
                                )}
                                onClick={(e) => {
                                  handleLinkClick(e, subItem.href)
                                  handleMenuItemClick(subItem)
                                }}
                              >
                                <div className='flex items-center'>
                                  {subItem.description}
                                </div>
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link
                          to={item.href}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            isItemActive(item.href) &&
                              'bg-accent text-accent-foreground'
                          )}
                          onClick={(e) => handleLinkClick(e, item.href)}
                        >
                          <div className='flex items-center gap-2'>
                            {item.icon && Icons[item.icon] && (
                              <span
                                className={cn(
                                  'h-5 w-5 p-0.5 rounded flex items-center justify-center text-white shadow',
                                  topIconStyle ? '' : topIconClass
                                )}
                                style={topIconStyle}
                              >
                                {React.createElement(
                                  Icons[item.icon] as React.ComponentType<any>,
                                  {
                                    className: 'h-3 w-3 text-white',
                                  }
                                )}
                              </span>
                            )}
                            {item.label}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>
          <div className='ml-auto flex items-center space-x-2'>
            <AppOptionsDrawer />
            <ModeToggle />
            <HeaderMemoryMonitor />
            <UserNav />
          </div>
        </div>
      </div>
      {activeMenuItem &&
        (activeMenuItem.items || activeMenuItem.secondaryMenu) && (
          <SecondaryNav
            items={activeMenuItem.items || activeMenuItem.secondaryMenu || []}
          />
        )}
    </div>
  )
}
