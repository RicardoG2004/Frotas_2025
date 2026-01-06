import { AppUpdatesClient } from './app-updates-client'

const AppUpdatesService = (idFuncionalidade: string) =>
  new AppUpdatesClient(idFuncionalidade)

export default AppUpdatesService

export * from './app-updates-client'
export * from './app-update-error'
