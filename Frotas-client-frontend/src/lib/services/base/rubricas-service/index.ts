import { RubricasClient } from './rubricas-client'

const RubricasService = (idFuncionalidade: string) =>
  new RubricasClient(idFuncionalidade)

export { RubricasService }

export * from './rubricas-client'
export * from './rubricas-errors'
