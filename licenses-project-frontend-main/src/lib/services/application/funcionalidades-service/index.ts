import { FuncionalidadesClient } from './funcionalidades-client'

const FuncionalidadesService = (idFuncionalidade: string) =>
  new FuncionalidadesClient(idFuncionalidade)

export default FuncionalidadesService

export * from './funcionalidades-client'
export * from './funcionalidade-error'
