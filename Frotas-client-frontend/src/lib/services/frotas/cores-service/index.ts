import { CoresClient } from './cores-client'

const CoresService = (idFuncionalidade: string) => new CoresClient(idFuncionalidade)

export { CoresService }


