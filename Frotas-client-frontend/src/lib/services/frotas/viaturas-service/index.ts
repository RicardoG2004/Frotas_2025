import { ViaturasClient } from './viaturas-client'

const ViaturasService = (idFuncionalidade: string) =>
  new ViaturasClient(idFuncionalidade)

export { ViaturasService }

export * from './viaturas-client'
export * from './viaturas-errors'

