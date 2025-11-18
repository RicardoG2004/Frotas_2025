/**
 * Calculadora de Imposto Único de Circulação (IUC) para veículos ligeiros
 * Baseado nas tabelas oficiais para o ano 2026
 * Fonte: impostosobreveiculos.info
 */

export type TipoCombustivel = 'gasolina' | 'diesel' | 'eletrico' | 'outro'

export type PeriodoMatricula = '1981-1989' | '1990-1995' | '1996-2007' | '2007+'

export type TipoViatura = 'passageiros' | 'comercial'

export type PadraoCO2 = 'NEDC' | 'WLTP' | 'desconhecido'

export interface IUCResult {
  valor: number | null
  periodo: PeriodoMatricula | null
  tipoCombustivel: TipoCombustivel | null
  tipoViatura: TipoViatura | null
  mensagem: string
  detalhes?: string
  calculoCompleto?: boolean
}

/**
 * Identifica o tipo de combustível baseado no nome e tipo de propulsão
 */
export function identificarTipoCombustivel(
  nomeCombustivel: string | null | undefined,
  tipoPropulsao?: string | null
): TipoCombustivel {
  // Se for elétrico, retorna elétrico
  if (tipoPropulsao === 'eletrico') {
    return 'eletrico'
  }

  if (!nomeCombustivel) return 'outro'

  const nomeLower = nomeCombustivel.toLowerCase()

  if (nomeLower.includes('gasolina') || nomeLower.includes('e10') || nomeLower.includes('e85')) {
    return 'gasolina'
  }

  if (nomeLower.includes('gasóleo') || nomeLower.includes('gasoleo') || nomeLower.includes('biodiesel')) {
    return 'diesel'
  }

  if (nomeLower.includes('eletric') || nomeLower.includes('eléctric')) {
    return 'eletrico'
  }

  return 'outro'
}

/**
 * Determina o período de matrícula baseado no ano de imposto de circulação
 * O ano de imposto de circulação é o ano da primeira matrícula do veículo
 */
export function determinarPeriodoMatricula(
  anoImpostoCirculacao: number | null | undefined,
  dataLivrete: Date | null | undefined,
  anoFabrico: number | null | undefined
): PeriodoMatricula {
  // Prioridade: anoImpostoCirculacao > dataLivrete > anoFabrico
  let ano: number | null = null
  let mes: number | null = null

  if (anoImpostoCirculacao) {
    ano = anoImpostoCirculacao
    // Se temos dataLivrete e o ano coincide, usar o mês da dataLivrete
    if (dataLivrete && dataLivrete.getFullYear() === ano) {
      mes = dataLivrete.getMonth() + 1 // getMonth() retorna 0-11
    }
  } else if (dataLivrete) {
    ano = dataLivrete.getFullYear()
    mes = dataLivrete.getMonth() + 1
  } else if (anoFabrico) {
    ano = anoFabrico
  }

  if (!ano) return '2007+'

  // Se for julho de 2007 ou posterior, é período 2007+
  if (ano === 2007 && mes !== null && mes >= 7) {
    return '2007+'
  }
  if (ano > 2007) {
    return '2007+'
  }

  // Para anos anteriores a 2007, ou 2007 sem mês definido
  if (ano < 2007) {
    if (ano >= 1981 && ano <= 1989) {
      return '1981-1989'
    }

    if (ano >= 1990 && ano <= 1995) {
      return '1990-1995'
    }

    if (ano >= 1996 && ano <= 2006) {
      return '1996-2007'
    }
  }

  // Se for 2007 mas não temos mês, assumimos período antigo (até junho)
  if (ano === 2007) {
    return '1996-2007'
  }

  return '2007+'
}

/**
 * Calcula o IUC para veículos a gasolina com matrícula até junho 2007
 */
