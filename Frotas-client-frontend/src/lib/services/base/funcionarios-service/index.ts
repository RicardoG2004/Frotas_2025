import { FuncionariosClient } from './funcionarios-client'

const FuncionariosService = (idFuncionalidade: string) =>
  new FuncionariosClient(idFuncionalidade)

export { FuncionariosService }


