import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from '@/utils/toast-utils'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { ViaturaFormContainer } from './viatura-form-container'
import { useCreateViatura } from '@/pages/frotas/viaturas/queries/viaturas-mutations'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import {
  encodeViaturaDocumentos,
  encodeCondutoresDocumentos,
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
    matricula: values.matricula || '',
    countryCode: values.countryCode || 'PT',
    numero: values.numero ?? null,
    anoFabrico: values.anoFabrico ?? null,
    mesFabrico: values.mesFabrico ?? null,
    dataAquisicao: values.dataAquisicao?.toISOString() ?? null,
    dataLivrete: values.dataLivrete?.toISOString() ?? null,
    marcaId: (values.marcaId && typeof values.marcaId === 'string' && values.marcaId.trim() !== '') ? values.marcaId : null,
    modeloId: (values.modeloId && typeof values.modeloId === 'string' && values.modeloId.trim() !== '') ? values.modeloId : null,
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
    documentos: encodeViaturaDocumentos(values.documentos) || null,
    notasAdicionais: values.notasAdicionais || '',
    cartaoCombustivel: values.cartaoCombustivel || '',
    anoImpostoSelo: values.anoImpostoSelo,
    anoImpostoCirculacao: values.anoImpostoCirculacao,
    dataValidadeSelo: values.dataValidadeSelo?.toISOString() ?? null,
    imagem: encodeViaturaDocumentos(values.imagem) || null,
    equipamentoIds: values.equipamentoIds ?? [],
    garantiaIds: values.garantiaIds ?? [],
    condutores: (values.condutorIds ?? []).map((funcionarioId) => ({
      funcionarioId,
      documentos: values.condutoresDocumentos?.[funcionarioId] 
        ? encodeViaturaDocumentos(values.condutoresDocumentos[funcionarioId]) 
        : null,
    })),
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
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const viaturaMutation = useCreateViatura()
  
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = instanceId

  const handleSubmit = async (values: ViaturaFormSchemaType) => {
    try {
      const payload = mapFormValuesToPayload(values)
      
      // Garantir que marcaId e modeloId sejam null quando vazios
      if (payload.marcaId === '' || payload.marcaId === undefined || payload.marcaId === '00000000-0000-0000-0000-000000000000') {
        payload.marcaId = null
      }
      if (payload.modeloId === '' || payload.modeloId === undefined || payload.modeloId === '00000000-0000-0000-0000-000000000000') {
        payload.modeloId = null
      }
      
      console.log('[CreateViatura Form] Payload COMPLETO a enviar:', {
        matricula: payload.matricula,
        marcaId: payload.marcaId,
        modeloId: payload.modeloId,
        tipoPropulsao: payload.tipoPropulsao,
        entidadeFornecedoraTipo: payload.entidadeFornecedoraTipo,
        terceiroId: payload.terceiroId,
        fornecedorId: payload.fornecedorId,
        documentos: payload.documentos,
        imagem: payload.imagem,
        equipamentoIds: payload.equipamentoIds,
        garantiaIds: payload.garantiaIds,
        condutores: payload.condutores,
      })
      console.log('[CreateViatura Form] Valores do formulário ANTES de mapear:', {
        equipamentoIds: values.equipamentoIds,
        garantiaIds: values.garantiaIds,
        condutorIds: values.condutorIds,
        condutoresDocumentos: values.condutoresDocumentos,
      })
      
      const response = await viaturaMutation.mutateAsync(
        payload as any
      )
      
      console.log('[CreateViatura Form] Resposta recebida:', response)
      console.log('[CreateViatura Form] Resposta info (GSResponse):', response.info)
      console.log('[CreateViatura Form] Dados da viatura:', response.info?.data)
      console.log('[CreateViatura Form] Status HTTP:', response.status)
      
      const result = handleApiResponse(
        response,
        'Viatura criada com sucesso',
        'Erro ao criar viatura',
        'Viatura criada com avisos'
      )
      
      console.log('[CreateViatura Form] Resultado do handleApiResponse:', result)
      console.log('[CreateViatura Form] ID da viatura criada:', result.data)

      if (result.success && result.data) {
        // Remove form data from the form store
        removeFormState(formId)

        // Limpar dados do localStorage
        try {
          const path = location.pathname.replace(/\//g, '_')
          const storageKey = `viatura_form_viatura-create_${instanceId}_${path}`
          localStorage.removeItem(storageKey)
        } catch (error) {
          console.error('Erro ao limpar localStorage:', error)
        }

        // Find the current window and close it properly
        const currentWindow = windows.find(
          (w) => w.path === location.pathname && w.instanceId === instanceId
        )

        if (currentWindow) {
          handleWindowClose(currentWindow.id, navigate, removeWindow)
        } else {
          // Fallback se não encontrar a janela
          navigate('/frotas/viaturas', { replace: true })
        }
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
      onCancel={undefined}
      isSubmitting={viaturaMutation.isPending}
    />
  )
}

export { ViaturaCreateForm }

