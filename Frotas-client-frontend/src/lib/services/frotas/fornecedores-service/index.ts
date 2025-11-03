import { FornecedoresClient } from './fornecedores-client'

const FornecedoresService = (idFuncionalidade: string) =>
  new FornecedoresClient(idFuncionalidade)

export { FornecedoresService }

