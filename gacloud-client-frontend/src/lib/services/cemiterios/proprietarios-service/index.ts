import { ProprietariosClient } from './proprietarios-client'

const ProprietariosService = (idFuncionalidade: string) =>
  new ProprietariosClient(idFuncionalidade)

export { ProprietariosService }

export * from './proprietarios-client'
export * from './proprietarios-errors'
