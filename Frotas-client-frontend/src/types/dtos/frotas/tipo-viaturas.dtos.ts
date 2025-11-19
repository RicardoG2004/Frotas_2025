// Tipo que representa as categorias de inspeção possíveis
// Deve corresponder ao enum C# do backend (mas em camelCase para TypeScript)
export type CategoriaInspecao = 'ligeiro' | 'ligeiroMercadorias' | 'pesado'

export interface TipoViaturaDTO {
  id: string
  designacao: string
  // Propriedade necessária para saber a categoria quando recebemos dados do backend
  categoriaInspecao: CategoriaInspecao
}

export interface CreateTipoViaturaDTO {
  designacao: string
  // Propriedade necessária para enviar a categoria ao criar um novo tipo
  categoriaInspecao: CategoriaInspecao
}

export interface UpdateTipoViaturaDTO {
  designacao: string
  // Propriedade necessária para enviar a categoria ao atualizar um tipo
  categoriaInspecao: CategoriaInspecao
}

