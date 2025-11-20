// Import das imagens dos métodos de pagamento
import transferenciaImg from './TransferenciaBancaria.Logo.png'
import mbwayImg from './MBWay.Logo.jpg'
import multibancoImg from './Multibanco.Logo.png'
import paypalImg from './Paypal.Logo.svg'
import applePayImg from './ApplePay.logo.jpg'
import googlePayImg from './Google_Pay_Logo.svg.webp'
import mastercardImg from './MasterCard.Logo.png'
import visaImg from './Visa.Logo.png'
import dinheiroImg from './Dinheiro.Logo.png'
import chequeImg from './Cheque.Logo.png'

export const paymentMethodImages = {
  // Imagens disponíveis
  transferencia: transferenciaImg,
  mbway: mbwayImg,
  multibanco: multibancoImg,
  paypal: paypalImg,
  applePay: applePayImg,
  googlePay: googlePayImg,
  // Cartões - MasterCard para débito, Visa para crédito
  cartaoDebito: mastercardImg,
  cartaoCredito: visaImg,
  dinheiro: dinheiroImg,
  cheque: chequeImg,
  // Métodos sem imagem ainda - serão undefined e usarão ícones como fallback
  debitoDireto: undefined,
  outro: undefined,
} as const

