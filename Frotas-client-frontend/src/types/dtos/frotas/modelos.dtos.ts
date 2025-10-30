import { MarcaDTO } from './marcas.dtos'

export interface CreateModeloDTO {
  nome: string
  marcaId: string
}

export interface UpdateModeloDTO extends Omit<CreateModeloDTO, 'id'> {
  id?: string
}

export interface ModeloDTO {
  id: string
  nome: string
  marcaId: string
  marca: MarcaDTO
  createdOn: Date
}
