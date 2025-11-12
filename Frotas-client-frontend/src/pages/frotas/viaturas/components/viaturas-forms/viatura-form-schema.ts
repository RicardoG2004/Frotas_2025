import { z } from 'zod'

const dateWithMessages = (requiredMessage: string, invalidMessage: string) =>
  z.date({
    required_error: requiredMessage,
    invalid_type_error: invalidMessage,
  } as any)

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
  terceiroId: z.string().uuid({ message: 'Selecione o terceiro' }),
  fornecedorId: z.string().uuid({ message: 'Selecione o fornecedor' }),
  custo: z.coerce.number().min(0),
  despesasIncluidas: z.coerce.number().min(0),
  consumoMedio: z.coerce.number().min(0),
  nQuadro: z.coerce.number().nonnegative(),
  nMotor: z.coerce.number().nonnegative(),
  cilindrada: z.coerce.number().min(0),
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
  equipamentoIds: z
    .array(z.string().uuid({ message: 'Selecione um equipamento válido' }))
    .min(1, { message: 'Selecione pelo menos um equipamento' }),
  inspecoes: z.array(viaturaInspecaoSchema).optional().default([]),
})

export const viaturaFormSchema = viaturaFormSchemaObject.superRefine((data, ctx) => {
  const inspections = data.inspecoes ?? []
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
  terceiroId: '',
  fornecedorId: '',
  custo: undefined,
  despesasIncluidas: undefined,
  consumoMedio: undefined,
  nQuadro: undefined,
  nMotor: undefined,
  cilindrada: undefined,
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
  equipamentoIds: [],
  inspecoes: [],
}

