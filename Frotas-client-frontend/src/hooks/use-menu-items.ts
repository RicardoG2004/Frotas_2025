import { useEffect, useState, useCallback } from 'react'
import { roleMenuItems } from '@/config/menu-items'
import { MenuItem } from '@/types/navigation/menu.types'
import { useAuthStore } from '@/stores/auth-store'
import { usePermissionsStore } from '@/stores/permissions-store'
import { PermissionFlag } from '@/stores/permissions-store'

const filterMenuItemsByPermission = (
  items: MenuItem[],
  hasPermission: (permissionId: string, flag: PermissionFlag) => boolean,
  hasModuleAccess: (moduleId: string) => boolean
): MenuItem[] => {
  return items.filter((item) => {
    // For main menu items (sidebar), only check moduloId
    if (item.moduloId) {
      // Only check if the module is licensed
      return hasModuleAccess(item.moduloId)
    }

    // For sub-items and other menu items, check funcionalidadeId
    if (item.funcionalidadeId) {
      // Check if user has at least AuthVer permission for this functionality
      if (!hasPermission(item.funcionalidadeId, 'AuthVer')) {
        return false
      }
    }

    // Recursively filter sub-items if they exist
    if (item.items) {
      item.items = filterMenuItemsByPermission(
        item.items,
        hasPermission,
        hasModuleAccess
      )
      // Remove the item if it has no visible sub-items
      if (item.items.length === 0) {
        return false
      }
    }

    // Recursively filter secondary menu items if they exist
    if (item.secondaryMenu) {
      item.secondaryMenu = filterMenuItemsByPermission(
        item.secondaryMenu,
        hasPermission,
        hasModuleAccess
      )
      // Remove the item if it has no visible secondary menu items
      if (item.secondaryMenu.length === 0) {
        return false
      }
    }

    // Handle dropdown items differently - show if any child has permission
    if (item.dropdown) {
      const filteredDropdown = filterMenuItemsByPermission(
        item.dropdown,
        hasPermission,
        hasModuleAccess
      )
      // Only keep the dropdown if at least one child is visible
      if (filteredDropdown.length > 0) {
        item.dropdown = filteredDropdown
        return true
      }
      return false
    }

    return true
  })
}

export const useMenuItems = (): MenuItem[] => {
  const roleId = useAuthStore((state) => state.roleId)
  const role = roleId?.toLowerCase() || 'guest'
  const hasPermission = usePermissionsStore((state) => state.hasPermission)
  const hasModuleAccess = usePermissionsStore((state) => state.hasModuleAccess)
  const permissions = usePermissionsStore((state) => state.permissions)
  const modules = usePermissionsStore((state) => state.modules)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  const updateMenuItems = useCallback(() => {
    // console.log('Updating menu items with permissions:', permissions)
    // console.log('Updating menu items with modules:', modules)
    const baseMenuItems = JSON.parse(
      JSON.stringify(
        roleMenuItems[role as keyof typeof roleMenuItems] || roleMenuItems.guest
      )
    )
    const filteredItems = filterMenuItemsByPermission(
      baseMenuItems,
      hasPermission,
      hasModuleAccess
    )
    setMenuItems(filteredItems)
  }, [role, permissions, modules, hasPermission, hasModuleAccess])

  useEffect(() => {
    updateMenuItems()
  }, [updateMenuItems])

  return menuItems
}
