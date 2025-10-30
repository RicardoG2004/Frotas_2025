import { ModelosClient } from './modelos-client'

const ModelosService = (idFuncionalidade: string) =>
  new ModelosClient(idFuncionalidade)

export { ModelosService }
export * from './modelos-client'
export * from './modelos-errors'

