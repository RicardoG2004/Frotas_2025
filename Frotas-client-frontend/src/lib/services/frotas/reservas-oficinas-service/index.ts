import { ReservaOficinaClient } from './reservas-oficinas-client'

const ReservasOficinasService = (idFuncionalidade: string) =>
  new ReservaOficinaClient(idFuncionalidade)

export { ReservasOficinasService }

export * from './reservas-oficinas-client'
export * from './reservas-oficinas-errors'

