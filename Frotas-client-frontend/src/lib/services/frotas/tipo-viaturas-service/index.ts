import { TipoViaturaClient } from './tipo-viaturas-client'

const TipoViaturasService = (idFuncionalidade: string) =>
  new TipoViaturaClient(idFuncionalidade)

export { TipoViaturasService }

export * from './tipo-viaturas-client'
export * from './tipo-viaturas-errors'

