export enum RubricaClassificacao {
  EVENTUAL = 'E',
  OPERACOES_DE_TESOURARIA = 'O',
}

export const RubricaClassificacaoLabel: Record<RubricaClassificacao, string> = {
  [RubricaClassificacao.EVENTUAL]: 'Eventual',
  [RubricaClassificacao.OPERACOES_DE_TESOURARIA]: 'Operações de tesouraria',
}
