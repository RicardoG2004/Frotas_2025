import { roleHeaderMenus } from '@/config/menu-items'
import { MenuItem } from '@/types/navigation/menu.types'
import { useAuthStore } from '@/stores/auth-store'

export const useHeaderMenu = (currentMenu: string): MenuItem[] => {
  const roleId = useAuthStore((state) => state.roleId)
  const role = roleId?.toLowerCase() || 'guest'

  const menuItems =
    roleHeaderMenus[role as keyof typeof roleHeaderMenus] ||
    roleHeaderMenus.guest
  return menuItems[currentMenu as keyof typeof menuItems] || []
}
