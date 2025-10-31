export interface CreateCombustivelDTO {
  nome: string
  precoLitro: number
}

export interface UpdateCombustivelDTO extends Omit<CreateCombustivelDTO, 'id'> {
  id?: string
}

export interface CombustivelDTO {
  id: string
  nome: string
  precoLitro: number
  createdOn: Date
}
