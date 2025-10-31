import { CombustiveisClient } from './combustiveis-client'

const CombustiveisService = (idFuncionalidade: string) =>
  new CombustiveisClient(idFuncionalidade)

export { CombustiveisService }
export * from './combustiveis-client'
export * from './combustiveis-errors'

