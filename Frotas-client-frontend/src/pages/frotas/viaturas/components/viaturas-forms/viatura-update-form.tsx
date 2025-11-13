import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/utils/toast-utils'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { ViaturaFormContainer } from './viatura-form-container'
import { useGetViatura } from '@/pages/frotas/viaturas/queries/viaturas-queries'
import { useUpdateViatura } from '@/pages/frotas/viaturas/queries/viaturas-mutations'
import { type ViaturaFormSchemaType } from './viatura-form-schema'
import {
  ViaturaDTO,
  VIATURA_PROPULSAO_TYPES,
  type ViaturaPropulsao,
} from '@/types/dtos/frotas/viaturas.dtos'

interface ViaturaUpdateFormProps {
  viaturaId: string
}

const normalizePropulsao = (tipo?: ViaturaPropulsao | null): ViaturaPropulsao => {
  if (tipo && (VIATURA_PROPULSAO_TYPES as readonly string[]).includes(tipo)) {
    return tipo
  }
  return 'combustao'
}

const mapDtoToFormValues = (viatura: ViaturaDTO): ViaturaFormSchemaType => {
  const entidadeFornecedoraTipo =
    viatura.entidadeFornecedoraTipo?.toLowerCase() === 'terceiro' ||
    (!viatura.fornecedorId && viatura.terceiroId)
      ? 'terceiro'
      : 'fornecedor'

  return {
  matricula: viatura.matricula || '',
  numero: viatura.numero ?? 0,
  anoFabrico: viatura.anoFabrico ?? new Date().getFullYear(),
  mesFabrico: viatura.mesFabrico ?? new Date().getMonth() + 1,
  dataAquisicao: viatura.dataAquisicao ? new Date(viatura.dataAquisicao) : new Date(),
  dataLivrete: viatura.dataLivrete ? new Date(viatura.dataLivrete) : new Date(),
  marcaId: viatura.marcaId || '',
  modeloId: viatura.modeloId || '',
  tipoViaturaId: viatura.tipoViaturaId || '',
  corId: viatura.corId || '',
  combustivelId: viatura.combustivelId || '',
  tipoPropulsao: normalizePropulsao(viatura.tipoPropulsao),
  conservatoriaId: viatura.conservatoriaId || '',
  categoriaId: viatura.categoriaId || '',
  localizacaoId: viatura.localizacaoId || '',
  setorId: viatura.setorId || '',
  delegacaoId: viatura.delegacaoId || '',
  entidadeFornecedoraTipo,
  custo: viatura.custo ?? 0,
  despesasIncluidas: viatura.despesasIncluidas ?? 0,
  consumoMedio: viatura.consumoMedio ?? 0,
  terceiroId: viatura.terceiroId ?? '',
  fornecedorId: viatura.fornecedorId ?? '',
  nQuadro: viatura.nQuadro ?? 0,
  nMotor: viatura.nMotor ?? 0,
  cilindrada: viatura.cilindrada ?? 0,
  potencia: viatura.potencia ?? 0,
  tara: viatura.tara ?? 0,
  lotacao: viatura.lotacao ?? 0,
  marketing: viatura.marketing ?? false,
  mercadorias: viatura.mercadorias ?? false,
  cargaUtil: viatura.cargaUtil ?? 0,
  comprimento: viatura.comprimento ?? 0,
  largura: viatura.largura ?? 0,
  pneusFrente: viatura.pneusFrente || '',
  pneusTras: viatura.pneusTras || '',
  contrato: viatura.contrato || '',
  dataInicial: viatura.dataInicial ? new Date(viatura.dataInicial) : new Date(),
  dataFinal: viatura.dataFinal ? new Date(viatura.dataFinal) : new Date(),
  valorTotalContrato: viatura.valorTotalContrato ?? 0,
  opcaoCompra: viatura.opcaoCompra ?? false,
  nRendas: viatura.nRendas ?? 0,
  valorRenda: viatura.valorRenda ?? 0,
  valorResidual: viatura.valorResidual ?? 0,
  seguroIds:
    viatura.seguroIds && viatura.seguroIds.length > 0
      ? [...viatura.seguroIds]
      : viatura.seguros
          ?.map((seguro) => seguro.id)
          .filter((id): id is string => typeof id === 'string') ?? [],
  notasAdicionais: viatura.notasAdicionais || '',
  cartaoCombustivel: viatura.cartaoCombustivel || '',
  anoImpostoSelo: viatura.anoImpostoSelo ?? new Date().getFullYear(),
  anoImpostoCirculacao: viatura.anoImpostoCirculacao ?? new Date().getFullYear(),
  dataValidadeSelo: viatura.dataValidadeSelo ? new Date(viatura.dataValidadeSelo) : new Date(),
  urlImagem1: viatura.urlImagem1 || '',
  urlImagem2: viatura.urlImagem2 || '',
  equipamentoIds:
    viatura.equipamentoIds && viatura.equipamentoIds.length > 0
      ? [...viatura.equipamentoIds]
      : viatura.equipamentos
          ?.map((equipamento) => equipamento.id)
          .filter((id): id is string => typeof id === 'string') ?? [],
  garantiaIds:
    viatura.garantiaIds && viatura.garantiaIds.length > 0
      ? [...viatura.garantiaIds]
      : viatura.garantias
          ?.map((garantia) => garantia.id)
          .filter((id): id is string => typeof id === 'string') ?? [],
  inspecoes:
    viatura.inspecoes?.map((inspecao) => ({
      id: inspecao.id,
      dataInspecao: inspecao.dataInspecao ? new Date(inspecao.dataInspecao) : new Date(),
      resultado: inspecao.resultado ?? '',
      dataProximaInspecao: inspecao.dataProximaInspecao
        ? new Date(inspecao.dataProximaInspecao)
        : new Date(),
    })) ?? [],
  }
}

