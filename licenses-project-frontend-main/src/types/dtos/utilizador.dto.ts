export interface CreateUtilizadorDTO {
  clienteId: string
  email: string
  firstName: string
  lastName: string
  password: string
  perfilId?: string
  roleId: string
  licencaId?: string
}

export interface UpdateUtilizadorDTO {
  clienteId: string
  email: string
  firstName: string
  isActive: boolean
  lastName: string
  perfilId?: string
  roleId: string
  licencaId?: string // Add this line
}

export interface UtilizadorDTO {
  clienteId?: string
  cliente: {
    nome: string
  }
  firstName: string
  id?: string
  isActive?: boolean
  lastName: string
  email: string
  password?: string
  perfisUtilizador?: string[]
  roleId: string
  phoneNumber?: string
  licencaId?: string
}

export interface LicencaUtilizadorDTO {
  utilizador: UtilizadorDTO
  ativo: boolean
}

// Helper functions
export const toCreateUtilizadorDTO = (
  user: UtilizadorDTO
): CreateUtilizadorDTO => ({
  clienteId: user.clienteId ?? '',
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  password: user.password ?? '',
  perfilId: '',
  roleId: user.roleId,
})

export const toUpdateUtilizadorDTO = (
  user: UtilizadorDTO,
  perfilId: string
): UpdateUtilizadorDTO => ({
  clienteId: user.clienteId ?? '',
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  isActive: user.isActive ?? false,
  perfilId: perfilId ?? '',
  roleId: user.roleId,
})
