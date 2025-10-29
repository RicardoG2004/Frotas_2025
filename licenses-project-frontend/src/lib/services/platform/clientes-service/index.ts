import { ClientesClient } from './clientes-client'

const ClientesService = (idFuncionalidade: string) =>
  new ClientesClient(idFuncionalidade)

export default ClientesService

export * from './clientes-client'
export * from './cliente-error'
