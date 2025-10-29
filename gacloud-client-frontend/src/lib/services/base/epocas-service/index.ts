import { EpocasClient } from './epocas-client'

const EpocasService = (idFuncionalidade: string) =>
  new EpocasClient(idFuncionalidade)

export { EpocasService }

export * from './epocas-client'
export * from './epocas-errors'
