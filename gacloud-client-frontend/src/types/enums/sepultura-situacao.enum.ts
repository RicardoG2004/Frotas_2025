export enum SepulturaSituacao {
  ALUGADA = 1,
  CADUCADA = 2,
  CONCESSIONADA = 3,
  EM_LITIGIO = 4,
  INDEFINIDA = 5,
  MUNICIPAL = 6,
  PROVISORIA = 7,
  RESERVADA = 8,
}

export const SepulturaSituacaoLabel: Record<SepulturaSituacao, string> = {
  [SepulturaSituacao.ALUGADA]: 'Alugada',
  [SepulturaSituacao.CADUCADA]: 'Caducada / Concessão vencida',
  [SepulturaSituacao.CONCESSIONADA]: 'Concessionada',
  [SepulturaSituacao.EM_LITIGIO]: 'Em litígio',
  [SepulturaSituacao.INDEFINIDA]: 'Indefinida',
  [SepulturaSituacao.MUNICIPAL]: 'Municipal / Pública',
  [SepulturaSituacao.PROVISORIA]: 'Provisória',
  [SepulturaSituacao.RESERVADA]: 'Reservada',
}
