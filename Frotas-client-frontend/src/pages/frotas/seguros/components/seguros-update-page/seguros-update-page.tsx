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
import { PeriodicidadeSeguro } from '@/types/dtos/frotas/seguros.dtos'

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
        valorCobertura: 0,
        custoAnual: 0,
        riscosCobertos: '',
        dataInicial: new Date(),
        dataFinal: new Date(),
        periodicidade: PeriodicidadeSeguro.Anual,
      }
    }

    return {
      designacao: seguro.designacao || '',
      apolice: seguro.apolice || '',
      seguradoraId: seguro.seguradoraId || '',
      assistenciaViagem: Boolean(seguro.assistenciaViagem),
      cartaVerde: Boolean(seguro.cartaVerde),
      valorCobertura: Number(seguro.valorCobertura || 0),
      custoAnual: Number(seguro.custoAnual || 0),
      riscosCobertos: seguro.riscosCobertos || '',
      dataInicial: seguro.dataInicial
        ? new Date(seguro.dataInicial)
        : new Date(),
      dataFinal: seguro.dataFinal ? new Date(seguro.dataFinal) : new Date(),
      periodicidade: seguro.periodicidade ?? PeriodicidadeSeguro.Anual,
    }
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


