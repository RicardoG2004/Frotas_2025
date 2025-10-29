import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetSepultura } from '../../queries/sepulturas-queries'
import { SepulturaUpdateForm } from '../sepulturas-forms/sepultura-update-form'

export function SepulturasUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const sepulturaId = searchParams.get('sepulturaId')
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = instanceId

  const handleClose = () => {
    // Remove form data from the form store
    removeFormState(formId)

    // Find the current window and remove it
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (currentWindow) {
      handleWindowClose(currentWindow.id, navigate, removeWindow)
    }
  }

  // If no sepulturaId is provided, redirect to sepulturas page
  if (!sepulturaId) {
    navigate('/cemiterios/configuracoes/sepulturas')
    return null
  }

  const { data: sepulturaData, isLoading } = useGetSepultura(sepulturaId)

  // Update window state with cemiterioId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (
      sepulturaId &&
      currentWindow &&
      !currentWindow.searchParams?.sepulturaId
    ) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { sepulturaId },
      })
    }
  }, [sepulturaId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Sepultura | Luma' />

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
              link: '/configuracoes',
            },
            {
              title: 'Sepulturas',
              link: '/cemiterios/configuracoes/sepulturas',
            },
            {
              title: 'Atualizar',
              link: `/cemiterios/configuracoes/sepulturas/update?sepulturaId=${sepulturaId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Sepultura</h2>
        </div>
        <div className='p-6'>
          <SepulturaUpdateForm
            modalClose={handleClose}
            sepulturaId={sepulturaId}
            initialData={{
              nome: sepulturaData?.info?.data?.nome || '',
              talhaoId: sepulturaData?.info?.data?.talhaoId || '',
              sepulturaTipoId: sepulturaData?.info?.data?.sepulturaTipoId || '',
              sepulturaEstadoId:
                sepulturaData?.info?.data?.sepulturaEstadoId || 0,
              sepulturaSituacaoId:
                sepulturaData?.info?.data?.sepulturaSituacaoId || 0,
              fundura1: sepulturaData?.info?.data?.fundura1 || false,
              fundura2: sepulturaData?.info?.data?.fundura2 || false,
              fundura3: sepulturaData?.info?.data?.fundura3 || false,
              anulado: sepulturaData?.info?.data?.anulado || false,
              bloqueada: sepulturaData?.info?.data?.bloqueada || false,
              litigio: sepulturaData?.info?.data?.litigio || false,
              largura: sepulturaData?.info?.data?.largura,
              comprimento: sepulturaData?.info?.data?.comprimento,
              area: sepulturaData?.info?.data?.area,
              profundidade: sepulturaData?.info?.data?.profundidade,
              fila: sepulturaData?.info?.data?.fila,
              coluna: sepulturaData?.info?.data?.coluna,
              dataConcessao: sepulturaData?.info?.data?.dataConcessao,
              dataInicioAluguer: sepulturaData?.info?.data?.dataInicioAluguer,
              dataFimAluguer: sepulturaData?.info?.data?.dataFimAluguer,
              dataInicioReserva: sepulturaData?.info?.data?.dataInicioReserva,
              dataFimReserva: sepulturaData?.info?.data?.dataFimReserva,
              dataConhecimento: sepulturaData?.info?.data?.dataConhecimento,
              numeroConhecimento: sepulturaData?.info?.data?.numeroConhecimento,
              dataAnulacao: sepulturaData?.info?.data?.dataAnulacao,
              observacao: sepulturaData?.info?.data?.observacao,
            }}
          />
        </div>
      </div>
    </div>
  )
}