function calcularIUCGasolinaAte2007(
  cilindrada: number,
  periodo: '1981-1989' | '1990-1995' | '1996-2007'
): number | null {
  const tabelaGasolina: Record<
    string,
    Record<'1981-1989' | '1990-1995' | '1996-2007', number>
  > = {
    'ate_1000': {
      '1981-1989': 8.8,
      '1990-1995': 12.2,
      '1996-2007': 19.9,
    },
    '1001_1300': {
      '1981-1989': 12.55,
      '1990-1995': 22.45,
      '1996-2007': 39.95,
    },
    '1301_1750': {
      '1981-1989': 17.49,
      '1990-1995': 34.87,
      '1996-2007': 62.4,
    },
    '1751_2600': {
      '1981-1989': 36.09,
      '1990-1995': 83.49,
      '1996-2007': 158.31,
    },
    '2601_3500': {
      '1981-1989': 79.72,
      '1990-1995': 156.54,
      '1996-2007': 287.49,
    },
    'mais_3500': {
      '1981-1989': 120.9,
      '1990-1995': 263.11,
      '1996-2007': 512.23,
    },
  }

  let faixa: string

  if (cilindrada <= 1000) {
    faixa = 'ate_1000'
  } else if (cilindrada <= 1300) {
    faixa = '1001_1300'
  } else if (cilindrada <= 1750) {
    faixa = '1301_1750'
  } else if (cilindrada <= 2600) {
    faixa = '1751_2600'
  } else if (cilindrada <= 3500) {
    faixa = '2601_3500'
  } else {
    faixa = 'mais_3500'
  }

  return tabelaGasolina[faixa]?.[periodo] ?? null
}

/**
 * Calcula o IUC para veículos a diesel com matrícula até junho 2007
 */
function calcularIUCDieselAte2007(
  cilindrada: number,
  periodo: '1981-1989' | '1990-1995' | '1996-2007'
): number | null {
  // Nota: A tabela diesel já inclui a taxa adicional
  const tabelaDiesel: Record<
    string,
    Record<'1981-1989' | '1990-1995' | '1996-2007', number>
  > = {
    'ate_1500': {
      '1981-1989': 10.19, // 8,80€ + 1,39€
      '1990-1995': 14.18, // 12,55€ + 1,98€
      '1996-2007': 22.48, // 19,90€ + 3,14€
    },
    '1501_2000': {
      '1981-1989': 14.18, // 12,55€ + 1,98€
      '1990-1995': 25.37, // 22,45€ + 3,55€
      '1996-2007': 45.13, // 39,95€ + 6,31€
    },
    '2001_3000': {
      '1981-1989': 19.76, // 17,49€ + 2,76€
      '1990-1995': 39.4, // 34,87€ + 5,51€
      '1996-2007': 70.5, // 62,40€ + 9,86€
    },
    'mais_3000': {
      '1981-1989': 40.77, // 36,09€ + 5,70€
      '1990-1995': 94.33, // 83,49€ + 13,19€
      '1996-2007': 178.86, // 158,31€ + 25,01€
    },
  }

  let faixa: string

  if (cilindrada <= 1500) {
    faixa = 'ate_1500'
  } else if (cilindrada <= 2000) {
    faixa = '1501_2000'
  } else if (cilindrada <= 3000) {
    faixa = '2001_3000'
  } else {
    faixa = 'mais_3000'
  }

  return tabelaDiesel[faixa]?.[periodo] ?? null
}

/**
 * Calcula o IUC para veículos elétricos com matrícula até junho 2007
 */
function calcularIUCEletricoAte2007(
  voltagem: number | null,
  periodo: '1981-1989' | '1990-1995' | '1996-2007'
): number | null {
  // Se não temos voltagem, não podemos calcular
  if (!voltagem) return null

  const tabelaEletrico: Record<
    string,
    Record<'1981-1989' | '1990-1995' | '1996-2007', number>
  > = {
    'ate_100': {
      '1981-1989': 0, // Isento
      '1990-1995': 12.55,
      '1996-2007': 19.9,
    },
    'mais_100': {
      '1981-1989': 12.55,
      '1990-1995': 22.45,
      '1996-2007': 39.95,
    },
  }

  const faixa = voltagem <= 100 ? 'ate_100' : 'mais_100'
  const valor = tabelaEletrico[faixa]?.[periodo]

  // Veículos elétricos de 1981-1989 com até 100V são isentos
  if (periodo === '1981-1989' && faixa === 'ate_100') {
    return 0
  }

  return valor ?? null
}

/**
 * Calcula taxa de cilindrada para veículos a partir de julho 2007
 */
