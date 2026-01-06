import React, { createContext, useContext, useState, useEffect } from 'react'
import { MenuItem } from '@/types/navigation/menu.types'
import { useLocation } from 'react-router-dom'
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
  const [currentMenu, setCurrentMenu] = useState('dashboard')
  const [activeMenuItem, setActiveMenuItem] = useState<MenuItem | null>(null)
  const location = useLocation()
  const menuItems = useMenuItems()
  const headerMenuItems = useHeaderMenu(currentMenu)

  useEffect(() => {
    const determineCurrentMenu = (pathname: string) => {
      const matchingItem = menuItems.find(
        (item) => pathname === item.href || pathname.startsWith(item.href + '/')
      )
      return matchingItem?.title || 'dashboard'
    }

    const findActiveMenuItem = (pathname: string) => {
      if (!Array.isArray(headerMenuItems) || !headerMenuItems.length)
        return null

      for (const item of headerMenuItems) {
        if (item.items) {
          const matchingSubItem = item.items.find(
            (subItem) =>
              pathname === subItem.href ||
              pathname.startsWith(subItem.href + '/')
          )

          if (matchingSubItem?.secondaryMenu) {
            return {
              label: matchingSubItem.label,
              href: matchingSubItem.href,
              items: matchingSubItem.secondaryMenu,
            }
          }
        }
      }
      return null
    }

    const newMenu = determineCurrentMenu(location.pathname).toLowerCase()
    const newActiveMenuItem = findActiveMenuItem(location.pathname)

    // Only update if values are actually different
    if (currentMenu !== newMenu) {
      setCurrentMenu(newMenu)
    }

    const activeItemChanged =
      (!activeMenuItem && newActiveMenuItem) ||
      (activeMenuItem && !newActiveMenuItem) ||
      activeMenuItem?.href !== newActiveMenuItem?.href

    if (activeItemChanged) {
      setActiveMenuItem(newActiveMenuItem)
    }
  }, [location.pathname, menuItems, headerMenuItems]) // Removed currentMenu and activeMenuItem from dependencies

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
