import { UtilizadoresClient } from './utilizadores-client'

const UtilizadoresService = (idFuncionalidade: string) =>
  new UtilizadoresClient(idFuncionalidade)

export default UtilizadoresService

export * from './utilizadores-client'
export * from './utilizadores-admin-client'
export * from './utilizador-error'
