export enum RubricaTipo {
  INTEGRACAO = 1,
  MOVIMENTO = 2,
}

export const RubricaTipoLabel: Record<RubricaTipo, string> = {
  [RubricaTipo.INTEGRACAO]: 'Integracao',
  [RubricaTipo.MOVIMENTO]: 'Movimento',
}
