'use client'

import { useHeaderNav } from '@/contexts/header-nav-context'
import { ChevronsLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LogoLumaAdapt } from '@/assets/logo-luma-adapt'
import { useWindowsStore } from '@/stores/use-windows-store'
import { cn } from '@/lib/utils'
import { useMenuItems } from '@/hooks/use-menu-items'
import { useSidebar } from '@/hooks/use-sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DashboardNav } from '@/components/shared/dashboard-nav'

type SidebarProps = {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar()
  const menuItems = useMenuItems()
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
    // Navigate to dashboard
    navigate('/')
  }

  return (
    <nav
      className={cn(
        'relative z-10 hidden h-screen flex-none',
        'bg-background/60 backdrop-blur-xl',
        'border-r border-border/40',
        'shadow-sm shadow-border/5',
        'hover:shadow-md hover:shadow-border/10',
        'md:block transition-all duration-300 ease-in-out',
        !isMinimized ? 'w-72 px-6' : 'w-[70px]',
        className
      )}
    >
      <div
        className={cn(
          'flex h-20 items-center',
          isMinimized ? 'justify-center' : 'justify-between',
          'transition-all duration-300',
          'border-b border-border/30',
          !isMinimized ? '-mx-6 px-6' : '',
          'bg-primary/5'
        )}
      >
        <div
          className={cn(
            'flex items-center',
            'transition-all duration-300',
            isMinimized
              ? [
                  'cursor-pointer',
                  'w-full',
                  'hover:bg-white/10 dark:hover:bg-white/5',
                  'active:bg-white/15 dark:active:bg-white/10',
                  'flex justify-center',
                  'py-2',
                ]
              : [
                  'cursor-pointer',
                  'hover:opacity-90',
                  'transition-opacity',
                  'px-3',
                  'py-2',
                  'rounded-lg',
                  'group',
                ]
          )}
          onClick={isMinimized ? toggle : handleLogoClick}
          role={isMinimized ? 'button' : 'button'}
          aria-label={isMinimized ? 'Expand sidebar' : 'Go to dashboard'}
        >
          <LogoLumaAdapt
            width={isMinimized ? 32 : 95}
            className={cn(
              'text-primary',
              'transition-all duration-300',
              isMinimized
                ? [
                    'scale-90',
                    'opacity-90',
                    'hover:scale-100',
                    'hover:opacity-100',
                  ]
                : ['group-hover:scale-[0.98]', 'group-hover:opacity-90']
            )}
            disableLink={true}
          />
        </div>
        {!isMinimized && (
          <button
            className={cn(
              'flex items-center justify-center',
              'h-9 w-9',
              'rounded-lg',
              'border border-input',
              'bg-background',
              'hover:bg-accent hover:text-accent-foreground',
              'text-muted-foreground',
              'transition-all duration-200',
              'hover:scale-105 active:scale-95',
              'shadow-sm'
            )}
            onClick={toggle}
            aria-label='Minimize sidebar'
          >
            <ChevronsLeft className='size-5' />
          </button>
        )}
      </div>

      <ScrollArea
        className={cn('h-[calc(100vh-5rem)]', 'transition-all duration-300')}
      >
        <div className={cn('space-y-4 py-4', !isMinimized ? 'px-2' : 'px-0')}>
          <div className='space-y-1'>
            <DashboardNav items={menuItems} />
          </div>
        </div>
      </ScrollArea>
    </nav>
  )
}
