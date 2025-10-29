export const roleConfig = {
  administrator: {
    label: 'Administrador',
    color: '#FF6B6B',
  },
  admin: {
    label: 'Admin',
    color: '#2563eb',
  },
  client: {
    label: 'Cliente',
    color: '#45B7D1',
  },
} as const

export const roleConfigAdmin = {
  admin: {
    label: 'Admin',
    color: '#2563eb',
  },
  client: {
    label: 'Cliente',
    color: '#45B7D1',
  },
} as const

export type RoleType = keyof typeof roleConfig
export type RoleTypeAdmin = keyof typeof roleConfigAdmin

// For backward compatibility (if needed during refactoring)
export const roleLabelMap = Object.fromEntries(
  Object.entries(roleConfig).map(([key, value]) => [key, value.label])
) as Record<RoleType, string>

export const roleColorMap = Object.fromEntries(
  Object.entries(roleConfig).map(([key, value]) => [key, value.color])
) as Record<RoleType, string>
