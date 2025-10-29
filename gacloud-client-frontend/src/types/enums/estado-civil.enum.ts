export enum EstadoCivil {
  CASADO = 1,
  DIVORCIADO = 2,
  SEPARADO = 3,
  SOLTEIRO = 4,
  UNIAO_DE_FACTO = 5,
  VIUVO = 6,
}

export const EstadoCivilLabel: Record<EstadoCivil, string> = {
  [EstadoCivil.CASADO]: 'Casado(a)',
  [EstadoCivil.DIVORCIADO]: 'Divorciado(a)',
  [EstadoCivil.SEPARADO]: 'Separado(a)',
  [EstadoCivil.SOLTEIRO]: 'Solteiro(a)',
  [EstadoCivil.UNIAO_DE_FACTO]: 'União de Facto',
  [EstadoCivil.VIUVO]: 'Viúvo(a)',
}
