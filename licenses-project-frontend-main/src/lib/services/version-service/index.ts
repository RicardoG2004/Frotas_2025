import { VersionClient } from './version-client'

const VersionService = (idFuncionalidade?: string) =>
  new VersionClient(idFuncionalidade)

export default VersionService

export * from './version-client'
export * from './version-error'
