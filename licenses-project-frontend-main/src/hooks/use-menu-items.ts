import { roleMenuItems } from '@/config/menu-items'
import { NavItem } from '@/types/navigation/nav.types'
import { useAuthStore } from '@/stores/auth-store'

export const useMenuItems = (): NavItem[] => {
  const roleId = useAuthStore((state) => state.roleId)

  // Default to guest menu if no role or unknown role
  const role = roleId?.toLowerCase() || 'guest'

  // Get menu items for the role, fallback to guest menu
  return [
    ...(roleMenuItems[role as keyof typeof roleMenuItems] ||
      roleMenuItems.guest),
  ]
}
