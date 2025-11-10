import { SegurosClient } from './seguros-client'

const SegurosService = (idFuncionalidade: string) =>
  new SegurosClient(idFuncionalidade)

export { SegurosService }


