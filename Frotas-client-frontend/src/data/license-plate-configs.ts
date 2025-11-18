export interface LicensePlateConfig {
  plateCode: string // Código que aparece na placa (ex: "P" para Portugal, "D" para Alemanha)
  format: string // Formato da matrícula (ex: "AA-00-AA")
  plateColor: string // Cor de fundo da placa
  textColor: string // Cor do texto
  description: string // Descrição do formato
  hideEUFlag?: boolean // Se true, esconde a bandeira da UE (para países não-UE como CH e GB)
}

export const licensePlateConfigs: Record<string, LicensePlateConfig> = {
  PT: {
    plateCode: 'P',
    format: 'AA 00 AA',
    plateColor: '#fff',
    textColor: '#000',
    description: 'Formato: AA 00 AA (ex: AB 12 CD)',
  },
  ES: {
    plateCode: 'E',
    format: '0000 AAA',
    plateColor: '#fff',
    textColor: '#000',
    description: 'Formato: 0000 AAA (ex: 1234 ABC)',
  },
  FR: {
    plateCode: 'F',
    format: 'AA-000-AA',
    plateColor: '#fff',
    textColor: '#000',
    description: 'Formato: AA-000-AA (ex: AB-123-CD)',
  },
  DE: {
    plateCode: 'D',
    format: 'X-AA 0000',
    plateColor: '#fff',
    textColor: '#000',
    description: 'Formato: X-AA 0000 (cidade + selo + combinação)',
  },
  IT: {
    plateCode: 'I',
    format: 'AA 000 AA',
    plateColor: '#fff',
    textColor: '#000',
    description: 'Formato: AA 000 AA (ex: AB 123 CD)',
  },
  NL: {
    plateCode: 'NL',
    format: 'AA-000-A',
    plateColor: '#FFD700', // Amarelo
    textColor: '#000',
    description: 'Formato: AA-000-A (ex: AB-123-C)',
  },
  BE: {
    plateCode: 'B',
    format: '0-AAA-000',
    plateColor: '#fff',
    textColor: '#FF0000', // Vermelho
    description: 'Formato: 0-AAA-000 (ex: 0-ABC-123)',
  },
  AT: {
    plateCode: 'A',
    format: 'XX 000 AA',
    plateColor: '#fff',
    textColor: '#000',
    description: 'Formato: XX 000 AA (ex: W 123 AB)',
  },
  SE: {
    plateCode: 'S',
    format: 'ABC 00A',
    plateColor: '#fff',
    textColor: '#000',
    description: 'Formato: ABC 00A (ex: ABC 12D)',
  },
  FI: {
    plateCode: 'FIN',
    format: 'ABC-123',
    plateColor: '#fff',
    textColor: '#000',
    description: 'Formato: ABC-123 (ex: ABC-123)',
  },
  DK: {
    plateCode: 'DK',
    format: 'XX 00 000',
    plateColor: '#fff',
    textColor: '#000',
    description: 'Formato: XX 00 000 (ex: AB 12 345)',
  },
  PL: {
    plateCode: 'PL',
    format: 'XX 00000',
    plateColor: '#fff',
    textColor: '#000',
    description: 'Formato: XX 00000 (ex: AB 12345)',
  },
  CZ: {
    plateCode: 'CZ',
    format: '0A0 0000',
    plateColor: '#fff',
    textColor: '#000',
    description: 'Formato: 0A0 0000 (ex: 1A2 3456)',
  },
  GB: {
    plateCode: 'UK',
    format: 'AA00 AAA',
    plateColor: '#fff',
    textColor: '#000',
    description: 'Formato: AA00 AAA (ex: AB12 CDE)',
    hideEUFlag: false, // Mostrar faixa azul da UE para colocar o brasão dentro
  },
  LU: {
    plateCode: 'L',
    format: '0000-00',
    plateColor: '#FFD700', // Amarelo
    textColor: '#000',
    description: 'Formato: 0000-00 (ex: 1234-56)',
  },
  CH: {
    plateCode: 'CH',
    format: 'XX·000000',
    plateColor: '#fff',
    textColor: '#000',
    description: 'Formato: XX·000000 (código do cantão + números)',
    hideEUFlag: true,
  },
}

// Função para formatar a matrícula baseada no país
export const formatLicensePlate = (value: string, countryCode: string): string => {
  const config = licensePlateConfigs[countryCode]
  if (!config || !value) return value

  // Remove todos os caracteres não alfanuméricos
  const cleanValue = value.replace(/[^A-Z0-9]/gi, '').toUpperCase()
  
  if (!cleanValue) return ''

  // Separa letras e números
  const letters: string[] = []
  const numbers: string[] = []
  
  for (const char of cleanValue) {
    if (/[A-Z]/.test(char)) {
      letters.push(char)
    } else if (/[0-9]/.test(char)) {
      numbers.push(char)
    }
  }

  // Aplica o formato baseado no padrão
  const format = config.format
  let formatted = ''
  let letterIndex = 0
  let numberIndex = 0

  for (let i = 0; i < format.length; i++) {
    const char = format[i]
    if (char === 'A' || char === 'X' || char === 'Y') {
      // Espera letra
      if (letterIndex < letters.length) {
        formatted += letters[letterIndex]
        letterIndex++
      }
    } else if (char === '0') {
      // Espera número
      if (numberIndex < numbers.length) {
        formatted += numbers[numberIndex]
        numberIndex++
      }
    } else {
      // É um separador (espaço, hífen, etc) - só adiciona se já tiver conteúdo antes
      if (formatted.length > 0) {
        formatted += char
      }
    }
  }

  return formatted
}

// Função para obter o código da placa baseado no código do país
export const getPlateCode = (countryCode: string): string => {
  return licensePlateConfigs[countryCode]?.plateCode || countryCode
}

// Função para obter a configuração completa
export const getLicensePlateConfig = (countryCode: string): LicensePlateConfig | null => {
  return licensePlateConfigs[countryCode] || null
}

