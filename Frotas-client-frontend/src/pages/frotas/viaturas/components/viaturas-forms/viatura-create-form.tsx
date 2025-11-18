import { useNavigate } from 'react-router-dom'
import { toast } from '@/utils/toast-utils'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { ViaturaFormContainer } from './viatura-form-container'
import { useCreateViatura } from '@/pages/frotas/viaturas/queries/viaturas-mutations'
import { encodeViaturaDocumentos, type ViaturaFormSchemaType } from './viatura-form-schema'
import { type ViaturaPropulsao } from '@/types/dtos/frotas/viaturas.dtos'

const mapFormValuesToPayload = (values: ViaturaFormSchemaType) => {
  const documentosPayload = encodeViaturaDocumentos(values.documentos)

  return {
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
    autonomia: values.autonomia ?? null,
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
    cilindrada: values.cilindrada ?? null,
    potencia: values.potencia,
    capacidadeBateria: values.capacidadeBateria ?? null,
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
    urlImagem1: documentosPayload,
    urlImagem2: '',
    equipamentoIds: values.equipamentoIds,
    garantiaIds: values.garantiaIds,
    inspecoes:
      values.inspecoes?.map((inspecao) => ({
        id: inspecao.id,
        dataInspecao: inspecao.dataInspecao.toISOString(),
        resultado: inspecao.resultado,
        dataProximaInspecao: inspecao.dataProximaInspecao.toISOString(),
      })) ?? [],
    acidentes:
      values.acidentes?.map((acidente) => {
        // Combinar data e hora antes de enviar
        let dataHoraFinal = acidente.dataHora
        if (acidente.dataHora && acidente.hora) {
          const [hours, minutes] = acidente.hora.split(':').map(Number)
          dataHoraFinal = new Date(acidente.dataHora)
          dataHoraFinal.setHours(hours || 0, minutes || 0, 0, 0)
        }
        return {
          id: acidente.id,
          condutorId: acidente.condutorId || '',
          dataHora: dataHoraFinal.toISOString(),
          culpa: acidente.culpa,
          descricaoAcidente: acidente.descricaoAcidente || '',
          descricaoDanos: acidente.descricaoDanos || '',
          local: acidente.local || '',
          concelhoId: acidente.concelhoId || '',
          freguesiaId: acidente.freguesiaId || '',
          codigoPostalId: acidente.codigoPostalId || '',
          localReparacao: acidente.localReparacao || '',
        }
      }) ?? [],
    multas:
      values.multas?.map((multa) => {
        // Combinar data e hora antes de enviar
        let dataHoraFinal = multa.dataHora
        if (multa.dataHora && multa.hora) {
          const [hours, minutes] = multa.hora.split(':').map(Number)
          dataHoraFinal = new Date(multa.dataHora)
          dataHoraFinal.setHours(hours || 0, minutes || 0, 0, 0)
        }
        return {
          id: multa.id,
          condutorId: multa.condutorId || '',
          dataHora: dataHoraFinal.toISOString(),
          local: multa.local || '',
          motivo: multa.motivo || '',
          valor: multa.valor || 0,
        }
      }) ?? [],
  }
}

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

