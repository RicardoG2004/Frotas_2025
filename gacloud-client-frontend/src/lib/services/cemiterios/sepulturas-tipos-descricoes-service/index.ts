import { SepulturasTiposDescricoesClient } from './sepulturas-tipos-descricoes-client'

const SepulturasTiposDescricoesService = (idFuncionalidade: string) =>
  new SepulturasTiposDescricoesClient(idFuncionalidade)

export { SepulturasTiposDescricoesService }

export * from './sepulturas-tipos-descricoes-client'
export * from './sepulturas-tipos-descricoes-errors'
