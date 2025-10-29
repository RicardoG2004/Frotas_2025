import { DefuntoTipoClient } from './defuntos-tipos-client'

const DefuntosTiposService = (idFuncionalidade: string) =>
  new DefuntoTipoClient(idFuncionalidade)

export { DefuntosTiposService }
