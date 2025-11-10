import { SeguradorasClient } from './seguradoras-client'

const SeguradorasService = (idFuncionalidade: string) =>
  new SeguradorasClient(idFuncionalidade)

export { SeguradorasService }


