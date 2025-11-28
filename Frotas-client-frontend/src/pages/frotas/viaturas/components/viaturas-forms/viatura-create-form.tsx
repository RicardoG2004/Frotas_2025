import { useNavigate } from 'react-router-dom'
import { toast } from '@/utils/toast-utils'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { ViaturaFormContainer } from './viatura-form-container'
import { useCreateViatura } from '@/pages/frotas/viaturas/queries/viaturas-mutations'
import {
  encodeViaturaDocumentos,
  type ViaturaFormSchemaType,
} from './viatura-form-schema'
import { type ViaturaPropulsao } from '@/types/dtos/frotas/viaturas.dtos'

const mapFormValuesToPayload = (values: ViaturaFormSchemaType) => {
  // Normalize tipoPropulsao: empty string to null, otherwise convert to enum
  const tipoPropulsao =
    !values.tipoPropulsao || values.tipoPropulsao.trim() === ''
      ? null
      : (values.tipoPropulsao as ViaturaPropulsao)

  // Normalize entidadeFornecedoraTipo: empty string to null
  const entidadeFornecedoraTipo =
    !values.entidadeFornecedoraTipo || values.entidadeFornecedoraTipo.trim() === ''
      ? null
      : (values.entidadeFornecedoraTipo as 'fornecedor' | 'terceiro')

  return {
    matricula: values.matricula,
    countryCode: values.countryCode || 'PT',
    numero: values.numero,
    anoFabrico: values.anoFabrico,
    mesFabrico: values.mesFabrico,
    dataAquisicao: values.dataAquisicao?.toISOString() ?? null,
    dataLivrete: values.dataLivrete?.toISOString() ?? null,
    marcaId: values.marcaId,
    modeloId: values.modeloId,
    tipoViaturaId: values.tipoViaturaId || null,
    corId: values.corId || null,
    combustivelId: values.combustivelId || null,
    tipoPropulsao,
    conservatoriaId: values.conservatoriaId || null,
    categoriaId: values.categoriaId || null,
    localizacaoId: values.localizacaoId || null,
    setorId: values.setorId || null,
    delegacaoId: values.delegacaoId || null,
    custo: values.custo,
    despesasIncluidas: values.despesasIncluidas,
    consumoMedio: values.consumoMedio,
    autonomia: values.autonomia ?? null,
    entidadeFornecedoraTipo,
    terceiroId:
      entidadeFornecedoraTipo === 'terceiro' && values.terceiroId
        ? values.terceiroId
        : null,
    fornecedorId:
      entidadeFornecedoraTipo === 'fornecedor' && values.fornecedorId
        ? values.fornecedorId
        : null,
    nQuadro: values.nQuadro,
    nMotor: values.nMotor,
    cilindrada: values.cilindrada ?? null,
    potencia: values.potencia,
    capacidadeBateria: values.capacidadeBateria ?? null,
    emissoesCO2: values.emissoesCO2 ?? null,
    padraoCO2: values.padraoCO2 && values.padraoCO2.trim() !== '' ? values.padraoCO2 : null,
    voltagemTotal: values.voltagemTotal ?? null,
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
    dataInicial: values.dataInicial?.toISOString() ?? null,
    dataFinal: values.dataFinal?.toISOString() ?? null,
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
    dataValidadeSelo: values.dataValidadeSelo?.toISOString() ?? null,
    equipamentoIds: values.equipamentoIds,
    garantiaIds: values.garantiaIds,
    inspecoes:
      values.inspecoes
        ?.filter(
          (inspecao) =>
            inspecao.dataInspecao &&
            inspecao.dataProximaInspecao &&
            inspecao.resultado &&
            inspecao.resultado.trim() !== ''
        )
        .map((inspecao) => ({
          id: inspecao.id,
          dataInspecao: inspecao.dataInspecao.toISOString(),
          resultado: inspecao.resultado,
          dataProximaInspecao: inspecao.dataProximaInspecao.toISOString(),
          // Codificar documentos da inspeção para string JSON
          documentos: encodeViaturaDocumentos(inspecao.documentos) || null,
        })) ?? [],
    acidentes:
      values.acidentes
        ?.filter(
          (acidente) =>
            acidente.condutorId &&
            acidente.condutorId.trim() !== '' &&
            acidente.dataHora &&
            acidente.local &&
            acidente.local.trim() !== ''
        )
        .map((acidente) => {
          // Combinar data e hora antes de enviar
          let dataHoraFinal = acidente.dataHora
          if (acidente.dataHora && acidente.hora) {
            const [hours, minutes] = acidente.hora.split(':').map(Number)
            dataHoraFinal = new Date(acidente.dataHora)
            dataHoraFinal.setHours(hours || 0, minutes || 0, 0, 0)
          }
          return {
            id: acidente.id,
            funcionarioId: acidente.condutorId,
            dataHora: dataHoraFinal.toISOString(),
            culpa: acidente.culpa,
            descricaoAcidente: acidente.descricaoAcidente || '',
            descricaoDanos: acidente.descricaoDanos || '',
            local: acidente.local,
            concelhoId: acidente.concelhoId && acidente.concelhoId.trim() !== '' ? acidente.concelhoId : null,
            freguesiaId: acidente.freguesiaId && acidente.freguesiaId.trim() !== '' ? acidente.freguesiaId : null,
            codigoPostalId: acidente.codigoPostalId && acidente.codigoPostalId.trim() !== '' ? acidente.codigoPostalId : null,
            localReparacao: acidente.localReparacao || '',
          }
        }) ?? [],
    multas:
      values.multas
        ?.filter(
          (multa) =>
            multa.condutorId &&
            multa.condutorId.trim() !== '' &&
            multa.dataHora &&
            multa.local &&
            multa.local.trim() !== '' &&
            multa.motivo &&
            multa.motivo.trim() !== ''
        )
        .map((multa) => {
          // Combinar data e hora antes de enviar
          let dataHoraFinal = multa.dataHora
          if (multa.dataHora && multa.hora) {
            const [hours, minutes] = multa.hora.split(':').map(Number)
            dataHoraFinal = new Date(multa.dataHora)
            dataHoraFinal.setHours(hours || 0, minutes || 0, 0, 0)
          }
          return {
            id: multa.id,
            funcionarioId: multa.condutorId,
            dataHora: dataHoraFinal.toISOString(),
            local: multa.local,
            motivo: multa.motivo,
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
        mapFormValuesToPayload(values) as any
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
      onCancel={() => navigate(-1)}
      isSubmitting={viaturaMutation.isPending}
    />
  )
}

export { ViaturaCreateForm }