const mapFormValuesToPayload = (values: ViaturaFormSchemaType) => ({
  matricula: values.matricula,
  numero: values.numero,
  anoFabrico: values.anoFabrico,
  mesFabrico: values.mesFabrico,
  dataAquisicao: values.dataAquisicao.toISOString(),
  dataLivrete: values.dataLivrete.toISOString(),
  marcaId: values.marcaId,
  modeloId: values.modeloId,
  tipoViaturaId: values.tipoViaturaId,
  corId: values.corId,
  combustivelId: values.combustivelId,
  tipoPropulsao: values.tipoPropulsao as ViaturaPropulsao,
  conservatoriaId: values.conservatoriaId,
  categoriaId: values.categoriaId,
  localizacaoId: values.localizacaoId,
  setorId: values.setorId,
  delegacaoId: values.delegacaoId,
  custo: values.custo,
  despesasIncluidas: values.despesasIncluidas,
  consumoMedio: values.consumoMedio,
  entidadeFornecedoraTipo: values.entidadeFornecedoraTipo as 'fornecedor' | 'terceiro',
  terceiroId:
    values.entidadeFornecedoraTipo === 'terceiro' && values.terceiroId
      ? values.terceiroId
      : null,
  fornecedorId:
    values.entidadeFornecedoraTipo === 'fornecedor' && values.fornecedorId
      ? values.fornecedorId
      : null,
  nQuadro: values.nQuadro,
  nMotor: values.nMotor,
  cilindrada: values.cilindrada,
  potencia: values.potencia,
  tara: values.tara,
  lotacao: values.lotacao,
  marketing: values.marketing,
  mercadorias: values.mercadorias,
  cargaUtil: values.cargaUtil,
  comprimento: values.comprimento,
  largura: values.largura,
  pneusFrente: values.pneusFrente || '',
  pneusTras: values.pneusTras || '',
  contrato: values.contrato || '',
  dataInicial: values.dataInicial.toISOString(),
  dataFinal: values.dataFinal.toISOString(),
  valorTotalContrato: values.valorTotalContrato,
  opcaoCompra: values.opcaoCompra,
  nRendas: values.nRendas,
  valorRenda: values.valorRenda,
  valorResidual: values.valorResidual,
  seguroIds: values.seguroIds,
  notasAdicionais: values.notasAdicionais || '',
  cartaoCombustivel: values.cartaoCombustivel || '',
  anoImpostoSelo: values.anoImpostoSelo,
  anoImpostoCirculacao: values.anoImpostoCirculacao,
  dataValidadeSelo: values.dataValidadeSelo.toISOString(),
  urlImagem1: values.urlImagem1 || '',
  urlImagem2: values.urlImagem2 || '',
  equipamentoIds: values.equipamentoIds,
  garantiaIds: values.garantiaIds,
  inspecoes:
    values.inspecoes?.map((inspecao) => ({
      id: inspecao.id,
      dataInspecao: inspecao.dataInspecao.toISOString(),
      resultado: inspecao.resultado,
      dataProximaInspecao: inspecao.dataProximaInspecao.toISOString(),
    })) ?? [],
})

const ViaturaUpdateForm = ({ viaturaId }: ViaturaUpdateFormProps) => {
  const navigate = useNavigate()
  const viaturaQuery = useGetViatura(viaturaId)
  const updateMutation = useUpdateViatura()

  const initialValues = useMemo(() => {
    const dto = viaturaQuery.data?.info?.data
    return dto ? mapDtoToFormValues(dto) : undefined
  }, [viaturaQuery.data?.info?.data])

  const handleSubmit = async (values: ViaturaFormSchemaType) => {
    try {
      const response = await updateMutation.mutateAsync({
        id: viaturaId,
        data: mapFormValuesToPayload(values),
      })
      const result = handleApiResponse(
        response,
        'Viatura atualizada com sucesso',
        'Erro ao atualizar viatura',
        'Viatura atualizada com avisos'
      )

      if (result.success) {
        navigate('/frotas/viaturas', { replace: true })
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar viatura'))
    }
  }

  if (viaturaQuery.isLoading) {
    return (
      <ViaturaFormContainer
        tabKey={`viatura-update-${viaturaId}`}
        submitLabel='Guardar alterações'
        onSubmit={handleSubmit}
        onCancel={() => navigate('/frotas/viaturas')}
        isSubmitting={updateMutation.isPending}
        isLoadingInitial
      />
    )
  }

  if (!initialValues) {
    return (
      <div className='rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive'>
        Não foi possível carregar a viatura selecionada.
      </div>
    )
  }

  return (
    <ViaturaFormContainer
      tabKey={`viatura-update-${viaturaId}`}
      submitLabel='Guardar alterações'
      onSubmit={handleSubmit}
      onCancel={() => navigate('/frotas/viaturas')}
      isSubmitting={updateMutation.isPending}
      initialValues={initialValues}
    />
  )
}

export { ViaturaUpdateForm }

