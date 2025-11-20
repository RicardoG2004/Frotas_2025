import { useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetSeguro } from '@/pages/frotas/seguros/queries/seguros-queries'
import { SeguroUpdateForm } from '@/pages/frotas/seguros/components/seguros-forms/seguro-update-form'
import {
  PeriodicidadeSeguro,
  MetodoPagamentoSeguro,
} from '@/types/dtos/frotas/seguros.dtos'

// Helper functions to convert string enum names to enum values
const parsePeriodicidade = (value: any): PeriodicidadeSeguro => {
  if (typeof value === 'number') return value as PeriodicidadeSeguro
  if (typeof value === 'string') {
    const lower = value.toLowerCase()
    if (lower === 'mensal' || lower === '0') return PeriodicidadeSeguro.Mensal
    if (lower === 'trimestral' || lower === '1') return PeriodicidadeSeguro.Trimestral
    if (lower === 'anual' || lower === '2') return PeriodicidadeSeguro.Anual
  }
  return PeriodicidadeSeguro.Anual
}

const parseMetodoPagamento = (value: any): MetodoPagamentoSeguro | undefined => {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value === 'number') return value as MetodoPagamentoSeguro
  if (typeof value === 'string') {
    // Handle both camelCase and lowercase
    const normalized = value.replace(/\s+/g, '').toLowerCase()
    // Map string names to enum values
    const mapping: Record<string, MetodoPagamentoSeguro> = {
      'transferencia': MetodoPagamentoSeguro.Transferencia,
      'transferência': MetodoPagamentoSeguro.Transferencia,
      'mbway': MetodoPagamentoSeguro.MBWay,
      'multibanco': MetodoPagamentoSeguro.Multibanco,
      'cartaodebito': MetodoPagamentoSeguro.CartaoDebito,
      'cartãodedébito': MetodoPagamentoSeguro.CartaoDebito,
      'cartaocredito': MetodoPagamentoSeguro.CartaoCredito,
      'cartãodecrédito': MetodoPagamentoSeguro.CartaoCredito,
      'paypal': MetodoPagamentoSeguro.PayPal,
      'applepay': MetodoPagamentoSeguro.ApplePay,
      'googlepay': MetodoPagamentoSeguro.GooglePay,
      'dinheiro': MetodoPagamentoSeguro.Dinheiro,
      'cheque': MetodoPagamentoSeguro.Cheque,
      'outro': MetodoPagamentoSeguro.Outro,
    }
    return mapping[normalized]
  }
  return undefined
}

export function SegurosUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const seguroId = searchParams.get('seguroId')
  const formId = instanceId

  const handleClose = () => {
    removeFormState(formId)

    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (currentWindow) {
      handleWindowClose(currentWindow.id, navigate, removeWindow)
    }
  }

  if (!seguroId) {
    navigate('/frotas/configuracoes/seguros')
    return null
  }

  const { data: seguroData, isLoading } = useGetSeguro(seguroId)

  const initialData = useMemo(() => {
    const seguro = seguroData?.info?.data
    
    if (!seguro) {
      return {
        designacao: '',
        apolice: '',
        seguradoraId: '',
        assistenciaViagem: false,
        cartaVerde: false,
        riscosCobertos: undefined,
        valorCobertura: 0,
        custoAnual: 0,
        dataInicial: new Date(),
        dataFinal: new Date(),
        periodicidade: PeriodicidadeSeguro.Anual,
        metodoPagamento: undefined,
        dataPagamento: undefined,
        documentos: [],
      }
    }

    // Use helper functions to parse enum values (handles both string and number)
    const metodoPagamentoValue = parseMetodoPagamento(seguro.metodoPagamento)
    const periodicidadeValue = parsePeriodicidade(seguro.periodicidade)

    const processedData = {
      designacao: seguro.designacao || '',
      apolice: seguro.apolice || '',
      seguradoraId: seguro.seguradoraId || '',
      assistenciaViagem: Boolean(seguro.assistenciaViagem),
      cartaVerde: Boolean(seguro.cartaVerde),
      riscosCobertos: seguro.riscosCobertos || undefined,
      valorCobertura: Number(seguro.valorCobertura || 0),
      custoAnual: Number(seguro.custoAnual || 0),
      dataInicial: seguro.dataInicial
        ? new Date(seguro.dataInicial)
        : new Date(),
      dataFinal: seguro.dataFinal ? new Date(seguro.dataFinal) : new Date(),
      periodicidade: periodicidadeValue as PeriodicidadeSeguro,
      metodoPagamento:
        metodoPagamentoValue !== undefined
          ? (metodoPagamentoValue as MetodoPagamentoSeguro)
          : undefined,
      dataPagamento: seguro.dataPagamento
        ? new Date(seguro.dataPagamento)
        : undefined,
      documentos: (seguro as any).documentos || [],
    }

    return processedData
  }, [seguroData])

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <span>A carregar...</span>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Seguro | Frotas' />

      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleClose}
          className='h-8 w-8'
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <Breadcrumbs
          items={[
            {
              title: 'Configurações',
              link: '/frotas/configuracoes',
            },
            {
              title: 'Seguros',
              link: '/frotas/configuracoes/seguros',
            },
            {
              title: 'Atualizar',
              link: `/frotas/configuracoes/seguros/update?seguroId=${seguroId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Seguro</h2>
        </div>
        <div className='p-6'>
          <SeguroUpdateForm
            modalClose={handleClose}
            seguroId={seguroId}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  )
}


