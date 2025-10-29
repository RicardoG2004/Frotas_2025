'use client'

import { Dispatch, SetStateAction } from 'react'
import { useHeaderNav } from '@/contexts/header-nav-context'
import { NavItem } from '@/types'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/hooks/use-sidebar'
import { Icons } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface DashboardNavProps {
  items: NavItem[]
  setOpen?: Dispatch<SetStateAction<boolean>>
  isMobileNav?: boolean
}

export default function DashboardNav({
  items,
  setOpen,
  isMobileNav = false,
}: DashboardNavProps) {
  const { isMinimized } = useSidebar()
  const { setCurrentMenu, currentMenu, setActiveMenuItem } = useHeaderNav()
  const location = useLocation()

  const handleMenuClick = (title: string) => {
    if (title.toLowerCase() !== currentMenu) {
      setActiveMenuItem(null)
      setCurrentMenu(title.toLowerCase())
    }

    if (setOpen) setOpen(false)
  }

  const isItemActive = (_itemTitle: string, itemHref: string) => {
    // Check if current path exactly matches the item's href
    const isExactMatch = location.pathname === itemHref

    // Check if current path starts with item's href (for nested routes)
    const isNestedMatch = location.pathname.startsWith(itemHref + '/')

    return isExactMatch || isNestedMatch
  }

  if (!items?.length) {
    return null
  }

  // console.log('isActive', isMobileNav, isMinimized);

  return (
    <nav className='grid items-start gap-2'>
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || 'arrowRight']
          return (
            item.href && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.disabled ? '/' : item.href}
                    className={cn(
                      'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:text-muted-foreground',
                      isItemActive(item.title, item.href)
                        ? 'bg-white text-black hover:text-black'
                        : 'transparent',
                      item.disabled && 'cursor-not-allowed opacity-80'
                    )}
                    onClick={() => {
                      handleMenuClick(item.title)
                    }}
                  >
                    <Icon className={`ml-2.5 size-5`} />

                    {isMobileNav || (!isMinimized && !isMobileNav) ? (
                      <span className='mr-2 truncate'>
                        {item.label || item.title}
                      </span>
                    ) : (
                      ''
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  align='center'
                  side='right'
                  sideOffset={8}
                  className={!isMinimized ? 'hidden' : 'inline-block'}
                >
                  {item.label || item.title}
                </TooltipContent>
              </Tooltip>
            )
          )
        })}
      </TooltipProvider>
    </nav>
  )
}
