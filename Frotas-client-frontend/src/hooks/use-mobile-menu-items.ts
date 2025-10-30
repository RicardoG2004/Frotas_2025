import { roleMenuItems, roleHeaderMenus } from '@/config/menu-items'
import { MenuItem } from '@/types/navigation/menu.types'
import { useAuthStore } from '@/stores/auth-store'

const mergeMenuItems = (
  baseItems: MenuItem[],
  headerMenus: Record<string, MenuItem[]>
) => {
  const mergedItems = baseItems.map((baseItem) => {
    const mergedItem = { ...baseItem }

    if (mergedItem.items) {
      mergedItem.items = mergedItem.items.map((subItem) => {
        const headerMenu = headerMenus[subItem.title?.toLowerCase() || '']
        if (headerMenu) {
          return {
            ...subItem,
            items: headerMenu.map((headerItem) => {
              // For mobile menu, we need to flatten the structure
              if (headerItem.secondaryMenu) {
                return {
                  ...headerItem,
                  items: headerItem.secondaryMenu.map((secondary) => ({
                    ...secondary,
                    items: secondary.dropdown || [],
                  })),
                  secondaryMenu: undefined,
                }
              }
              // For regular items, keep the structure as is
              return {
                ...headerItem,
                items: headerItem.items || [],
                secondaryMenu: headerItem.secondaryMenu || [],
                dropdown: headerItem.dropdown || [],
              }
            }),
          }
        }
        return subItem
      })
    }

    return mergedItem
  })

  return mergedItems
}

export const useMobileMenuItems = (): MenuItem[] => {
  const roleId = useAuthStore((state) => state.roleId)
  const role = roleId?.toLowerCase() || 'guest'

  const baseMenuItems = [
    ...(roleMenuItems[role as keyof typeof roleMenuItems] ||
      roleMenuItems.guest),
  ].map((item) => ({
    ...item,
    items: item.items
      ? item.items.map((subItem) => ({ ...subItem }))
      : undefined,
  })) as MenuItem[]

  const headerMenus =
    roleHeaderMenus[role as keyof typeof roleHeaderMenus] ||
    roleHeaderMenus.guest

  return mergeMenuItems(baseMenuItems, headerMenus)
}
