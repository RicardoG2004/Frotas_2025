import { ServicoClient } from './servicos-client'

const ServicosService = (idFuncionalidade: string) =>
  new ServicoClient(idFuncionalidade)

export { ServicosService }

export * from './servicos-client'
export * from './servicos-errors'

