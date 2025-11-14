import { roleHeaderMenus } from '@/config/menu-items'

type IconTheme = 'colorful' | 'theme-color' | 'pastel' | 'vibrant' | 'neon'

const getHeaderMenuSections = <T extends { items?: unknown[] }>(
  sections: T[] | undefined | null
) => sections ?? []

const getHeaderMenuDropdowns = <
  T extends { secondaryMenu?: { dropdown?: unknown[] }[] }
>(
  sections: T[] | undefined | null
) => sections ?? []

export function getMenuColor(path: string): string {
  // Check all frotas menu sections
  const frotasSections = getHeaderMenuSections(roleHeaderMenus.client.frotas)

  for (const section of frotasSections) {
    const items = (section as { items?: { href: string; color?: string }[] })
      .items
    if (!items) continue

    for (const item of items) {
      if (item.href === path && 'color' in item && item.color) {
        return item.color as string
      }
    }
  }

  // Check utilitarios menu items (including dropdown items)
  const utilitariosSections = getHeaderMenuDropdowns(
    roleHeaderMenus.client.utilitarios
  )

  for (const section of utilitariosSections) {
    if (!section.secondaryMenu) continue

    for (const secondaryItem of section.secondaryMenu) {
      if (secondaryItem.dropdown) {
        for (const dropdownItem of secondaryItem.dropdown) {
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
  }

  // Default color if not found
  return 'bg-gray-500'
}

export function getMenuColorByTheme(path: string, theme: IconTheme): string {
  // Check all frotas menu sections
  const frotasSections = getHeaderMenuSections(roleHeaderMenus.client.frotas)

  for (const section of frotasSections) {
    const items = (section as {
      items?: {
        href: string
        colors?: Record<string, string>
        color?: string
      }[]
    }).items
    if (!items) continue

    for (const item of items) {
      if (item.href !== path) continue

      if ('colors' in item && item.colors) {
        return item.colors[theme] || item.colors['colorful'] || 'bg-gray-500'
      }
      if ('color' in item && item.color) {
        return item.color as string
      }
    }
  }

  // Check utilitarios menu dropdown items
  const utilitariosSections = getHeaderMenuDropdowns(
    roleHeaderMenus.client.utilitarios
  )

  for (const section of utilitariosSections) {
    if (!section.secondaryMenu) continue

    for (const secondaryItem of section.secondaryMenu) {
      if (!secondaryItem.dropdown) continue

      for (const dropdownItem of secondaryItem.dropdown) {
        if (dropdownItem.href !== path) continue

        if ('colors' in dropdownItem && dropdownItem.colors) {
          return (
            dropdownItem.colors[theme] ||
            dropdownItem.colors['colorful'] ||
            'bg-gray-500'
          )
        }
        if ('color' in dropdownItem && dropdownItem.color) {
          return dropdownItem.color as string
        }
      }
    }
  }

  // Default color if not found
  return 'bg-gray-500'
}

export function getMenuColorByLabel(label: string): string {
  // Check all frotas menu sections
  const frotasSections = getHeaderMenuSections(roleHeaderMenus.client.frotas)

  for (const section of frotasSections) {
    const items = (section as { items?: { label?: string; color?: string }[] })
      .items
    if (!items) continue

    for (const item of items) {
      if (item.label === label && 'color' in item && item.color) {
        return item.color as string
      }
    }
  }

  // Check utilitarios menu items (including dropdown items)
  const utilitariosSections = getHeaderMenuDropdowns(
    roleHeaderMenus.client.utilitarios
  )

  for (const section of utilitariosSections) {
    if (!section.secondaryMenu) continue

    for (const secondaryItem of section.secondaryMenu) {
      if (!secondaryItem.dropdown) continue

      for (const dropdownItem of secondaryItem.dropdown) {
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
