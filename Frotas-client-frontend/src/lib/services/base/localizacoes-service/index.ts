import { LocalizacoesClient } from './localizacoes-client'

const LocalizacoesService = (idFuncionalidade: string) =>
  new LocalizacoesClient(idFuncionalidade)

export { LocalizacoesService }

export * from './localizacoes-client'
export * from './localizacoes-errors'

