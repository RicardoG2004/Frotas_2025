import { Suspense, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HeaderNavProvider } from '@/contexts/header-nav-context'
import ThemeProvider from '@/providers/theme-provider'
import { useRouter } from '@/routes/hooks'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { SidebarProvider } from '@/hooks/use-sidebar'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'

export const queryClient = new QueryClient()

const ErrorFallback = ({ error }: FallbackProps) => {
  const router = useRouter()
  console.log('error', error)
  return (
    <div
      className='flex h-screen w-screen flex-col items-center  justify-center text-red-500'
      role='alert'
    >
      <h2 className='text-2xl font-semibold'>
        Ooops, something went wrong :({' '}
      </h2>
      <pre className='text-2xl font-bold'>{error.message}</pre>
      <pre>{error.stack}</pre>
      <Button className='mt-4' onClick={() => router.back()}>
        Go back
      </Button>
    </div>
  )
}

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoaded } = useAuthStore()

  useEffect(() => {
    // Force auth state to be loaded on app start
    if (!isLoaded) {
      useAuthStore.getState().decodeToken()
    }
  }, [isLoaded])

  return (
    <Suspense>
      <HelmetProvider>
        <BrowserRouter>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools />
              <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
                <SidebarProvider>
                  <HeaderNavProvider>
                    {children}
                    <Toaster />
                  </HeaderNavProvider>
                </SidebarProvider>
              </ThemeProvider>
            </QueryClientProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </HelmetProvider>
    </Suspense>
  )
}
