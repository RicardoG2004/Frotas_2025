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

const uuidOrEmpty = z.string().uuid({ message: 'Selecione um valor válido' }).or(z.literal(''))

export const viaturaPropulsaoOptions = VIATURA_PROPULSAO_TYPES
export type ViaturaPropulsaoType = ViaturaPropulsao

const viaturaFormSchemaObject = z.object({
  matricula: z
    .string({ message: 'A matrícula é obrigatória' })
    .min(1, { message: 'A matrícula é obrigatória' }),
  numero: z.coerce.number().nonnegative({ message: 'O número deve ser positivo' }),
  anoFabrico: z.coerce
    .number()
    .min(1900, { message: 'Ano inválido' })
    .max(new Date().getFullYear() + 1, { message: 'Ano inválido' }),
  mesFabrico: z.coerce.number().int().min(1).max(12),
  dataAquisicao: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    dateWithMessages('A data de aquisição é obrigatória', 'A data de aquisição é inválida')
  ),
  dataLivrete: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    dateWithMessages('A data do livrete é obrigatória', 'A data do livrete é inválida')
  ),
  marcaId: z.string().uuid({ message: 'Selecione a marca' }),
  modeloId: z.string().uuid({ message: 'Selecione o modelo' }),
  tipoViaturaId: z.string().uuid({ message: 'Selecione o tipo de viatura' }),
  corId: z.string().uuid({ message: 'Selecione a cor' }),
  combustivelId: z.string().uuid({ message: 'Selecione o combustível' }),
  conservatoriaId: z.string().uuid({ message: 'Selecione a conservatória' }),
  categoriaId: z.string().uuid({ message: 'Selecione a categoria' }),
  localizacaoId: z.string().uuid({ message: 'Selecione a localização' }),
  setorId: z.string().uuid({ message: 'Selecione o setor' }),
  delegacaoId: z.string().uuid({ message: 'Selecione a delegação' }),
  tipoPropulsao: z
    .enum(viaturaPropulsaoOptions)
    .or(z.literal(''))
    .refine((value): value is ViaturaPropulsaoType => value !== '', {
      message: 'Selecione o tipo de motorização',
    }),
  entidadeFornecedoraTipo: z
    .enum(['fornecedor', 'terceiro'])
    .or(z.literal(''))
    .refine((value) => value === '' || value === 'fornecedor' || value === 'terceiro', {
      message: 'Selecione o tipo de entidade fornecedora',
    }),
  terceiroId: uuidOrEmpty,
  fornecedorId: uuidOrEmpty,
  custo: z.coerce.number().min(0),
  despesasIncluidas: z.coerce.number().min(0),
  consumoMedio: z.coerce.number().min(0),
  autonomia: z.coerce.number().min(0).optional(),
  nQuadro: z.coerce.number().nonnegative(),
  nMotor: z.coerce.number().nonnegative(),
  cilindrada: z.coerce.number().min(0).optional(),
  capacidadeBateria: z.coerce.number().min(0).optional(),
  potencia: z.coerce.number().min(0),
  tara: z.coerce.number().nonnegative(),
  lotacao: z.coerce.number().nonnegative(),
  marketing: z.boolean(),
  mercadorias: z.boolean(),
  cargaUtil: z.coerce.number().nonnegative(),
  comprimento: z.coerce.number().nonnegative(),
  largura: z.coerce.number().nonnegative(),
  pneusFrente: z.string().optional().default(''),
  pneusTras: z.string().optional().default(''),
  contrato: z.string().optional().default(''),
  dataInicial: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    dateWithMessages('A data inicial é obrigatória', 'A data inicial é inválida')
  ),
  dataFinal: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    dateWithMessages('A data final é obrigatória', 'A data final é inválida')
  ),
  valorTotalContrato: z.coerce.number().min(0),
  opcaoCompra: z.boolean(),
  nRendas: z.coerce.number().nonnegative(),
  valorRenda: z.coerce.number().min(0),
  valorResidual: z.coerce.number().min(0),
  seguroIds: z
    .array(z.string().uuid({ message: 'Selecione um seguro válido' }))
    .min(1, { message: 'Selecione pelo menos um seguro' }),
  notasAdicionais: z.string().optional().default(''),
  cartaoCombustivel: z.string().optional().default(''),
  anoImpostoSelo: z.coerce.number().min(1900),
  anoImpostoCirculacao: z.coerce.number().min(1900),
  dataValidadeSelo: z.preprocess(
    (value) => (value ? new Date(value as string | number | Date) : null),
    dateWithMessages(
      'A data de validade do selo é obrigatória',
      'A data de validade do selo é inválida'
    )
  ),
  urlImagem1: z.string().optional().default(''),
  urlImagem2: z.string().optional().default(''),
  documentos: z.array(viaturaDocumentoSchema).optional().default([]),
  equipamentoIds: z
    .array(z.string().uuid({ message: 'Selecione um equipamento válido' }))
    .min(1, { message: 'Selecione pelo menos um equipamento' }),
  garantiaIds: z
    .array(z.string().uuid({ message: 'Selecione uma garantia válida' }))
    .min(1, { message: 'Selecione pelo menos uma garantia' }),
  inspecoes: z.array(viaturaInspecaoSchema).optional().default([]),
})

export const viaturaFormSchema = viaturaFormSchemaObject.superRefine((data, ctx) => {
  if (data.entidadeFornecedoraTipo === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Selecione o tipo de entidade fornecedora',
      path: ['entidadeFornecedoraTipo'],
    })
  } else if (data.entidadeFornecedoraTipo === 'fornecedor') {
    if (!data.fornecedorId || data.fornecedorId === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione o fornecedor',
        path: ['fornecedorId'],
      })
    }
  } else if (data.entidadeFornecedoraTipo === 'terceiro') {
    if (!data.terceiroId || data.terceiroId === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione o outro devedor/credor',
        path: ['terceiroId'],
      })
    }
  }

  const inspections = data.inspecoes ?? []

  const isElectric = data.tipoPropulsao === 'eletrico'
  const isHybrid = data.tipoPropulsao === 'hibrido'
  if (isElectric || isHybrid) {
    if (data.autonomia === undefined || Number.isNaN(data.autonomia)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Indique a autonomia estimada',
        path: ['autonomia'],
      })
    }
    if (data.capacidadeBateria === undefined || Number.isNaN(data.capacidadeBateria)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Indique a capacidade da bateria',
        path: ['capacidadeBateria'],
      })
    }
  }
  if (!isElectric && (data.cilindrada === undefined || Number.isNaN(data.cilindrada))) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Indique a cilindrada do motor',
      path: ['cilindrada'],
    })
  }

  if (inspections.length < 2) {
    return
  }

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

    if (current.dataProximaInspecao.getTime() !== next.dataInspecao.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['inspecoes', index, 'dataProximaInspecao'],
        message: 'A data da próxima inspeção deve coincidir com a data da inspeção seguinte.',
      })
    }
  }
})

export type ViaturaFormSchemaType = z.infer<typeof viaturaFormSchema>
export type ViaturaInspecaoFormSchemaType = z.infer<typeof viaturaInspecaoSchema>

export const defaultViaturaFormValues: Partial<ViaturaFormSchemaType> = {
  matricula: '',
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
  inspecoes: [],
}

