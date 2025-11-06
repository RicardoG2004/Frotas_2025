import { ConservatoriasClient } from './conservatorias-client'

const ConservatoriasService = (idFuncionalidade: string) =>
  new ConservatoriasClient(idFuncionalidade)

export { ConservatoriasService }

export * from './conservatorias-client'
export * from './conservatorias-errors'

