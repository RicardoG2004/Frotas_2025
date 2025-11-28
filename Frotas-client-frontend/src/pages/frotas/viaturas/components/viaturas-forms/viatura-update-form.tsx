import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from '@/utils/toast-utils'
import { handleApiError } from '@/utils/error-handlers'
import { handleApiResponse } from '@/utils/response-handlers'
import { ViaturaFormContainer } from './viatura-form-container'
import { useGetViatura } from '@/pages/frotas/viaturas/queries/viaturas-queries'
import { useUpdateViatura } from '@/pages/frotas/viaturas/queries/viaturas-mutations'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import {
  encodeViaturaDocumentos,
  parseViaturaDocumentosFromPair,
  parseCondutoresDocumentos,
  parseDocumentosPayload,
  type ViaturaFormSchemaType,
} from './viatura-form-schema'
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
    countryCode: (viatura as any).countryCode || 'PT',
    numero: viatura.numero ?? 0,
    anoFabrico: viatura.anoFabrico ?? new Date().getFullYear(),
    mesFabrico: viatura.mesFabrico ?? new Date().getMonth() + 1,
    dataAquisicao: viatura.dataAquisicao ? new Date(viatura.dataAquisicao) : new Date(),
    dataLivrete: viatura.dataLivrete ? new Date(viatura.dataLivrete) : new Date(),
    marcaId: viatura.marcaId || null,
    modeloId: viatura.modeloId || null,
    tipoViaturaId: viatura.tipoViaturaId || null,
    corId: viatura.corId || null,
    combustivelId: viatura.combustivelId || null,
    tipoPropulsao: normalizePropulsao(viatura.tipoPropulsao),
    conservatoriaId: viatura.conservatoriaId || null,
    categoriaId: viatura.categoriaId || null,
    localizacaoId: viatura.localizacaoId || null,
    setorId: viatura.setorId || null,
    delegacaoId: viatura.delegacaoId || null,
    entidadeFornecedoraTipo,
    custo: viatura.custo ?? 0,
    despesasIncluidas: viatura.despesasIncluidas ?? 0,
    consumoMedio: viatura.consumoMedio ?? 0,
    autonomia: viatura.autonomia ?? undefined,
    terceiroId: viatura.terceiroId || null,
    fornecedorId: viatura.fornecedorId || null,
    nQuadro: viatura.nQuadro ?? 0,
    nMotor: viatura.nMotor ?? 0,
    cilindrada: viatura.cilindrada ?? undefined,
    potencia: viatura.potencia ?? 0,
    capacidadeBateria: viatura.capacidadeBateria ?? undefined,
    emissoesCO2: viatura.emissoesCO2 ?? undefined,
    padraoCO2: viatura.padraoCO2 ?? '',
    voltagemTotal: viatura.voltagemTotal ?? undefined,
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
    documentos: parseViaturaDocumentosFromPair(viatura.urlImagem1, null).map(
      (documento) => ({ ...documento })
    ),
    condutoresDocumentos: parseCondutoresDocumentos(viatura.urlImagem2),
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
        // Parsear documentos da inspeção se existirem
        documentos: inspecao.documentos ? parseDocumentosPayload(inspecao.documentos) : [],
      })) ?? [],
    acidentes:
      viatura.acidentes?.map((acidente) => {
        const dataHora = acidente.dataHora ? new Date(acidente.dataHora) : new Date()
        const hora = dataHora ? `${dataHora.getHours().toString().padStart(2, '0')}:${dataHora.getMinutes().toString().padStart(2, '0')}` : ''
        return {
          id: acidente.id,
          condutorId: acidente.condutorId || '',
          dataHora,
          hora,
          culpa: typeof acidente.culpa === 'boolean' ? acidente.culpa : (acidente.culpa === 'true' || acidente.culpa === 'Sim'),
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
      viatura.multas?.map((multa) => {
        const dataHora = multa.dataHora ? new Date(multa.dataHora) : new Date()
        const hora = dataHora ? `${dataHora.getHours().toString().padStart(2, '0')}:${dataHora.getMinutes().toString().padStart(2, '0')}` : ''
        return {
          id: multa.id,
          condutorId: multa.condutorId || '',
          dataHora,
          hora,
          local: multa.local || '',
          motivo: multa.motivo || '',
          valor: multa.valor ?? 0,
        }
      }) ?? [],
  }
}

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
    tipoViaturaId: values.tipoViaturaId ?? null,
    corId: values.corId ?? null,
    combustivelId: values.combustivelId ?? null,
    tipoPropulsao,
    conservatoriaId: values.conservatoriaId ?? null,
    categoriaId: values.categoriaId ?? null,
    localizacaoId: values.localizacaoId ?? null,
    setorId: values.setorId ?? null,
    delegacaoId: values.delegacaoId ?? null,
    custo: values.custo ?? null,
    despesasIncluidas: values.despesasIncluidas ?? null,
    consumoMedio: values.consumoMedio ?? null,
    autonomia: values.autonomia ?? null,
    entidadeFornecedoraTipo,
    terceiroId: values.terceiroId ?? null,
    fornecedorId: values.fornecedorId ?? null,
    nQuadro: values.nQuadro ?? null,
    nMotor: values.nMotor ?? null,
    cilindrada: values.cilindrada ?? null,
    potencia: values.potencia ?? null,
    capacidadeBateria: values.capacidadeBateria ?? null,
    emissoesCO2: values.emissoesCO2 ?? null,
    padraoCO2: values.padraoCO2 && values.padraoCO2.trim() !== '' ? values.padraoCO2 : null,
    voltagemTotal: values.voltagemTotal ?? null,
    tara: values.tara ?? null,
    lotacao: values.lotacao ?? null,
    marketing: values.marketing ?? false,
    mercadorias: values.mercadorias ?? false,
    cargaUtil: values.cargaUtil ?? null,
    comprimento: values.comprimento ?? null,
    largura: values.largura ?? null,
    pneusFrente: values.pneusFrente || '',
    pneusTras: values.pneusTras || '',
    contrato: values.contrato || '',
    dataInicial: values.dataInicial?.toISOString() ?? null,
    dataFinal: values.dataFinal?.toISOString() ?? null,
    valorTotalContrato: values.valorTotalContrato ?? null,
    opcaoCompra: values.opcaoCompra ?? false,
    nRendas: values.nRendas ?? null,
    valorRenda: values.valorRenda ?? null,
    valorResidual: values.valorResidual ?? null,
    seguroIds: values.seguroIds ?? [],
    notasAdicionais: values.notasAdicionais || '',
    cartaoCombustivel: values.cartaoCombustivel || '',
    anoImpostoSelo: values.anoImpostoSelo ?? null,
    anoImpostoCirculacao: values.anoImpostoCirculacao ?? null,
    dataValidadeSelo: values.dataValidadeSelo?.toISOString() ?? null,
    equipamentoIds: values.equipamentoIds ?? [],
    garantiaIds: values.garantiaIds ?? [],
    condutorIds: values.condutorIds ?? [],
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
          id: inspecao.id || undefined,
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
            id: acidente.id || undefined,
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
            id: multa.id || undefined,
            funcionarioId: multa.condutorId,
            dataHora: dataHoraFinal.toISOString(),
            local: multa.local,
            motivo: multa.motivo,
            valor: multa.valor || 0,
          }
        }) ?? [],
  }
}

