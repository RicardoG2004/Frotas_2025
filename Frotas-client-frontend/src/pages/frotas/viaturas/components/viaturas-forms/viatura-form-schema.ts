import { z } from 'zod'
import {
  VIATURA_PROPULSAO_TYPES,
  type ViaturaPropulsao,
} from '@/types/dtos/frotas/viaturas.dtos'

const dateWithMessages = (requiredMessage: string, invalidMessage: string) =>
  z.date({
    required_error: requiredMessage,
    invalid_type_error: invalidMessage,
  } as any)

const DOCUMENTOS_STORAGE_VERSION = 1

const viaturaDocumentoSchema = z.object({
  nome: z.string().min(1),
  dados: z.string().min(1),
  contentType: z.string().min(1),
  tamanho: z.number().nonnegative(),
  pasta: z
    .string()
    .max(120, { message: 'O nome da pasta é demasiado longo.' })
    .optional()
    .nullable(),
})

type ViaturaDocumentoSchemaType = z.infer<typeof viaturaDocumentoSchema>

const sanitizeDocumento = (documento: unknown): ViaturaDocumentoSchemaType | null => {
  const parsed = viaturaDocumentoSchema.safeParse(documento)
  return parsed.success ? parsed.data : null
}

export const parseDocumentosPayload = (
  payload?: string | null | undefined
): ViaturaDocumentoSchemaType[] => {
  if (!payload) {
    return []
  }

  const trimmed = payload.trim()
  if (!trimmed) {
    return []
  }

  try {
    const parsed = JSON.parse(trimmed) as {
      version?: number
      files?: unknown[]
    }

    if (
      parsed &&
      Array.isArray(parsed.files) &&
      (parsed.version === undefined || parsed.version === DOCUMENTOS_STORAGE_VERSION)
    ) {
      return parsed.files
        .map(sanitizeDocumento)
        .filter((doc): doc is ViaturaDocumentoSchemaType => doc !== null)
    }
  } catch (_error) {
    // Não é JSON, continuar para os formatos legacy
  }

  if (trimmed.startsWith('data:')) {
    const matches = trimmed.match(/^data:([^;]+);base64,(.+)$/)
    if (matches) {
      const mimeType = matches[1]
      const base64Data = matches[2]
      const estimatedSize = Math.round((base64Data.length * 3) / 4)
      const extension = mimeType.split('/')[1]?.split(';')[0] || 'bin'
      return [
        {
          nome: `documento.${extension}`,
          dados: trimmed,
          contentType: mimeType,
          tamanho: estimatedSize,
        },
      ]
    }
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    const lastSegment = trimmed.split('/').pop()
    return [
      {
        nome: lastSegment && lastSegment.length < 120 ? lastSegment : 'documento',
        dados: trimmed,
        contentType: 'application/octet-stream',
        tamanho: 0,
      },
    ]
  }

  return []
}

export const parseViaturaDocumentosFromPair = (
  urlImagem1?: string | null,
  urlImagem2?: string | null
): ViaturaDocumentoSchemaType[] => [
  ...parseDocumentosPayload(urlImagem1),
  ...parseDocumentosPayload(urlImagem2),
]

export const encodeViaturaDocumentos = (
  documentos: ViaturaDocumentoSchemaType[] | undefined
): string => {
  if (!documentos?.length) {
    return ''
  }

  return JSON.stringify({
    version: DOCUMENTOS_STORAGE_VERSION,
    files: documentos.map((documento) => ({
      nome: documento.nome,
      dados: documento.dados,
      contentType: documento.contentType,
      tamanho: documento.tamanho,
      pasta: documento.pasta ?? undefined,
    })),
  })
}

export type ViaturaDocumentoFormValue = ViaturaDocumentoSchemaType

// Tipo para documentos dos condutores: Map<condutorId, documentos[]>
export type CondutoresDocumentosFormValue = Record<string, ViaturaDocumentoFormValue[]>

// Codificar documentos dos condutores para string JSON
export const encodeCondutoresDocumentos = (
  condutoresDocumentos: CondutoresDocumentosFormValue | undefined
): string => {
  if (!condutoresDocumentos || Object.keys(condutoresDocumentos).length === 0) {
    return ''
  }

  return JSON.stringify({
    version: DOCUMENTOS_STORAGE_VERSION,
    condutores: Object.entries(condutoresDocumentos).map(([condutorId, documentos]) => ({
      condutorId,
      documentos: documentos.map((documento) => ({
        nome: documento.nome,
        dados: documento.dados,
        contentType: documento.contentType,
        tamanho: documento.tamanho,
        pasta: documento.pasta ?? undefined,
      })),
    })),
  })
}

