import { CargosClient } from './cargos-client'

const CargosService = (idFuncionalidade: string) =>
  new CargosClient(idFuncionalidade)

export { CargosService }


