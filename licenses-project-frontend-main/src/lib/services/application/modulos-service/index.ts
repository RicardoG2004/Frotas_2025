import { ModulosClient } from './modulos-client'

const ModulosService = (idFuncionalidade: string) =>
  new ModulosClient(idFuncionalidade)

export default ModulosService

export * from './modulos-client'
export * from './modulo-error'
