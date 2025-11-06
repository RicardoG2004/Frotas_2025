import { DelegacoesClient } from './delegacoes-client'

const DelegacoesService = (idFuncionalidade: string) =>
  new DelegacoesClient(idFuncionalidade)

export { DelegacoesService }

export * from './delegacoes-client'
export * from './delegacoes-errors'

