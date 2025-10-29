import { useAuthStore } from '@/stores/auth-store'
import AdminDashboard from './admin'
import AdministratorDashboard from './administrator'

export default function AdministracaoRouter() {
  const roleId = useAuthStore((state) => state.roleId)
  const role = roleId?.toLowerCase()

  switch (role) {
    case 'administrator':
      return <AdministratorDashboard />
    case 'admin':
      return <AdminDashboard />
    default:
      return null
  }
}
