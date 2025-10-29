import { Suspense, lazy, useEffect } from 'react'
import { DashboardPage } from '@/pages/dashboard'
import { NotFound } from '@/pages/not-found'
import { Navigate, Outlet, useNavigate, useRoutes } from 'react-router-dom'
import { useNavigationStore } from '@/utils/navigation'
import { useNavigationTracking } from '@/hooks/use-navigation-tracking'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { RoleRouter } from '@/components/auth/role-router'
import { utilitariosRoutes } from './base/utilitarios-routes'
import { cemiteriosRoutes } from './cemiterios/cemiterios-routes'

const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
)

const SignInPage = lazy(() => import('@/pages/auth/signin'))

// ----------------------------------------------------------------------

export default function AppRouter() {
  const navigate = useNavigate()

  // Track navigation history
  useNavigationTracking()

  useEffect(() => {
    useNavigationStore.getState().setNavigate(navigate)
  }, [navigate])

  const routes = useRoutes([
    {
      path: '/login',
      element: <SignInPage />,
      index: true,
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <RoleRouter
              routes={{
                client: <DashboardPage />,
              }}
            />
          ),
        },
        {
          path: 'dashboard',
          element: <DashboardPage />,
        },
        {
          path: '404',
          element: <NotFound />,
        },
        ...utilitariosRoutes,
        ...cemiteriosRoutes,
      ],
    },
    {
      path: '*',
      element: <Navigate to='/404' replace />,
    },
  ])

  return routes
}
