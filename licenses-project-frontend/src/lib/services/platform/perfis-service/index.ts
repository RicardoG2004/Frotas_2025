import { PerfisClient } from './perfis-client'

const PerfisService = (idFuncionalidade: string) =>
  new PerfisClient(idFuncionalidade)

export default PerfisService

export * from './perfis-client'
export * from './perfis-admin-client'
export * from './perfil-error'
