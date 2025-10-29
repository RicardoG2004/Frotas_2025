import { SepulturasClient } from './sepulturas-client'

const SepulturasService = (idFuncionalidade: string) =>
  new SepulturasClient(idFuncionalidade)

export { SepulturasService }

export * from './sepulturas-client'
export * from './sepulturas-errors'
