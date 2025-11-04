export interface CreateEquipamentoDTO {
  designacao: string
  garantia: string
  obs?: string
}

export interface UpdateEquipamentoDTO {
  designacao: string
  garantia: string
  obs?: string
}

export interface EquipamentoDTO {
  id: string
  designacao: string
  garantia: string
  obs: string
  createdBy: string
  createdOn: string
  lastModifiedBy: string
  lastModifiedOn: string
}

export interface EquipamentoSelectDTO {
  id: string
  designacao: string
}