// Descodificar documentos dos condutores de string JSON
export const parseCondutoresDocumentos = (
  payload?: string | null | undefined
): CondutoresDocumentosFormValue => {
  if (!payload) {
    return {}
  }

  const trimmed = payload.trim()
  if (!trimmed) {
    return {}
  }

  try {
    const parsed = JSON.parse(trimmed) as {
      version?: number
      condutores?: Array<{
        condutorId: string
        documentos: unknown[]
      }>
    }

    if (
      parsed &&
      Array.isArray(parsed.condutores) &&
      (parsed.version === undefined || parsed.version === DOCUMENTOS_STORAGE_VERSION)
    ) {
      const result: CondutoresDocumentosFormValue = {}
      parsed.condutores.forEach(({ condutorId, documentos }) => {
        const documentosSanitizados = documentos
          .map(sanitizeDocumento)
          .filter((doc): doc is ViaturaDocumentoSchemaType => doc !== null)
        if (documentosSanitizados.length > 0) {
          result[condutorId] = documentosSanitizados
        }
      })
      return result
    }
  } catch (_error) {
    // Erro ao fazer parse, retornar objeto vazio
  }

  return {}
}

// Campo UUID opcional - aceita qualquer string ou null, sem validação de formato
const optionalUuidField = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined) {
      return null
    }
    if (typeof val === 'string') {
      const trimmed = val.trim()
      return trimmed === '' ? null : trimmed
    }
    return val
  },
  z.string().nullable().optional().default(null)
)

const uuidOrEmpty = optionalUuidField

// Schema para validação de inspeções de viatura
const viaturaInspecaoSchema = z
  .object({
    id: z.preprocess(
      (value) => {
        if (value === '' || value === null || value === undefined) {
          return undefined
        }
        return value
      },
      z.string().optional()
    ),
    dataInspecao: z.preprocess(
      (value) => (value ? new Date(value as string | number | Date) : null),
      dateWithMessages('A data da inspeção é obrigatória', 'A data da inspeção é inválida')
    ),
    resultado: z.string().min(1, { message: 'O resultado é obrigatório' }),
    dataProximaInspecao: z.preprocess(
      (value) => (value ? new Date(value as string | number | Date) : null),
      dateWithMessages(
        'A data da próxima inspeção é obrigatória',
        'A data da próxima inspeção é inválida'
      )
    ),
    // Campo para documentos anexados a esta inspeção
    // Porquê: Permite anexar documentos específicos de cada inspeção (certificados, relatórios, etc.)
    documentos: z.array(viaturaDocumentoSchema).optional().default([]),
  })
  .refine(
    (inspection) => inspection.dataProximaInspecao > inspection.dataInspecao,
    {
      path: ['dataProximaInspecao'],
      message: 'A data da próxima inspeção deve ser posterior à data da inspeção.',
    }
  )

const viaturaAcidenteSchema = z.object({
  id: z.preprocess(
    (value) => (value === '' || value === null ? undefined : value),
    z.string().optional()
  ),
  condutorId: z.preprocess(
    (val) => {
      if (val === null || val === undefined) return ''
      if (typeof val === 'string') return val.trim()
      return String(val)
    },
    z.string().optional().default('')
  ),
  dataHora: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    z.date().optional().nullable()
  ),
  hora: z.string().optional().default(''),
  culpa: z.boolean().default(false),
  descricaoAcidente: z.string().optional().default(''),
  descricaoDanos: z.string().optional().default(''),
  local: z.preprocess(
    (val) => {
      if (val === null || val === undefined) return ''
      if (typeof val === 'string') return val.trim()
      return String(val)
    },
    z.string().optional().default('')
  ),
  concelhoId: uuidOrEmpty,
  freguesiaId: uuidOrEmpty,
  codigoPostalId: uuidOrEmpty,
  localReparacao: z.string().optional().default(''),
})
// Não validar acidentes - serão filtrados no envio
// O filtro no mapFormValuesToPayload já garante que apenas acidentes completos são enviados

const viaturaMultaSchema = z.object({
  id: z.preprocess(
    (value) => (value === '' || value === null ? undefined : value),
    z.string().optional()
  ),
  condutorId: z.preprocess(
    (val) => {
      if (val === null || val === undefined) return ''
      if (typeof val === 'string') return val.trim()
      return String(val)
    },
    z.string().optional().default('')
  ),
  dataHora: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    z.date().optional().nullable()
  ),
  hora: z.string().optional().default(''),
  local: z.preprocess(
    (val) => {
      if (val === null || val === undefined) return ''
      if (typeof val === 'string') return val.trim()
      return String(val)
    },
    z.string().optional().default('')
  ),
  motivo: z.preprocess(
    (val) => {
      if (val === null || val === undefined) return ''
      if (typeof val === 'string') return val.trim()
      return String(val)
    },
    z.string().optional().default('')
  ),
  valor: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0, { message: 'O valor deve ser positivo' }).optional()
  ),
})
// Não validar multas - serão filtradas no envio
// O filtro no mapFormValuesToPayload já garante que apenas multas completas são enviadas

