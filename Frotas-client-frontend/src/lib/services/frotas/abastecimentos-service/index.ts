import { AbastecimentoClient } from './abastecimentos-client'

const AbastecimentosService = (idFuncionalidade: string) =>
  new AbastecimentoClient(idFuncionalidade)

export { AbastecimentosService }

