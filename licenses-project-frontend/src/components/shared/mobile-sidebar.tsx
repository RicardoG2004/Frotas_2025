import { Dispatch, SetStateAction, useState } from 'react'
import { MenuItem } from '@/types/navigation/menu.types'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useHeaderMenu } from '@/hooks/use-header-menu'
import { useMenuItems } from '@/hooks/use-menu-items'
import { Icons } from '@/components/ui/icons'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

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
  const menuItems = useMenuItems()
  const [expandedMenus, setExpandedMenus] = useState<ExpandedMenus>({})

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }))
  }

  const renderMenuItem = (item: MenuItem, depth: number = 0) => {
    // Get header menu items if this is a top-level item
    const headerMenuItems =
      depth === 0 ? useHeaderMenu(item.label.toLowerCase()) : []
    const hasSubItems =
      headerMenuItems.length > 0 ||
      (item.items && item.items.length > 0) ||
      (item.secondaryMenu && item.secondaryMenu.length > 0)

    const menuId = `${item.label}-${depth}`
    const Icon = item.icon && Icons[item.icon]

    return (
      <div key={menuId} className={cn('space-y-1', depth > 0 && 'ml-4')}>
        {hasSubItems ? (
          <>
            <button
              onClick={() => toggleMenu(menuId)}
              className='flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent'
            >
              <div className='flex items-center gap-2'>
                {Icon && <Icon className='h-4 w-4' />}
                {item.label}
              </div>
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform',
                  expandedMenus[menuId] && 'rotate-90'
                )}
              />
            </button>
            {expandedMenus[menuId] && (
              <div className='pl-4'>
                {/* Render header menu items first */}
                {headerMenuItems.map((headerItem) =>
                  renderMenuItem(headerItem, depth + 1)
                )}
                {/* Then render regular menu items */}
                {item.items?.map((subItem) =>
                  renderMenuItem(subItem, depth + 1)
                )}
                {/* Finally render secondary menu items */}
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
            className='flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent'
          >
            {Icon && <Icon className='h-4 w-4' />}
            {item.label}
          </Link>
        )}
      </div>
    )
  }

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side='left' className='bg-background !px-0'>
        <SheetTitle className='sr-only'>Navigation Menu</SheetTitle>
        <SheetDescription className='sr-only'>
          Application navigation menu for mobile devices
        </SheetDescription>
        <div className='space-y-4 py-4'>
          <div className='px-3 py-2'>
            <Link
              to='/'
              className='mb-4 block px-2 py-2 text-2xl font-bold text-white'
            >
              Logo
            </Link>
            <div className='space-y-1'>
              {menuItems.map((item) =>
                renderMenuItem({
                  ...item,
                  label: item.title || '',
                  href: item.href || '',
                })
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
