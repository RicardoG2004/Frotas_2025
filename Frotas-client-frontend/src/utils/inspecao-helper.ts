import type { CategoriaInspecao } from '@/types/dtos/frotas/tipo-viaturas.dtos'

/**
 * Calcula a data da primeira inspeção baseado na categoria de inspeção e data de matrícula.
 * Porquê: Calcula quando deve ser feita a primeira inspeção obrigatória baseado na categoria e data de matrícula.
 * Útil para sugerir a data da primeira inspeção quando o utilizador adiciona uma nova.
 * 
 * @param categoriaInspecao Categoria de inspeção do tipo de viatura
 * @param dataLivrete Data da matrícula (DataLivrete)
 * @returns Data da primeira inspeção ou null se não aplicável
 */
export function calcularPrimeiraInspecao(
  categoriaInspecao: CategoriaInspecao | undefined,
  dataLivrete: Date | string | null | undefined
): Date | null {
  if (!categoriaInspecao || !dataLivrete) {
    return null
  }

  const dataMatricula = typeof dataLivrete === 'string' ? new Date(dataLivrete) : dataLivrete

  switch (categoriaInspecao) {
    case 'ligeiro':
      // Ligeiros: primeira inspeção aos 4 anos
      return new Date(dataMatricula.getFullYear() + 4, dataMatricula.getMonth(), dataMatricula.getDate())
    case 'ligeiroMercadorias':
      // Mercadorias: primeira inspeção aos 2 anos
      return new Date(dataMatricula.getFullYear() + 2, dataMatricula.getMonth(), dataMatricula.getDate())
    case 'pesado':
      // Pesados: primeira inspeção ao 1º ano
      return new Date(dataMatricula.getFullYear() + 1, dataMatricula.getMonth(), dataMatricula.getDate())
    default:
      return null
  }
}

/**
 * Calcula a próxima data de inspeção baseado na categoria, data da última inspeção e data de matrícula.
 * Porquê: Calcula a próxima data de inspeção após uma inspeção realizada.
 * Usado quando o utilizador adiciona uma nova inspeção após uma existente.
 * Considera a idade do veículo para aplicar regras diferentes (especialmente Ligeiros).
 * 
 * @param categoriaInspecao Categoria de inspeção do tipo de viatura
 * @param dataUltimaInspecao Data da última inspeção realizada
 * @param dataLivrete Data da matrícula (DataLivrete) - necessário para calcular idade do veículo
 * @returns Data da próxima inspeção
 */
export function calcularProximaInspecao(
  categoriaInspecao: CategoriaInspecao | undefined,
  dataUltimaInspecao: Date,
  dataLivrete: Date | string | null | undefined
): Date {
  // Se não temos categoria ou data de matrícula, usar regra padrão anual
  if (!categoriaInspecao || !dataLivrete) {
    const next = new Date(dataUltimaInspecao)
    next.setFullYear(next.getFullYear() + 1)
    return next
  }

  const dataMatricula = typeof dataLivrete === 'string' ? new Date(dataLivrete) : dataLivrete
  const dataProximaInspecao = new Date(dataUltimaInspecao)

  switch (categoriaInspecao) {
    case 'ligeiro': {
      // Calcular idade do veículo na data da última inspeção
      let idadeVeiculo = dataUltimaInspecao.getFullYear() - dataMatricula.getFullYear()
      const monthDiff = dataUltimaInspecao.getMonth() - dataMatricula.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && dataUltimaInspecao.getDate() < dataMatricula.getDate())) {
        idadeVeiculo--
      }

      // Dos 4 aos 8 anos: bienal (2 em 2 anos)
      // Depois dos 8 anos: anual
      if (idadeVeiculo >= 4 && idadeVeiculo < 8) {
        dataProximaInspecao.setFullYear(dataProximaInspecao.getFullYear() + 2)
      } else if (idadeVeiculo >= 8) {
        dataProximaInspecao.setFullYear(dataProximaInspecao.getFullYear() + 1)
      } else {
        // Menos de 4 anos - não deveria acontecer, mas usar regra padrão
        dataProximaInspecao.setFullYear(dataProximaInspecao.getFullYear() + 1)
      }
      break
    }

    case 'ligeiroMercadorias':
      // Ligeiros de mercadorias: inspeção todos os anos
      dataProximaInspecao.setFullYear(dataProximaInspecao.getFullYear() + 1)
      break

    case 'pesado':
      // Pesados: inspeção todos os anos
      dataProximaInspecao.setFullYear(dataProximaInspecao.getFullYear() + 1)
      break

    default:
      // Regra padrão: anual
      dataProximaInspecao.setFullYear(dataProximaInspecao.getFullYear() + 1)
      break
  }

  return dataProximaInspecao
}

/**
 * Calcula a próxima data de inspeção considerando a idade do veículo na data da inspeção.
 * Versão alternativa que calcula a idade na data da inspeção em vez da última inspeção.
 * 
 * @param categoriaInspecao Categoria de inspeção do tipo de viatura
 * @param dataInspecao Data da inspeção realizada
 * @param dataLivrete Data da matrícula (DataLivrete)
 * @returns Data da próxima inspeção
 */
export function calcularProximaInspecaoPorIdade(
  categoriaInspecao: CategoriaInspecao | undefined,
  dataInspecao: Date,
  dataLivrete: Date | string | null | undefined
): Date {
  // Se não temos categoria ou data de matrícula, usar regra padrão anual
  if (!categoriaInspecao || !dataLivrete) {
    const next = new Date(dataInspecao)
    next.setFullYear(next.getFullYear() + 1)
    return next
  }

  const dataMatricula = typeof dataLivrete === 'string' ? new Date(dataLivrete) : dataLivrete

  switch (categoriaInspecao) {
    case 'ligeiro': {
      // Calcular idade do veículo na data da inspeção
      let idadeVeiculo = dataInspecao.getFullYear() - dataMatricula.getFullYear()
      const monthDiff = dataInspecao.getMonth() - dataMatricula.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && dataInspecao.getDate() < dataMatricula.getDate())) {
        idadeVeiculo--
      }

      // Dos 4 aos 8 anos: bienal (2 em 2 anos)
      // Depois dos 8 anos: anual
      if (idadeVeiculo >= 4 && idadeVeiculo < 8) {
        const next = new Date(dataInspecao)
        next.setFullYear(next.getFullYear() + 2)
        return next
      } else if (idadeVeiculo >= 8) {
        const next = new Date(dataInspecao)
        next.setFullYear(next.getFullYear() + 1)
        return next
      } else {
        // Menos de 4 anos - não deveria acontecer, mas usar regra padrão
        const next = new Date(dataInspecao)
        next.setFullYear(next.getFullYear() + 1)
        return next
      }
    }

    case 'ligeiroMercadorias':
      // Ligeiros de mercadorias: inspeção todos os anos
      {
        const next = new Date(dataInspecao)
        next.setFullYear(next.getFullYear() + 1)
        return next
      }

    case 'pesado':
      // Pesados: inspeção todos os anos
      {
        const next = new Date(dataInspecao)
        next.setFullYear(next.getFullYear() + 1)
        return next
      }

    default:
      // Regra padrão: anual
      {
        const next = new Date(dataInspecao)
        next.setFullYear(next.getFullYear() + 1)
        return next
      }
  }
}

