import type { CategoriaInspecao } from '@/types/dtos/frotas/tipo-viaturas.dtos'

/**
 * Designações pré-definidas para tipos de viatura
 * Porquê: Valores fixos que o utilizador pode escolher ao criar/editar um tipo de viatura
 */
export const TIPO_VIATURA_DESIGNACOES = [
  'ligeiro passageiros',
  'ligeiro mercadorias',
  'pesado',
  'motociclo',
  'tratores agricolas',
] as const

export type TipoViaturaDesignacao = (typeof TIPO_VIATURA_DESIGNACOES)[number]

/**
 * Mapeia a designação do tipo de viatura para a categoria de inspeção
 * Porquê: Permite calcular as datas de inspeção baseado na designação escolhida
 * 
 * @param designacao Designação do tipo de viatura
 * @returns Categoria de inspeção correspondente ou undefined se não mapeado
 */
export function mapearDesignacaoParaCategoriaInspecao(
  designacao: string | null | undefined
): CategoriaInspecao | undefined {
  if (!designacao) {
    return undefined
  }

  const designacaoLower = designacao.toLowerCase().trim()

  // Mapear designações para categorias de inspeção
  // Verificar variações possíveis da designação
  if (
    designacaoLower === 'ligeiro passageiros' ||
    designacaoLower.includes('ligeiro') && designacaoLower.includes('passageiro')
  ) {
    return 'ligeiro'
  }

  if (
    designacaoLower === 'ligeiro mercadorias' ||
    designacaoLower.includes('ligeiro') && designacaoLower.includes('mercadoria')
  ) {
    return 'ligeiroMercadorias'
  }

  if (designacaoLower === 'pesado' || designacaoLower.includes('pesado')) {
    return 'pesado'
  }

  // Motociclo e tratores agrícolas não têm regras específicas de inspeção definidas
  // Retornar undefined para usar regra padrão (anual)
  if (
    designacaoLower === 'motociclo' ||
    designacaoLower.includes('motociclo') ||
    designacaoLower === 'tratores agricolas' ||
    designacaoLower.includes('trator') ||
    designacaoLower.includes('agricola')
  ) {
    return undefined
  }

  // Se não encontrou correspondência exata, tentar inferir baseado em palavras-chave
  if (designacaoLower.includes('pesado')) {
    return 'pesado'
  }
  if (designacaoLower.includes('mercadoria')) {
    return 'ligeiroMercadorias'
  }
  if (designacaoLower.includes('ligeiro')) {
    return 'ligeiro'
  }

  return undefined
}

