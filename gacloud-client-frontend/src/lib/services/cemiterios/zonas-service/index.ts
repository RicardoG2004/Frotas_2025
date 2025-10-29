import { ZonasClient } from './zonas-client'

const ZonasService = (idFuncionalidade: string) =>
  new ZonasClient(idFuncionalidade)

export { ZonasService }

export * from './zonas-client'
export * from './zonas-errors'
