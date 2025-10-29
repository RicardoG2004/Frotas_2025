export interface CreateSepulturaTipoDTO {
  nome: string
  epocaId: string
  sepulturaTipoDescricaoId: string
  vendaRubrica?: string
  vendaValor?: number
  vendaDescricao?: string
  aluguerRubrica?: string
  aluguerValor?: number
  aluguerDescricao?: string
  alvaraRubrica?: string
  alvaraValor?: number
  alvaraDescricao?: string
  transladacaoRubrica?: string
  transladacaoValor?: number
  transladacaoDescricao?: string
  transferenciaRubrica?: string
  transferenciaValor?: number
  transferenciaDescricao?: string
  exumacaoRubrica?: string
  exumacaoValor?: number
  exumacaoDescricao?: string
  inumacaoRubrica?: string
  inumacaoValor?: number
  inumacaoDescricao?: string
  concessionadaRubrica?: string
  concessionadaValor?: number
  concessionadaDescricao?: string
}

export interface UpdateSepulturaTipoDTO
  extends Omit<CreateSepulturaTipoDTO, 'id'> {
  id?: string
}

export interface SepulturaTipoDTO {
  id: string
  nome: string
  epocaId: string
  sepulturaTipoDescricaoId: string
  vendaRubrica?: string
  vendaValor?: number
  vendaDescricao?: string
  aluguerRubrica?: string
  aluguerValor?: number
  aluguerDescricao?: string
  alvaraRubrica?: string
  alvaraValor?: number
  alvaraDescricao?: string
  transladacaoRubrica?: string
  transladacaoValor?: number
  transladacaoDescricao?: string
  transferenciaRubrica?: string
  transferenciaValor?: number
  transferenciaDescricao?: string
  exumacaoRubrica?: string
  exumacaoValor?: number
  exumacaoDescricao?: string
  inumacaoRubrica?: string
  inumacaoValor?: number
  inumacaoDescricao?: string
  concessionadaRubrica?: string
  concessionadaValor?: number
  concessionadaDescricao?: string
  createdOn: Date
}