const requiredUuidField = (message: string) =>
  z.preprocess(
    (val) => {
      // Normalize: convert null/undefined to empty string, trim whitespace
      if (val === null || val === undefined) {
        return ''
      }
      const str = String(val)
      return str.trim()
    },
    z
      .string({ message })
      .superRefine((val, ctx) => {
        // First check: must not be empty
        if (!val || val.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            minimum: 1,
            type: 'string',
            origin: 'string',
            inclusive: true,
            message,
          })
          return // Stop validation here if empty
        }
        // Second check: must be valid UUID (only if not empty)
        const uuidRegex =
          /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
        if (!uuidRegex.test(val)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message,
          })
        }
      })
  )

export const viaturaPropulsaoOptions = VIATURA_PROPULSAO_TYPES
export type ViaturaPropulsaoType = ViaturaPropulsao

// Helper function to filter invalid UUIDs from arrays
const filterValidUuids = (val: unknown): string[] => {
  if (!val || !Array.isArray(val)) {
    return []
  }
  // Filtrar valores inválidos: apenas manter UUIDs válidos
  return val.filter((item) => {
    if (!item || typeof item !== 'string') {
      return false
    }
    const trimmed = item.trim()
    if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') {
      return false
    }
    // Verificar se é um UUID válido usando regex básico (formato relaxado: 8-4-4-4-12)
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
    return uuidRegex.test(trimmed)
  })
}

const viaturaFormSchemaObject = z.object({
  matricula: z.string().optional().default(''),
  countryCode: z
    .string()
    .max(3, { message: 'O código do país deve ter no máximo 3 caracteres' })
    .optional()
    .default('PT'),
  numero: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().nonnegative({ message: 'O número deve ser positivo' }).optional()
  ),
  anoFabrico: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().optional().nullable()
  ),
  mesFabrico: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().optional().nullable()
  ),
  dataAquisicao: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    z.date().optional().nullable()
  ),
  dataLivrete: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    z.date().optional().nullable()
  ),
  marcaId: optionalUuidField,
  modeloId: optionalUuidField,
  tipoViaturaId: optionalUuidField,
  corId: optionalUuidField,
  combustivelId: optionalUuidField,
  conservatoriaId: optionalUuidField,
  categoriaId: optionalUuidField,
  localizacaoId: optionalUuidField,
  setorId: optionalUuidField,
  delegacaoId: optionalUuidField,
  tipoPropulsao: z
    .enum(viaturaPropulsaoOptions)
    .or(z.literal(''))
    .optional()
    .default(''),
  entidadeFornecedoraTipo: z
    .enum(['fornecedor', 'terceiro'])
    .or(z.literal(''))
    .optional()
    .default(''),
  terceiroId: uuidOrEmpty,
  fornecedorId: uuidOrEmpty,
  custo: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  despesasIncluidas: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  consumoMedio: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  autonomia: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  nQuadro: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().nonnegative().optional()
  ),
  nMotor: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().nonnegative().optional()
  ),
  cilindrada: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  capacidadeBateria: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  potencia: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  potenciaMotorEletrico: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  potenciaCombinada: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  consumoEletrico: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  tempoCarregamento: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  emissoesCO2: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  padraoCO2: z.enum(['NEDC', 'WLTP']).or(z.literal('')).optional().default(''),
  voltagemTotal: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  tara: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().nonnegative().optional()
  ),
  lotacao: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().nonnegative().optional()
  ),
  marketing: z.boolean().optional().default(false),
  mercadorias: z.boolean().optional().default(false),
  cargaUtil: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().nonnegative().optional()
  ),
  comprimento: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().nonnegative().optional()
  ),
  largura: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().nonnegative().optional()
  ),
  pneusFrente: z.string().optional().default(''),
  pneusTras: z.string().optional().default(''),
  contrato: z.string().optional().default(''),
  dataInicial: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    z.date().optional().nullable()
  ),
  dataFinal: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    z.date().optional().nullable()
  ),
  valorTotalContrato: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  opcaoCompra: z.boolean().optional().default(false),
  nRendas: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().nonnegative().optional()
  ),
  valorRenda: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  valorResidual: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  seguroIds: z.preprocess(
    filterValidUuids,
    z.array(z.string().min(1)).optional().default([])
  ),
  notasAdicionais: z.string().optional().default(''),
  cartaoCombustivel: z.string().optional().default(''),
  anoImpostoSelo: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined || val === 0) {
        return undefined
      }
      const num = Number(val)
      return isNaN(num) || num === 0 ? undefined : num
    },
    z
      .number()
      .optional()
      .refine((val) => val === undefined || val >= 1900, {
        message: 'Ano inválido',
      })
  ),
  anoImpostoCirculacao: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined || val === 0) {
        return undefined
      }
      const num = Number(val)
      return isNaN(num) || num === 0 ? undefined : num
    },
    z
      .number()
      .optional()
      .refine((val) => val === undefined || val >= 1900, {
        message: 'Ano inválido',
      })
  ),
  dataValidadeSelo: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    z.date().optional().nullable()
  ),
  imagem: z.array(viaturaDocumentoSchema).optional().default([]),
  documentos: z.array(viaturaDocumentoSchema).optional().default([]),
  equipamentoIds: z.preprocess(
    filterValidUuids,
    z.array(z.string().min(1)).optional().default([])
  ),
  garantiaIds: z.preprocess(
    filterValidUuids,
    z.array(z.string().min(1)).optional().default([])
  ),
  condutorIds: z.preprocess(
    filterValidUuids,
    z.array(z.string().min(1)).optional().default([])
  ),
  condutoresDocumentos: z.record(z.string(), z.array(viaturaDocumentoSchema)).optional().default({}),
  inspecoes: z.array(viaturaInspecaoSchema).optional().default([]),
  acidentes: z.array(viaturaAcidenteSchema).optional().default([]),
  multas: z.array(viaturaMultaSchema).optional().default([]),
})

