import { SepulturasTiposClient } from './sepulturas-tipos-client'

const SepulturasTiposService = (idFuncionalidade: string) =>
  new SepulturasTiposClient(idFuncionalidade)

export { SepulturasTiposService }

export * from './sepulturas-tipos-client'
export * from './sepulturas-tipos-errors'
