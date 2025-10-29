import { AreasClient } from './areas-client'

const AreasService = (idFuncionalidade: string) =>
  new AreasClient(idFuncionalidade)

export default AreasService

export * from './areas-client'
export * from './area-error'
