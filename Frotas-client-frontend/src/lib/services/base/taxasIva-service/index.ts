import { TaxasIvaClient } from './taxasIva-client'

const TaxasIvaService = (idFuncionalidade: string) =>
  new TaxasIvaClient(idFuncionalidade)

export { TaxasIvaService }

export * from './taxasIva-client'
export * from './taxasIva-errors'

