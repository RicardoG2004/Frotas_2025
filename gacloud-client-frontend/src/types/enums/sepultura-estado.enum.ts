export enum SepulturaEstado {
  ABANDONO = 1,
  BOM_ESTADO = 2,
  DANIFICADA = 3,
  EM_OBRAS = 4,
  INTERDITADO = 5,
  MANUTENCAO_LEVE = 6,
  RECUPERADA = 7,
}

export const SepulturaEstadoLabel: Record<SepulturaEstado, string> = {
  [SepulturaEstado.ABANDONO]: 'Em estado de abandono',
  [SepulturaEstado.BOM_ESTADO]: 'Bom Estado',
  [SepulturaEstado.DANIFICADA]: 'Danificada',
  [SepulturaEstado.EM_OBRAS]: 'Em obras / Em reparação',
  [SepulturaEstado.INTERDITADO]: 'Interditado / Inseguro',
  [SepulturaEstado.MANUTENCAO_LEVE]: 'Manutenção leve necessária',
  [SepulturaEstado.RECUPERADA]: 'Recuperada',
}
