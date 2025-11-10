import { TerceirosClient } from './terceiros-client'

const TerceirosService = (idFuncionalidade: string) =>
  new TerceirosClient(idFuncionalidade)

export { TerceirosService }

export * from './terceiros-client'
export * from './terceiros-errors'


