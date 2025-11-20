import { SeguradoraDTO } from '@/types/dtos/frotas/seguradoras.dtos'
import { paymentMethodImages } from '@/assets/images/payment-methods'

export enum PeriodicidadeSeguro {
  Mensal = 0,
  Trimestral = 1,
  Anual = 2,
}

export enum MetodoPagamentoSeguro {
  Transferencia = 0,
  MBWay = 2,
  Multibanco = 3,
  CartaoDebito = 4,
  CartaoCredito = 5,
  PayPal = 6,
  ApplePay = 7,
  GooglePay = 8,
  Dinheiro = 9,
  Cheque = 10,
  Outro = 11,
}

export const MetodoPagamentoSeguroConfig: Record<
  MetodoPagamentoSeguro,
  { label: string; image?: string; icon: string; color: string }
> = {
  [MetodoPagamentoSeguro.Transferencia]: {
    label: 'Transferência Bancária',
    image: paymentMethodImages.transferencia,
    icon: 'Building2',
    color: 'bg-blue-500',
  },
  [MetodoPagamentoSeguro.MBWay]: {
    label: 'MB Way',
    image: paymentMethodImages.mbway,
    icon: 'Smartphone',
    color: 'bg-purple-500',
  },
  [MetodoPagamentoSeguro.Multibanco]: {
    label: 'Multibanco',
    image: paymentMethodImages.multibanco,
    icon: 'CreditCard',
    color: 'bg-red-500',
  },
  [MetodoPagamentoSeguro.CartaoDebito]: {
    label: 'Cartão de Débito',
    image: paymentMethodImages.cartaoDebito,
    icon: 'CreditCard',
    color: 'bg-indigo-500',
  },
  [MetodoPagamentoSeguro.CartaoCredito]: {
    label: 'Cartão de Crédito',
    image: paymentMethodImages.cartaoCredito,
    icon: 'CreditCard',
    color: 'bg-amber-500',
  },
  [MetodoPagamentoSeguro.PayPal]: {
    label: 'PayPal',
    image: paymentMethodImages.paypal,
    icon: 'Wallet',
    color: 'bg-blue-600',
  },
  [MetodoPagamentoSeguro.ApplePay]: {
    label: 'Apple Pay',
    image: paymentMethodImages.applePay,
    icon: 'Smartphone',
    color: 'bg-gray-900',
  },
  [MetodoPagamentoSeguro.GooglePay]: {
    label: 'Google Pay',
    image: paymentMethodImages.googlePay,
    icon: 'Smartphone',
    color: 'bg-blue-700',
  },
  [MetodoPagamentoSeguro.Dinheiro]: {
    label: 'Dinheiro',
    image: paymentMethodImages.dinheiro,
    icon: 'Banknote',
    color: 'bg-green-600',
  },
  [MetodoPagamentoSeguro.Cheque]: {
    label: 'Cheque',
    image: paymentMethodImages.cheque,
    icon: 'FileText',
    color: 'bg-gray-500',
  },
  [MetodoPagamentoSeguro.Outro]: {
    label: 'Outro',
    image: paymentMethodImages.outro,
    icon: 'MoreHorizontal',
    color: 'bg-gray-400',
  },
}

export interface CreateSeguroDTO {
  designacao: string
  apolice: string
  seguradoraId: string
  assistenciaViagem: boolean
  cartaVerde: boolean
  valorCobertura: number
  custoAnual: number
  riscosCobertos: string
  dataInicial: string
  dataFinal: string
  periodicidade: PeriodicidadeSeguro
  metodoPagamento?: MetodoPagamentoSeguro
  dataPagamento?: string
}

export interface UpdateSeguroDTO extends Omit<CreateSeguroDTO, 'seguradoraId'> {
  seguradoraId: string
  id?: string
}

export interface SeguroDTO {
  id: string
  designacao: string
  apolice: string
  seguradoraId: string
  seguradora?: SeguradoraDTO
  assistenciaViagem: boolean
  cartaVerde: boolean
  valorCobertura: number
  custoAnual: number
  riscosCobertos: string
  dataInicial: string
  dataFinal: string
  periodicidade: PeriodicidadeSeguro
  metodoPagamento?: MetodoPagamentoSeguro
  dataPagamento?: string
  createdOn?: string
}


