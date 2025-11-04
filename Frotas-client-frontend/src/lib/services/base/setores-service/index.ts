import { SetoresClient } from './setores-client'

const SetoresService = (idFuncionalidade: string) =>
  new SetoresClient(idFuncionalidade)

export { SetoresService }

export * from './setores-client'
export * from './setores-errors'

