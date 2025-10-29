import { CoveiroClient } from './coveiros-client'

const CoveirosService = (idFuncionalidade: string) =>
  new CoveiroClient(idFuncionalidade)

export { CoveirosService }
