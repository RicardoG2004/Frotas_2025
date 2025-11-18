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

const parseDocumentosPayload = (
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

const viaturaInspecaoSchema = z
  .object({
    id: z.string().uuid().optional(),
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
  })
  .refine(
    (inspection) => inspection.dataProximaInspecao > inspection.dataInspecao,
    {
      path: ['dataProximaInspecao'],
      message: 'A data da próxima inspeção deve ser posterior à data da inspeção.',
    }
  )

const viaturaAcidenteSchema = z.object({
  id: z.string().uuid().optional(),
  condutorId: z
    .string()
    .min(1, { message: 'O condutor é obrigatório' })
    .uuid({ message: 'Selecione o condutor' }),
  dataHora: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    dateWithMessages('A data/hora é obrigatória', 'A data/hora é inválida')
  ),
  hora: z.string().optional().default(''),
  culpa: z.boolean().default(false),
  descricaoAcidente: z.string().optional().default(''),
  descricaoDanos: z.string().optional().default(''),
  local: z.string().min(1, { message: 'O local é obrigatório' }),
  concelhoId: z.string().uuid().or(z.literal('')).optional().default(''),
  freguesiaId: z.string().uuid().or(z.literal('')).optional().default(''),
  codigoPostalId: z.string().uuid().or(z.literal('')).optional().default(''),
  localReparacao: z.string().optional().default(''),
})

const viaturaMultaSchema = z.object({
  id: z.string().uuid().optional(),
  condutorId: z
    .string()
    .min(1, { message: 'O condutor é obrigatório' })
    .uuid({ message: 'Selecione o condutor' }),
  dataHora: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    dateWithMessages('A data é obrigatória', 'A data é inválida')
  ),
  hora: z.string().optional().default(''),
  local: z.string().min(1, { message: 'O local é obrigatório' }),
  motivo: z.string().min(1, { message: 'O motivo é obrigatório' }),
  valor: z.coerce.number().min(0, { message: 'O valor deve ser positivo' }),
})

const uuidOrEmpty = z.string().uuid({ message: 'Selecione um valor válido' }).or(z.literal(''))

export const viaturaPropulsaoOptions = VIATURA_PROPULSAO_TYPES
export type ViaturaPropulsaoType = ViaturaPropulsao

const viaturaFormSchemaObject = z.object({
  matricula: z
    .string({ message: 'A matrícula é obrigatória' })
    .min(1, { message: 'A matrícula é obrigatória' }),
  countryCode: z
    .string()
    .max(3, { message: 'O código do país deve ter no máximo 3 caracteres' })
    .optional()
    .default('PT'),
  numero: z.coerce.number().nonnegative({ message: 'O número deve ser positivo' }).optional(),
  anoFabrico: z.coerce
    .number()
    .min(1900, { message: 'Ano inválido' })
    .max(new Date().getFullYear() + 1, { message: 'Ano inválido' })
    .optional(),
  mesFabrico: z.coerce.number().int().min(1).max(12).optional(),
  dataAquisicao: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    z.date().optional().nullable()
  ),
  dataLivrete: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    z.date().optional().nullable()
  ),
  marcaId: z.string().uuid({ message: 'Selecione a marca' }),
  modeloId: z.string().uuid({ message: 'Selecione o modelo' }),
  tipoViaturaId: z.string().uuid().or(z.literal('')).optional().default(''),
  corId: z.string().uuid().or(z.literal('')).optional().default(''),
  combustivelId: z.string().uuid().or(z.literal('')).optional().default(''),
  conservatoriaId: z.string().uuid().or(z.literal('')).optional().default(''),
  categoriaId: z.string().uuid().or(z.literal('')).optional().default(''),
  localizacaoId: z.string().uuid().or(z.literal('')).optional().default(''),
  setorId: z.string().uuid().or(z.literal('')).optional().default(''),
  delegacaoId: z.string().uuid().or(z.literal('')).optional().default(''),
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
  terceiroId: uuidOrEmpty.optional().default(''),
  fornecedorId: uuidOrEmpty.optional().default(''),
  custo: z.coerce.number().min(0).optional(),
  despesasIncluidas: z.coerce.number().min(0).optional(),
  consumoMedio: z.coerce.number().min(0).optional(),
  autonomia: z.coerce.number().min(0).optional(),
  nQuadro: z.coerce.number().nonnegative().optional(),
  nMotor: z.coerce.number().nonnegative().optional(),
  cilindrada: z.coerce.number().min(0).optional(),
  capacidadeBateria: z.coerce.number().min(0).optional(),
  potencia: z.coerce.number().min(0).optional(),
  tara: z.coerce.number().nonnegative().optional(),
  lotacao: z.coerce.number().nonnegative().optional(),
  marketing: z.boolean().optional().default(false),
  mercadorias: z.boolean().optional().default(false),
  cargaUtil: z.coerce.number().nonnegative().optional(),
  comprimento: z.coerce.number().nonnegative().optional(),
  largura: z.coerce.number().nonnegative().optional(),
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
  valorTotalContrato: z.coerce.number().min(0).optional(),
  opcaoCompra: z.boolean().optional().default(false),
  nRendas: z.coerce.number().nonnegative().optional(),
  valorRenda: z.coerce.number().min(0).optional(),
  valorResidual: z.coerce.number().min(0).optional(),
  seguroIds: z
    .array(z.string().uuid({ message: 'Selecione um seguro válido' }))
    .optional()
    .default([]),
  notasAdicionais: z.string().optional().default(''),
  cartaoCombustivel: z.string().optional().default(''),
  anoImpostoSelo: z.coerce.number().min(1900).optional(),
  anoImpostoCirculacao: z.coerce.number().min(1900).optional(),
  dataValidadeSelo: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    z.date().optional().nullable()
  ),
  urlImagem1: z.string().optional().default(''),
  urlImagem2: z.string().optional().default(''),
  documentos: z.array(viaturaDocumentoSchema).optional().default([]),
  equipamentoIds: z
    .array(z.string().uuid({ message: 'Selecione um equipamento válido' }))
    .optional()
    .default([]),
  garantiaIds: z
    .array(z.string().uuid({ message: 'Selecione uma garantia válida' }))
    .optional()
    .default([]),
  condutorIds: z
    .array(z.string().uuid({ message: 'Selecione um condutor válido' }))
    .optional()
    .default([]),
  inspecoes: z.array(viaturaInspecaoSchema).optional().default([]),
  acidentes: z.array(viaturaAcidenteSchema).optional().default([]),
  multas: z.array(viaturaMultaSchema).optional().default([]),
})

