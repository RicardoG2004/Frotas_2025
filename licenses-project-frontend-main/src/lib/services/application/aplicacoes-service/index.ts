import { AplicacoesClient } from './aplicacoes-client'

const AplicacoesService = (idFuncionalidade: string) =>
  new AplicacoesClient(idFuncionalidade)

export default AplicacoesService

export * from './aplicacoes-client'
export * from './aplicacao-error'
