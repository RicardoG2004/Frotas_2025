import { CemiteriosClient } from './cemiterios-client'

const CemiteriosService = (idFuncionalidade: string) =>
  new CemiteriosClient(idFuncionalidade)

export { CemiteriosService }

export * from './cemiterios-client'
export * from './cemiterios-errors'
