import { EntidadesClient } from './entidades-client'

const EntidadesService = (idFuncionalidade: string) =>
  new EntidadesClient(idFuncionalidade)

export { EntidadesService }


