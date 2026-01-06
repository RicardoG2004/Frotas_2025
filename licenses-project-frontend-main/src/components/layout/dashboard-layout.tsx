import { useState } from 'react'
import { MenuIcon } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/hooks/use-sidebar'
import Header from '@/components/shared/header'
import { HeaderNav } from '@/components/shared/header-nav'
import MobileSidebar from '@/components/shared/mobile-sidebar'
import Sidebar from '@/components/shared/sidebar'
import { UpdateNotification } from '@/components/updates/update-notification'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const { isMinimized } = useSidebar()
  const updateInfo = useAuthStore((state) => state.updateInfo)

  return (
    <div className='flex h-screen overflow-hidden bg-secondary'>
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className='fixed left-0 z-30 hidden h-full md:block'>
        <Sidebar />
      </div>
      <div
        className={cn(
          'flex w-full flex-1 flex-col',
          isMinimized
            ? 'md:ml-[80px] md:w-[calc(100%-80px)]'
            : 'md:ml-[288px] md:w-[calc(100%-288px)]'
        )}
      >
        <div
          className={cn(
            'fixed left-0 right-0 top-0 z-20 hidden flex-col bg-background md:block',
            isMinimized ? 'md:ml-[80px]' : 'md:ml-[288px]'
          )}
        >
          <HeaderNav />
        </div>
        <div className='relative z-10 flex h-20 flex-shrink-0 md:hidden'>
          <button
            className='pl-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 xl:hidden'
            onClick={() => setSidebarOpen(true)}
          >
            <span className='sr-only'>Open sidebar</span>
            <MenuIcon className='h-6 w-6' aria-hidden='true' />
          </button>
          <Header />
        </div>
        <main className='relative flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-background md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl'>
          {updateInfo && (
            <div className='px-4 md:px-6 pt-4'>
              <UpdateNotification updateInfo={updateInfo} />
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
