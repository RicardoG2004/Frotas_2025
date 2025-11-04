import { PecaClient } from './pecas-client'

const PecasService = (idFuncionalidade: string) =>
  new PecaClient(idFuncionalidade)

export { PecasService }

export * from './pecas-client'
export * from './pecas-errors'

