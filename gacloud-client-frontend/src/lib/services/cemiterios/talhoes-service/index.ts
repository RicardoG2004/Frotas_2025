import { TalhoesClient } from './talhoes-client'

const TalhoesService = (idFuncionalidade: string) =>
  new TalhoesClient(idFuncionalidade)

export { TalhoesService }

export * from './talhoes-client'
export * from './talhoes-errors'
