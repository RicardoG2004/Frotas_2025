import React, { createContext, useContext, useState, useEffect } from 'react'
import { MenuItem } from '@/types/navigation/menu.types'
import { useLocation } from 'react-router-dom'
import { usePermissionsStore } from '@/stores/permissions-store'
import { useHeaderMenu } from '@/hooks/use-header-menu'
import { useMenuItems } from '@/hooks/use-menu-items'

interface HeaderNavContextType {
  currentMenu: string
  setCurrentMenu: (menu: string) => void
  activeMenuItem: MenuItem | null
  setActiveMenuItem: (item: MenuItem | null) => void
}

export const HeaderNavContext = createContext<HeaderNavContextType | undefined>(
  undefined
)

export function useHeaderNav() {
  const context = useContext(HeaderNavContext)
  if (!context) {
    throw new Error('useHeaderNav must be used within a HeaderNavProvider')
  }
  return context
}

export const HeaderNavProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentMenu, setCurrentMenu] = useState('')
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItem | null>(null)
  const location = useLocation()
  const menuItems = useMenuItems()
  const headerMenuItems = useHeaderMenu(currentMenu)
  const { permissions } = usePermissionsStore()

  const findActiveMenuItem = (pathname: string) => {
    if (!headerMenuItems?.length) return null

    for (const item of headerMenuItems) {
      if (pathname.startsWith(item.href)) {
        // Case 1: Direct items structure - only set if it has secondaryMenu
        if (item.items) {
          const hasSecondaryMenu = item.items.some(
            (item) => (item.secondaryMenu || []).length > 0
          )
          if (!hasSecondaryMenu) return null

          return {
            label: item.label,
            href: item.href,
            items: item.items.map((subItem) => ({
              ...subItem,
              dropdown: subItem.secondaryMenu?.[0]?.dropdown || [],
            })),
          }
        }

        // Case 2: Direct secondary menu structure
        if (item.secondaryMenu) {
          return {
            label: item.label,
            href: item.href,
            items: item.secondaryMenu,
          }
        }
      }

      // Check nested items
      if (item.items) {
        for (const subItem of item.items) {
          if (pathname.startsWith(subItem.href)) {
            if (subItem.secondaryMenu) {
              return {
                label: subItem.label,
                href: subItem.href,
                items: subItem.secondaryMenu,
              }
            }
          }
        }
      }
    }

    return null
  }

  // Update current menu based on location
  useEffect(() => {
    const determineCurrentMenu = (pathname: string): string => {
      // First check direct matches
      const directMatch = menuItems.find(
        (item) => pathname === item.href || pathname.startsWith(item.href + '/')
      )
      if (directMatch?.title) return directMatch.title

      // Then check nested items
      for (const item of menuItems) {
        if (item.items) {
          const nestedMatch = item.items.find(
            (subItem) =>
              pathname === subItem.href ||
              pathname.startsWith(subItem.href + '/')
          )
          if (nestedMatch?.title) return nestedMatch.title
        }
      }

      return 'dashboard'
    }

    const newCurrentMenu = determineCurrentMenu(location.pathname)
    setCurrentMenu(newCurrentMenu)
  }, [location.pathname, menuItems])

  // Update active menu item when location or permissions change
  useEffect(() => {
    const newActiveMenuItem = findActiveMenuItem(location.pathname)
    setActiveMenuItem(newActiveMenuItem)
  }, [location.pathname, headerMenuItems, permissions])

  return (
    <HeaderNavContext.Provider
      value={{
        currentMenu,
        setCurrentMenu,
        activeMenuItem,
        setActiveMenuItem,
      }}
    >
      {children}
    </HeaderNavContext.Provider>
  )
}