export const viaturaFormSchema = viaturaFormSchemaObject.superRefine((data, ctx) => {
  // Validação condicional para entidade fornecedora (apenas se preenchida)
  const entidadeTipo = data.entidadeFornecedoraTipo
  if (entidadeTipo && typeof entidadeTipo === 'string' && entidadeTipo.trim() !== '') {
    if (entidadeTipo === 'fornecedor') {
      if (!data.fornecedorId || data.fornecedorId === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione o fornecedor',
          path: ['fornecedorId'],
        })
      }
    } else if (entidadeTipo === 'terceiro') {
      if (!data.terceiroId || data.terceiroId === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione o outro devedor/credor',
          path: ['terceiroId'],
        })
      }
    }
  }

  // Validações condicionais para inspeções (apenas se houver inspeções)
  const inspections = data.inspecoes ?? []
  if (inspections.length >= 2) {
    for (let index = 0; index < inspections.length - 1; index += 1) {
      const current = inspections[index]
      const next = inspections[index + 1]

      if (next.dataInspecao <= current.dataInspecao) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['inspecoes', index + 1, 'dataInspecao'],
          message: 'As inspeções devem ser registadas por ordem cronológica.',
        })
      }

      if (current.dataProximaInspecao && next.dataInspecao && current.dataProximaInspecao.getTime() !== next.dataInspecao.getTime()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['inspecoes', index, 'dataProximaInspecao'],
          message: 'A data da próxima inspeção deve coincidir com a data da inspeção seguinte.',
        })
      }
    }
  }
})

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
  tipoViaturaId: '',
  corId: '',
  combustivelId: '',
  conservatoriaId: '',
  categoriaId: '',
  localizacaoId: '',
  setorId: '',
  delegacaoId: '',
  tipoPropulsao: '',
  entidadeFornecedoraTipo: '',
  terceiroId: '',
  fornecedorId: '',
  custo: undefined,
  despesasIncluidas: undefined,
  consumoMedio: undefined,
  autonomia: undefined,
  nQuadro: undefined,
  nMotor: undefined,
  cilindrada: undefined,
  capacidadeBateria: undefined,
  potencia: undefined,
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
  urlImagem1: '',
  urlImagem2: '',
  documentos: [],
  equipamentoIds: [],
  garantiaIds: [],
  condutorIds: [],
  inspecoes: [],
  acidentes: [],
  multas: [],
}

