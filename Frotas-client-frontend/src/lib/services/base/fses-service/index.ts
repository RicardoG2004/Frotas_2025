import { FsesClient } from './fses-client'

const FsesService = (idFuncionalidade: string) =>
  new FsesClient(idFuncionalidade)

export { FsesService }

