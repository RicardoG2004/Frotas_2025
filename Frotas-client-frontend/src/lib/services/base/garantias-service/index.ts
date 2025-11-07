import { GarantiasClient } from './garantias-client'

const GarantiasService = (idFuncionalidade: string) =>
  new GarantiasClient(idFuncionalidade)

export { GarantiasService }

export * from './garantias-client'
export * from './garantias-errors'


