import { EquipamentoClient } from './equipamentos-client'

const EquipamentosService = (idFuncionalidade: string) =>
  new EquipamentoClient(idFuncionalidade)

export { EquipamentosService }

export * from './equipamentos-client'
export * from './equipamentos-errors'

