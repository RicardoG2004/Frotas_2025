import { IconKey } from '@/components/ui/icons'

export interface MenuItem {
  label: string
  href: string
  items?: MenuItem[]
  description?: string
  icon?: IconKey
  dropdown?: MenuItem[]
  secondaryMenu?: MenuItem[]
}

export interface HeaderMenu {
  [key: string]: MenuItem[]
}

export interface RoleHeaderMenus {
  [role: string]: {
    [menu: string]: MenuItem[]
  }
}