function calcularTaxaCilindrada2007(cilindrada: number): number | null {
  const tabela: Record<string, number> = {
    'ate_1250': 31.77,
    '1251_1750': 63.74,
    '1751_2500': 127.35,
    'mais_2500': 435.84,
  }

  if (cilindrada <= 1250) {
    return tabela['ate_1250']
  } else if (cilindrada <= 1750) {
    return tabela['1251_1750']
  } else if (cilindrada <= 2500) {
    return tabela['1751_2500']
  } else {
    return tabela['mais_2500']
  }
}

/**
 * Calcula taxa de CO2 para veículos a partir de julho 2007
 */
function calcularTaxaCO2(
  co2: number,
  padrao: PadraoCO2,
  anoMatricula: number
): { taxa: number; taxaAdicional: number } | null {
  if (!co2 || co2 <= 0) return null

  // Determinar se aplica taxa adicional (veículos de 2017+ com CO2 > 180 NEDC ou > 205 WLTP)
  const aplicaTaxaAdicional = anoMatricula >= 2017

  // Tabela CO2
  let taxa = 0
  let taxaAdicional = 0

  if (padrao === 'NEDC') {
    if (co2 <= 120) {
      taxa = 65.15
      taxaAdicional = 0
    } else if (co2 <= 180) {
      taxa = 97.63
      taxaAdicional = 0
    } else if (co2 <= 250) {
      taxa = 212.04
      taxaAdicional = aplicaTaxaAdicional ? 31.77 : 0
    } else {
      taxa = 363.25
      taxaAdicional = aplicaTaxaAdicional ? 63.74 : 0
    }
  } else if (padrao === 'WLTP') {
    if (co2 <= 140) {
      taxa = 65.15
      taxaAdicional = 0
    } else if (co2 <= 205) {
      taxa = 97.63
      taxaAdicional = 0
    } else if (co2 <= 260) {
      taxa = 212.04
      taxaAdicional = aplicaTaxaAdicional ? 31.77 : 0
    } else {
      taxa = 363.25
      taxaAdicional = aplicaTaxaAdicional ? 63.74 : 0
    }
  } else {
    // Se não sabemos o padrão, assumimos NEDC para veículos até 2019 e WLTP para 2020+
    const padraoAssumido = anoMatricula < 2020 ? 'NEDC' : 'WLTP'
    return calcularTaxaCO2(co2, padraoAssumido, anoMatricula)
  }

  return { taxa, taxaAdicional }
}

/**
 * Obtém o coeficiente de idade baseado no ano de matrícula
 */
function obterCoeficienteIdade(anoMatricula: number): number {
  if (anoMatricula === 2007) return 1.0
  if (anoMatricula === 2008) return 1.05
  if (anoMatricula === 2009) return 1.1
  if (anoMatricula >= 2010) return 1.15
  return 1.0
}

/**
 * Calcula taxa adicional para diesel (a partir de julho 2007)
 */
function calcularTaxaAdicionalDiesel(cilindrada: number): number | null {
  const tabela: Record<string, number> = {
    'ate_1250': 5.02,
    '1251_1750': 10.07,
    '1751_2500': 20.12,
    'mais_2500': 68.85,
  }

  if (cilindrada <= 1250) {
    return tabela['ate_1250']
  } else if (cilindrada <= 1750) {
    return tabela['1251_1750']
  } else if (cilindrada <= 2500) {
    return tabela['1751_2500']
  } else {
    return tabela['mais_2500']
  }
}

/**
 * Calcula IUC para veículos comerciais (baseado em peso bruto)
 */
function calcularIUCComercial(pesoBruto: number): number | null {
  if (!pesoBruto || pesoBruto <= 0) return null

  if (pesoBruto <= 2500) {
    return 35.15
  } else if (pesoBruto <= 3500) {
    return 58.21
  } else if (pesoBruto <= 7500) {
    return 139.47
  } else if (pesoBruto < 12000) {
    return 226.24
  }

  return null
}

/**
 * Calcula o valor do IUC baseado nos dados do veículo
 */
