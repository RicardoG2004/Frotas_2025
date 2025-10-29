import { roleHeaderMenus } from '@/config/menu-items'

type IconTheme = 'colorful' | 'theme-color' | 'pastel' | 'vibrant' | 'neon'

export function getMenuColor(path: string): string {
  // Check frotas menu items
  const frotasMenu = roleHeaderMenus.client.frotas?.[0]?.items || []

  for (const item of frotasMenu) {
    if (item.href === path && 'color' in item && item.color) {
      return item.color as string
    }
  }

  // Check utilitarios menu items (including dropdown items)
  const utilitariosMenu =
    roleHeaderMenus.client.utilitarios?.[0]?.secondaryMenu || []

  for (const section of utilitariosMenu) {
    if (section.dropdown) {
      for (const dropdownItem of section.dropdown) {
        if (
          dropdownItem.href === path &&
          'color' in dropdownItem &&
          dropdownItem.color
        ) {
          return dropdownItem.color as string
        }
      }
    }
  }

  // Default color if not found
  return 'bg-gray-500'
}

export function getMenuColorByTheme(path: string, theme: IconTheme): string {
  // Check frotas menu items
  const frotasMenu = roleHeaderMenus.client.frotas?.[0]?.items || []

  for (const item of frotasMenu) {
    if (item.href === path && 'colors' in item && item.colors) {
      return item.colors[theme] || item.colors['colorful'] || 'bg-gray-500'
    }
    // Fallback to old color system
    if (item.href === path && 'color' in item && item.color) {
      return item.color as string
    }
  }

  // Check utilitarios menu items (including dropdown items)
  const utilitariosMenu =
    roleHeaderMenus.client.utilitarios?.[0]?.secondaryMenu || []

  for (const section of utilitariosMenu) {
    if (section.dropdown) {
      for (const dropdownItem of section.dropdown) {
        if (
          dropdownItem.href === path &&
          'colors' in dropdownItem &&
          dropdownItem.colors
        ) {
          return (
            dropdownItem.colors[theme] ||
            dropdownItem.colors['colorful'] ||
            'bg-gray-500'
          )
        }
        // Fallback to old color system
        if (
          dropdownItem.href === path &&
          'color' in dropdownItem &&
          dropdownItem.color
        ) {
          return dropdownItem.color as string
        }
      }
    }
  }

  // Default color if not found
  return 'bg-gray-500'
}

export function getMenuColorByLabel(label: string): string {
  // Check frotas menu items
  const frotasMenu = roleHeaderMenus.client.frotas?.[0]?.items || []

  for (const item of frotasMenu) {
    if (item.label === label && 'color' in item && item.color) {
      return item.color as string
    }
  }

  // Check utilitarios menu items (including dropdown items)
  const utilitariosMenu =
    roleHeaderMenus.client.utilitarios?.[0]?.secondaryMenu || []

  for (const section of utilitariosMenu) {
    if (section.dropdown) {
      for (const dropdownItem of section.dropdown) {
        if (
          dropdownItem.label === label &&
          'color' in dropdownItem &&
          dropdownItem.color
        ) {
          return dropdownItem.color as string
        }
      }
    }
  }

  // Default color if not found
  return 'bg-gray-500'
}
