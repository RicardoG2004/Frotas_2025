import { UtilizacaoClient } from './utilizacoes-client'

const UtilizacoesService = (idFuncionalidade: string) =>
  new UtilizacaoClient(idFuncionalidade)

export { UtilizacoesService }

