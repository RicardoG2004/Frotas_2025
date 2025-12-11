import { ManutencaoClient } from './manutencoes-client'

const ManutencoesService = (idFuncionalidade: string) =>
  new ManutencaoClient(idFuncionalidade)

export { ManutencoesService }

export * from './manutencoes-client'
export * from './manutencoes-errors'

