export interface CreateCategoriaDTO {
    designacao: string
  }
  
  export interface UpdateCategoriaDTO extends Omit<CreateCategoriaDTO, 'id'> {
    id?: string
  }
  
  export interface CategoriaDTO {
    id: string
    designacao: string
    createdOn: Date
  }
  
  