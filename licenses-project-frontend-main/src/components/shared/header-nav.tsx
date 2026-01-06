import * as React from 'react'
import { useHeaderNav } from '@/contexts/header-nav-context'
import { MenuItem } from '@/types/navigation/menu.types'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from '@/assets/logo-letters'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { useHeaderMenu } from '@/hooks/use-header-menu'
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
import { ModeToggle } from '@/components/shared/theme-toggle'
import UserNav from '@/components/shared/user-nav'
import { SecondaryNav } from './secondary-nav'

export function HeaderNav() {
  const location = useLocation()
  const { currentMenu, setActiveMenuItem, activeMenuItem } = useHeaderNav()
  const menuItems = useHeaderMenu(currentMenu) as MenuItem[]
  const roleId = useAuthStore((state) => state.roleId)
  const role = roleId?.toLowerCase()

  const isItemActive = (href: string, items?: MenuItem[]) => {
    // For menu items with subitems
    if (items) {
      return items.some(
        (subItem) =>
          location.pathname === subItem.href ||
          location.pathname.startsWith(subItem.href + '/')
      )
    }

    // Exact match first
    if (location.pathname === href) return true

    // Check if pathname starts with href (for nested routes)
    if (href !== '/' && location.pathname.startsWith(href + '/')) return true

    // For administration menu parent items, check role-specific paths
    // Only apply this check for parent menu items, not specific sub-routes
    if (
      href === '/administracao' &&
      location.pathname.startsWith(`/administracao/${role}`)
    ) {
      return true
    }

    return false
  }

  const handleMenuItemClick = (item: MenuItem, isDropdownTrigger?: boolean) => {
    // Don't modify secondary menu state if just opening a dropdown
    if (isDropdownTrigger) return

    if (item.secondaryMenu) {
      setActiveMenuItem({
        label: item.label,
        href: item.href,
        items: item.secondaryMenu,
      })
    } else if (item.items) {
      // If the item has items but no secondary menu, just clear the secondary nav
      setActiveMenuItem(null)
    } else {
      // If the item has no items and no secondary menu, clear it
      setActiveMenuItem(null)
    }
  }

  return (
    <div>
      <div className='border-b bg-background'>
        <div className='flex h-16 items-center px-4'>
          <div className='mr-6 flex items-center space-x-2'>
            <Logo width={95} className='text-primary' disableLink />
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.map((item, index) => (
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
                          {item.icon && (
                            <span className='h-4 w-4'>
                              {React.createElement(Icons[item.icon], {
                                className: 'h-4 w-4',
                              })}
                            </span>
                          )}
                          {item.label}
                        </div>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                          {item.items.map((subItem, subIndex) => (
                            <ListItem
                              key={subIndex}
                              title={subItem.label}
                              to={subItem.href}
                              icon={subItem.icon as keyof typeof Icons}
                              className={cn(
                                isItemActive(subItem.href) &&
                                  'bg-accent text-accent-foreground'
                              )}
                              onClick={() => handleMenuItemClick(subItem)}
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
                      >
                        <div className='flex items-center gap-2'>
                          {item.icon && (
                            <span className='h-4 w-4'>
                              {React.createElement(Icons[item.icon], {
                                className: 'h-4 w-4',
                              })}
                            </span>
                          )}
                          {item.label}
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <div className='ml-auto flex items-center space-x-4'>
            {/* {isMinimized && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggle}
                className="mr-2"
              >
                <ChevronsLeft className="h-[1.2rem] w-[1.2rem] rotate-180" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            )} */}
            <ModeToggle />
            <UserNav />
          </div>
        </div>
      </div>
      {activeMenuItem?.items && activeMenuItem.items.length > 0 && (
        <SecondaryNav items={activeMenuItem.items} />
      )}
    </div>
  )
}