export function calcularIUC(
  nomeCombustivel: string | null | undefined,
  anoImpostoCirculacao: number | null | undefined,
  dataLivrete: Date | null | undefined,
  anoFabrico: number | null | undefined,
  cilindrada: number | null | undefined,
  tipoPropulsao?: string | null,
  co2?: number | null,
  padraoCO2?: PadraoCO2,
  voltagem?: number | null,
  tara?: number | null,
  cargaUtil?: number | null,
  mercadorias?: boolean
): IUCResult {
  // Determinar tipo de viatura
  const tipoViatura: TipoViatura = mercadorias ? 'comercial' : 'passageiros'

  // Para veículos comerciais, usar tabela de peso bruto
  if (tipoViatura === 'comercial') {
    const pesoBruto = tara && cargaUtil ? tara + cargaUtil : null
    if (pesoBruto) {
      const valor = calcularIUCComercial(pesoBruto)
      if (valor !== null) {
        return {
          valor,
          periodo: null,
          tipoCombustivel: null,
          tipoViatura: 'comercial',
          mensagem: `IUC para veículo comercial (peso bruto: ${pesoBruto}kg)`,
          detalhes: `Tabela de veículos comerciais - Peso bruto: ${pesoBruto}kg`,
          calculoCompleto: true,
        }
      }
    }
    return {
      valor: null,
      periodo: null,
      tipoCombustivel: null,
      tipoViatura: 'comercial',
      mensagem: 'Para calcular o IUC de veículo comercial, é necessário o peso bruto (tara + carga útil)',
    }
  }

  // Para veículos de passageiros
  const tipoCombustivel = identificarTipoCombustivel(nomeCombustivel, tipoPropulsao)

  // Veículos elétricos puros são isentos (a partir de julho 2007)
  if (tipoCombustivel === 'eletrico') {
    const periodo = determinarPeriodoMatricula(anoImpostoCirculacao, dataLivrete, anoFabrico)
    if (periodo === '2007+') {
      return {
        valor: 0,
        periodo: '2007+',
        tipoCombustivel: 'eletrico',
        tipoViatura: 'passageiros',
        mensagem: 'Veículos exclusivamente elétricos são isentos de IUC (a partir de julho 2007)',
        detalhes: 'Isenção aplicável a veículos 100% elétricos',
        calculoCompleto: true,
      }
    }
  }

  // Validações básicas
  if (!nomeCombustivel && tipoCombustivel === 'outro' && tipoPropulsao !== 'eletrico') {
    return {
      valor: null,
      periodo: null,
      tipoCombustivel: null,
      tipoViatura: 'passageiros',
      mensagem: 'Dados insuficientes para calcular o IUC',
    }
  }

  const periodo = determinarPeriodoMatricula(anoImpostoCirculacao, dataLivrete, anoFabrico)

  // Cálculo para veículos até junho 2007
  if (periodo !== '2007+') {
    if (tipoCombustivel === 'eletrico') {
      const valor = calcularIUCEletricoAte2007(voltagem || null, periodo)
      if (valor !== null) {
        const detalhes =
          valor === 0
            ? 'Veículo elétrico isento (matrícula 1981-1989, até 100V)'
            : `Veículo elétrico - Voltagem: ${voltagem || 'N/A'}V`
        return {
          valor,
          periodo,
          tipoCombustivel: 'eletrico',
          tipoViatura: 'passageiros',
          mensagem: `IUC calculado para veículo elétrico (${periodo})`,
          detalhes,
          calculoCompleto: true,
        }
      }
      return {
        valor: null,
        periodo,
        tipoCombustivel: 'eletrico',
        tipoViatura: 'passageiros',
        mensagem: 'Para calcular o IUC de veículo elétrico, é necessária a voltagem total',
      }
    }

    if (!cilindrada || cilindrada <= 0) {
      return {
        valor: null,
        periodo,
        tipoCombustivel,
        tipoViatura: 'passageiros',
        mensagem: 'Cilindrada é obrigatória para calcular o IUC',
      }
    }

    if (tipoCombustivel === 'gasolina') {
      const valor = calcularIUCGasolinaAte2007(cilindrada, periodo)
      if (valor !== null) {
        return {
          valor,
          periodo,
          tipoCombustivel: 'gasolina',
          tipoViatura: 'passageiros',
          mensagem: `IUC calculado para Gasolina (${periodo})`,
          detalhes: `Cilindrada: ${cilindrada}cm³`,
          calculoCompleto: true,
        }
      }
    } else if (tipoCombustivel === 'diesel') {
      const valor = calcularIUCDieselAte2007(cilindrada, periodo)
      if (valor !== null) {
        return {
          valor,
          periodo,
          tipoCombustivel: 'diesel',
          tipoViatura: 'passageiros',
          mensagem: `IUC calculado para Diesel (${periodo})`,
          detalhes: `Cilindrada: ${cilindrada}cm³ (inclui taxa adicional diesel)`,
          calculoCompleto: true,
        }
      }
    }

    return {
      valor: null,
      periodo,
      tipoCombustivel,
      tipoViatura: 'passageiros',
      mensagem: 'Tipo de combustível não suportado para cálculo automático',
    }
  }

  // Cálculo para veículos a partir de julho 2007
  if (!cilindrada || cilindrada <= 0) {
    return {
      valor: null,
      periodo: '2007+',
      tipoCombustivel,
      tipoViatura: 'passageiros',
      mensagem: 'Cilindrada é obrigatória para calcular o IUC',
    }
  }

  const taxaCilindrada = calcularTaxaCilindrada2007(cilindrada)
  if (!taxaCilindrada) {
    return {
      valor: null,
      periodo: '2007+',
      tipoCombustivel,
      tipoViatura: 'passageiros',
      mensagem: 'Não foi possível calcular a taxa de cilindrada',
    }
  }

  // Se não temos CO2, não podemos calcular o IUC completo
  if (!co2 || co2 <= 0) {
    return {
      valor: null,
      periodo: '2007+',
      tipoCombustivel,
      tipoViatura: 'passageiros',
      mensagem:
        'Para veículos com matrícula a partir de julho 2007, é necessário o valor de emissões CO2 (g/km)',
      detalhes: `Taxa de cilindrada calculada: ${taxaCilindrada.toFixed(2)}€ (faltam: taxa CO2, coeficiente idade, e taxa adicional diesel se aplicável)`,
      calculoCompleto: false,
    }
  }

  const anoMatricula = anoImpostoCirculacao || dataLivrete?.getFullYear() || anoFabrico || 2007
  const padrao = padraoCO2 || 'desconhecido'
  const taxaCO2Result = calcularTaxaCO2(co2, padrao, anoMatricula)

  if (!taxaCO2Result) {
    return {
      valor: null,
      periodo: '2007+',
      tipoCombustivel,
      tipoViatura: 'passageiros',
      mensagem: 'Não foi possível calcular a taxa de CO2',
    }
  }

  const { taxa: taxaCO2, taxaAdicional: taxaAdicionalCO2 } = taxaCO2Result
  const coeficiente = obterCoeficienteIdade(anoMatricula)

  // Calcular base: (taxa cilindrada + taxa CO2 + taxa adicional CO2) * coeficiente
  let valorBase = (taxaCilindrada + taxaCO2 + taxaAdicionalCO2) * coeficiente

  // Adicionar taxa adicional diesel se aplicável
  let taxaAdicionalDiesel = 0
  if (tipoCombustivel === 'diesel') {
    const taxaDiesel = calcularTaxaAdicionalDiesel(cilindrada)
    if (taxaDiesel) {
      taxaAdicionalDiesel = taxaDiesel
      valorBase += taxaAdicionalDiesel
    }
  }

  const detalhes = [
    `Taxa cilindrada: ${taxaCilindrada.toFixed(2)}€`,
    `Taxa CO2: ${taxaCO2.toFixed(2)}€`,
    taxaAdicionalCO2 > 0 ? `Taxa adicional CO2: ${taxaAdicionalCO2.toFixed(2)}€` : null,
    `Coeficiente idade (${anoMatricula}): ${coeficiente.toFixed(2)}`,
    taxaAdicionalDiesel > 0 ? `Taxa adicional diesel: ${taxaAdicionalDiesel.toFixed(2)}€` : null,
  ]
    .filter(Boolean)
    .join(' | ')

  return {
    valor: Math.round(valorBase * 100) / 100, // Arredondar para 2 casas decimais
    periodo: '2007+',
    tipoCombustivel,
    tipoViatura: 'passageiros',
    mensagem: `IUC calculado para ${tipoCombustivel === 'gasolina' ? 'Gasolina' : 'Diesel'} (matrícula ${anoMatricula})`,
    detalhes,
    calculoCompleto: true,
  }
}
