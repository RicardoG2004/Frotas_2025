import { useNavigate } from 'react-router-dom'
import { toast } from '@/utils/toast-utils'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { ViaturaFormContainer } from './viatura-form-container'
import { useCreateViatura } from '@/pages/frotas/viaturas/queries/viaturas-mutations'
import { type ViaturaFormSchemaType } from './viatura-form-schema'

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
  conservatoriaId: values.conservatoriaId,
  categoriaId: values.categoriaId,
  localizacaoId: values.localizacaoId,
  setorId: values.setorId,
  delegacaoId: values.delegacaoId,
  custo: values.custo,
  despesasIncluidas: values.despesasIncluidas,
  consumoMedio: values.consumoMedio,
  terceiroId: values.terceiroId,
  fornecedorId: values.fornecedorId,
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

const ViaturaCreateForm = () => {
  const navigate = useNavigate()
  const viaturaMutation = useCreateViatura()

  const handleSubmit = async (values: ViaturaFormSchemaType) => {
    try {
      const response = await viaturaMutation.mutateAsync(
        mapFormValuesToPayload(values)
      )
      const result = handleApiResponse(
        response,
        'Viatura criada com sucesso',
        'Erro ao criar viatura',
        'Viatura criada com avisos'
      )

      if (result.success) {
        navigate('/frotas/viaturas', { replace: true })
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao criar viatura'))
    }
  }

  return (
    <ViaturaFormContainer
      tabKey='viatura-create'
      submitLabel='Guardar Viatura'
      onSubmit={handleSubmit}
      onCancel={() => navigate('/frotas/viaturas')}
      isSubmitting={viaturaMutation.isPending}
    />
  )
}

export { ViaturaCreateForm }

