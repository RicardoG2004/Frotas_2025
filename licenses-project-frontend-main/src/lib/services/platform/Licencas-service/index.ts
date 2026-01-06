import { LicencasClient } from './licencas-client'

const LicencasService = (idFuncionalidade: string) =>
  new LicencasClient(idFuncionalidade)
export default LicencasService

export * from './licenca-error'
export * from './licencas-client'
export * from './licencas-admin-client'
export * from './licencas-funcionalidades-client'
export * from './licencas-utilizadores-client'
export * from './licencas-utilizadores-admin-client'
