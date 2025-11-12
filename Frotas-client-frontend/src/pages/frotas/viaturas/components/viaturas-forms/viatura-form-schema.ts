import { z } from 'zod'

export const viaturaFormSchema = z.object({
  matricula: z
    .string({ message: 'A matrícula é obrigatória' })
    .min(1, { message: 'A matrícula é obrigatória' }),
  numero: z.coerce.number().nonnegative({ message: 'O número deve ser positivo' }),
  anoFabrico: z.coerce
    .number()
    .min(1900, { message: 'Ano inválido' })
    .max(new Date().getFullYear() + 1, { message: 'Ano inválido' }),
  mesFabrico: z.coerce.number().int().min(1).max(12),
  dataAquisicao: z
    .preprocess((value) => (value ? new Date(value as string | number | Date) : null), z.date({
      required_error: 'A data de aquisição é obrigatória',
      invalid_type_error: 'A data de aquisição é inválida',
    })),
  dataLivrete: z
    .preprocess((value) => (value ? new Date(value as string | number | Date) : null), z.date({
      required_error: 'A data do livrete é obrigatória',
      invalid_type_error: 'A data do livrete é inválida',
    })),
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
  dataInicial: z
    .preprocess((value) => (value ? new Date(value as string | number | Date) : null), z.date({
      required_error: 'A data inicial é obrigatória',
      invalid_type_error: 'A data inicial é inválida',
    })),
  dataFinal: z
    .preprocess((value) => (value ? new Date(value as string | number | Date) : null), z.date({
      required_error: 'A data final é obrigatória',
      invalid_type_error: 'A data final é inválida',
    })),
  valorTotalContrato: z.coerce.number().min(0),
  opcaoCompra: z.boolean(),
  nRendas: z.coerce.number().nonnegative(),
  valorRenda: z.coerce.number().min(0),
  valorResidual: z.coerce.number().min(0),
  seguroId: z.string().uuid({ message: 'Selecione o seguro' }),
  notasAdicionais: z.string().optional().default(''),
  cartaoCombustivel: z.string().optional().default(''),
  anoImpostoSelo: z.coerce.number().min(1900),
  anoImpostoCirculacao: z.coerce.number().min(1900),
  dataValidadeSelo: z
    .preprocess((value) => (value ? new Date(value as string | number | Date) : null), z.date({
      required_error: 'A data de validade do selo é obrigatória',
      invalid_type_error: 'A data de validade do selo é inválida',
    })),
  urlImagem1: z.string().optional().default(''),
  urlImagem2: z.string().optional().default(''),
  equipamentoIds: z
    .array(z.string().uuid({ message: 'Selecione um equipamento válido' }))
    .min(1, { message: 'Selecione pelo menos um equipamento' }),
})

export type ViaturaFormSchemaType = z.infer<typeof viaturaFormSchema>

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
  seguroId: '',
  notasAdicionais: '',
  cartaoCombustivel: '',
  anoImpostoSelo: undefined,
  anoImpostoCirculacao: undefined,
  dataValidadeSelo: undefined,
  urlImagem1: '',
  urlImagem2: '',
  equipamentoIds: [],
}