// Schema sem validações condicionais - apenas matricula, marcaId e modeloId são obrigatórios
// Todos os outros campos são opcionais e podem ficar vazios
export const viaturaFormSchema = viaturaFormSchemaObject

export type ViaturaFormSchemaType = z.infer<typeof viaturaFormSchema>
export type ViaturaInspecaoFormSchemaType = z.infer<typeof viaturaInspecaoSchema>
export type ViaturaAcidenteFormSchemaType = z.infer<typeof viaturaAcidenteSchema>
export type ViaturaMultaFormSchemaType = z.infer<typeof viaturaMultaSchema>

export const defaultViaturaFormValues: Partial<ViaturaFormSchemaType> = {
  matricula: '',
  countryCode: 'PT',
  numero: undefined,
  anoFabrico: undefined,
  mesFabrico: undefined,
  dataAquisicao: undefined,
  dataLivrete: undefined,
  marcaId: '',
  modeloId: '',
  tipoViaturaId: null,
  corId: null,
  combustivelId: null,
  conservatoriaId: null,
  categoriaId: null,
  localizacaoId: null,
  setorId: null,
  delegacaoId: null,
  tipoPropulsao: '',
  entidadeFornecedoraTipo: '',
  terceiroId: null,
  fornecedorId: null,
  custo: undefined,
  despesasIncluidas: undefined,
  consumoMedio: undefined,
  autonomia: undefined,
  nQuadro: undefined,
  nMotor: undefined,
  cilindrada: undefined,
  capacidadeBateria: undefined,
  potencia: undefined,
  potenciaMotorEletrico: undefined,
  potenciaCombinada: undefined,
  consumoEletrico: undefined,
  tempoCarregamento: undefined,
  emissoesCO2: undefined,
  padraoCO2: '',
  voltagemTotal: undefined,
  tara: undefined,
  lotacao: undefined,
  marketing: false,
  mercadorias: false,
  cargaUtil: undefined,
  comprimento: undefined,
  largura: undefined,
  pneusFrente: '',
  pneusTras: '',
  contrato: '',
  dataInicial: undefined,
  dataFinal: undefined,
  valorTotalContrato: undefined,
  opcaoCompra: false,
  nRendas: undefined,
  valorRenda: undefined,
  valorResidual: undefined,
  seguroIds: [],
  notasAdicionais: '',
  cartaoCombustivel: '',
  anoImpostoSelo: undefined,
  anoImpostoCirculacao: undefined,
  dataValidadeSelo: undefined,
  imagem: [],
  documentos: [],
  equipamentoIds: [],
  garantiaIds: [],
  condutorIds: [],
  condutoresDocumentos: {},
  inspecoes: [],
  acidentes: [],
  multas: [],
}

