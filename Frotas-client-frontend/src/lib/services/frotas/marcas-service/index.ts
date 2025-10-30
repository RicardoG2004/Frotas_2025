import { MarcasClient } from './marcas-client'

const MarcasService = (idFuncionalidade: string) =>
  new MarcasClient(idFuncionalidade)

export { MarcasService }
