import { AgenciaFunerariaClient } from './agencias-funerarias-client'

const AgenciasFunerariasService = (idFuncionalidade: string) =>
  new AgenciaFunerariaClient(idFuncionalidade)

export { AgenciasFunerariasService }

export * from './agencias-funerarias-client'
export * from './agencias-funerarias-errors'
