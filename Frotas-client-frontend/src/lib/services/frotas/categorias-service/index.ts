import { CategoriasClient } from './categorias-client'

const CategoriasService = (idFuncionalidade: string) =>
  new CategoriasClient(idFuncionalidade)

export { CategoriasService }