const ViaturaUpdateForm = ({ viaturaId }: ViaturaUpdateFormProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const viaturaQuery = useGetViatura(viaturaId)
  const updateMutation = useUpdateViatura()
  
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = instanceId

  const initialValues = useMemo(() => {
    const dto = viaturaQuery.data?.info?.data
    return dto ? mapDtoToFormValues(dto) : undefined
  }, [viaturaQuery.data?.info?.data])

  const handleSubmit = async (values: ViaturaFormSchemaType) => {
    try {
      const payload = mapFormValuesToPayload(values)
      
      // Garantir que marcaId e modeloId sejam null quando vazios
      if (payload.marcaId === '' || payload.marcaId === undefined) {
        payload.marcaId = null
      }
      if (payload.modeloId === '' || payload.modeloId === undefined) {
        payload.modeloId = null
      }
      
      console.log('[UpdateViatura] Payload a enviar:', {
        id: viaturaId,
        marcaId: payload.marcaId,
        modeloId: payload.modeloId,
        matricula: payload.matricula,
      })
      
      const response = await updateMutation.mutateAsync({
        id: viaturaId,
        data: payload as any,
      })
      const result = handleApiResponse(
        response,
        'Viatura atualizada com sucesso',
        'Erro ao atualizar viatura',
        'Viatura atualizada com avisos'
      )

      if (result.success) {
        // Remove form data from the form store
        removeFormState(formId)

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
      console.error('[UpdateViatura Form] Erro completo:', error)
      
      // Tentar extrair informações detalhadas do erro
      let errorDetails: any = null
      
      if (error && typeof error === 'object') {
        // Se for ViaturaError, verificar o originalError
        if ('name' in error && error.name === 'ViaturaError') {
          const viaturaError = error as any
          console.error('[UpdateViatura Form] ViaturaError originalError:', viaturaError.originalError)
          
          if (viaturaError.originalError) {
            // Se o erro original for BaseApiError
            if (viaturaError.originalError.name === 'BaseApiError') {
              const baseError = viaturaError.originalError as any
              errorDetails = baseError.data
              console.error('[UpdateViatura Form] BaseApiError data:', errorDetails)
            } else {
              errorDetails = viaturaError.originalError
            }
          }
        }
        
        // Logar estrutura completa do erro
        console.error('[UpdateViatura Form] Estrutura do erro:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
      }
      
      const errorMessage = handleApiError(error, 'Erro ao atualizar viatura')
      console.error('[UpdateViatura Form] Mensagem de erro extraída:', errorMessage)
      
      // Se tivermos detalhes do backend, logar
      if (errorDetails) {
        console.error('[UpdateViatura Form] Detalhes do backend:', JSON.stringify(errorDetails, null, 2))
        
        // Tentar extrair mensagens do backend
        if (errorDetails.messages) {
          const messages = errorDetails.messages
          if (typeof messages === 'object') {
            const allMessages = Object.entries(messages)
              .flatMap(([key, values]: [string, any]) => 
                Array.isArray(values) ? values.map((v: string) => `${key}: ${v}`) : [`${key}: ${values}`]
              )
            if (allMessages.length > 0) {
              console.error('[UpdateViatura Form] Mensagens do backend:', allMessages.join('\n'))
            }
          }
        }
      }
      
      toast.error(errorMessage)
    }
  }

  if (viaturaQuery.isLoading) {
    return (
      <ViaturaFormContainer
        tabKey={`viatura-update-${viaturaId}`}
        submitLabel='Guardar alterações'
        onSubmit={handleSubmit}
        onCancel={undefined}
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
      onCancel={undefined}
      isSubmitting={updateMutation.isPending}
      initialValues={initialValues}
    />
  )
}

export { ViaturaUpdateForm }

