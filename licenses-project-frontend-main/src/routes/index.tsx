import { Suspense, lazy, useEffect } from 'react'
import { HeaderNavProvider } from '@/contexts/header-nav-context'
import AdminDashboard from '@/pages/administracao/admin'
import AdministracaoRouter from '@/pages/administracao/administracao-router'
import AdministratorDashboard from '@/pages/administracao/administrator'
import AplicacoesPage from '@/pages/application/aplicacoes'
import AppUpdatesPage from '@/pages/application/app-updates'
import AreasPage from '@/pages/application/areas'
import FuncionalidadesPage from '@/pages/application/funcionalidades'
import ModulosPage from '@/pages/application/modulos'
import NotFound from '@/pages/not-found'
import ClientesPage from '@/pages/platform/clientes'
import LicencasPage from '@/pages/platform/licencas'
import LicencasAdminPage from '@/pages/platform/licencas-admin'
import PerfisAdminPage from '@/pages/platform/perfis-admin'
import UtilizadoresPage from '@/pages/platform/utilizadores'
import UtilizadoresAdminPage from '@/pages/platform/utilizadores-admin'
import ProfilePage from '@/pages/profile'
import VersionPage from '@/pages/version'
import { Navigate, Outlet, useRoutes, useNavigate } from 'react-router-dom'
import { useNavigationStore } from '@/utils/navigation'
import ProtectedRoute from '@/components/auth/protected-route'
import RoleProtectedRoute from '@/components/auth/role-protected-route'
import RoleRouter from '@/components/auth/role-router'

const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
)
const SignInPage = lazy(() => import('@/pages/auth/signin'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/reset-password'))
const DashboardPage = lazy(() => import('@/pages/dashboard'))

// ----------------------------------------------------------------------

export default function AppRouter() {
  const navigate = useNavigate()

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
      path: '/resetpassword',
      element: <ResetPasswordPage />,
    },
    {
      path: '/version',
      element: <VersionPage />,
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <HeaderNavProvider>
            <DashboardLayout>
              <Suspense>
                <Outlet />
              </Suspense>
            </DashboardLayout>
          </HeaderNavProvider>
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <RoleRouter
              routes={{
                administrator: <DashboardPage />,
                admin: <Navigate to='/administracao' replace />,
              }}
            />
          ),
        },
        {
          path: 'dashboard',
          element: <DashboardPage />,
        },
        {
          path: 'administracao',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator', 'admin']}>
              <AdministracaoRouter />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/areas',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator']}>
              <AreasPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/aplicacoes',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator']}>
              <AplicacoesPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/aplicacoes/:aplicacaoId/updates',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator', 'root']}>
              <AppUpdatesPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/modulos',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator']}>
              <ModulosPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/funcionalidades',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator']}>
              <FuncionalidadesPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/clientes',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator']}>
              <ClientesPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/licencas',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator']}>
              <LicencasPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/utilizadores',
          element: (
            <RoleProtectedRoute allowedRoles={['administrator']}>
              <UtilizadoresPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/administrator',
          element: <AdministratorDashboard />,
        },
        {
          path: 'administracao/admin',
          element: <AdminDashboard />,
        },
        {
          path: 'administracao/licencas/admin',
          element: (
            <RoleProtectedRoute allowedRoles={['admin']}>
              <LicencasAdminPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/perfis/admin',
          element: (
            <RoleProtectedRoute allowedRoles={['admin']}>
              <PerfisAdminPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'administracao/utilizadores/admin',
          element: (
            <RoleProtectedRoute allowedRoles={['admin']}>
              <UtilizadoresAdminPage />
            </RoleProtectedRoute>
          ),
        },
        {
          path: 'platform/profile',
          element: <ProfilePage />,
        },
      ],
    },
    {
      path: '/404',
      element: <NotFound />,
    },
    {
      path: '*',
      element: <Navigate to='/login' replace />,
    },
  ])

  return routes
}
