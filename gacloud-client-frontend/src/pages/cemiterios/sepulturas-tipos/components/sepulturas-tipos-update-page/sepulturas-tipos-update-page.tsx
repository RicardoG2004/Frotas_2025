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
import { ScrollIndicator } from '@/components/shared/scroll-indicator'
import { useGetSepulturaTipo } from '../../queries/sepulturas-tipos-queries'
import { SepulturaTipoUpdateForm } from '../sepulturas-tipos-forms/sepulturas-tipos-update-form'

export function SepulturasTiposUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const sepulturaTipoId = searchParams.get('sepulturaTipoId')
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

  // If no cemiterioZonaId is provided, redirect to ruas page
  if (!sepulturaTipoId) {
    navigate('/cemiterios/configuracoes/sepulturas/tipos')
    return null
  }

  const { data: sepulturaTipoData, isLoading } =
    useGetSepulturaTipo(sepulturaTipoId)

  // Update window state with cemiterioZonaId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (
      sepulturaTipoId &&
      currentWindow &&
      !currentWindow.searchParams?.sepulturaTipoId
    ) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { sepulturaTipoId },
      })
    }
  }, [sepulturaTipoId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Tipo de Sepultura [E] | Luma' />
      <ScrollIndicator />

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
              link: '/cemiterios/configuracoes',
            },
            {
              title: 'Sepulturas',
              link: '/cemiterios/configuracoes/sepulturas',
            },
            {
              title: 'Tipos de Sepultura [E]',
              link: '/cemiterios/configuracoes/sepulturas/tipos',
            },
            {
              title: 'Atualizar',
              link: `/cemiterios/configuracoes/sepulturas/tipos/update?sepulturaTipoId=${sepulturaTipoId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>
            Atualizar Tipo de Sepultura [E]
          </h2>
        </div>
        <div className='p-6'>
          <SepulturaTipoUpdateForm
            modalClose={handleClose}
            sepulturaTipoId={sepulturaTipoId}
            initialData={{
              nome: sepulturaTipoData?.info?.data?.nome || '',
              epocaId: sepulturaTipoData?.info?.data?.epocaId || '',
              sepulturaTipoDescricaoId:
                sepulturaTipoData?.info?.data?.sepulturaTipoDescricaoId || '',
              vendaRubrica: sepulturaTipoData?.info?.data?.vendaRubrica || '',
              vendaValor: sepulturaTipoData?.info?.data?.vendaValor,
              vendaDescricao:
                sepulturaTipoData?.info?.data?.vendaDescricao || '',
              aluguerRubrica:
                sepulturaTipoData?.info?.data?.aluguerRubrica || '',
              aluguerValor: sepulturaTipoData?.info?.data?.aluguerValor,
              aluguerDescricao:
                sepulturaTipoData?.info?.data?.aluguerDescricao || '',
              alvaraRubrica: sepulturaTipoData?.info?.data?.alvaraRubrica || '',
              alvaraValor: sepulturaTipoData?.info?.data?.alvaraValor,
              alvaraDescricao:
                sepulturaTipoData?.info?.data?.alvaraDescricao || '',
              transladacaoRubrica:
                sepulturaTipoData?.info?.data?.transladacaoRubrica || '',
              transladacaoValor:
                sepulturaTipoData?.info?.data?.transladacaoValor,
              transladacaoDescricao:
                sepulturaTipoData?.info?.data?.transladacaoDescricao || '',
              transferenciaRubrica:
                sepulturaTipoData?.info?.data?.transferenciaRubrica || '',
              transferenciaValor:
                sepulturaTipoData?.info?.data?.transferenciaValor,
              transferenciaDescricao:
                sepulturaTipoData?.info?.data?.transferenciaDescricao || '',
              exumacaoRubrica:
                sepulturaTipoData?.info?.data?.exumacaoRubrica || '',
              exumacaoValor: sepulturaTipoData?.info?.data?.exumacaoValor,
              exumacaoDescricao:
                sepulturaTipoData?.info?.data?.exumacaoDescricao || '',
              inumacaoRubrica:
                sepulturaTipoData?.info?.data?.inumacaoRubrica || '',
              inumacaoValor: sepulturaTipoData?.info?.data?.inumacaoValor,
              inumacaoDescricao:
                sepulturaTipoData?.info?.data?.inumacaoDescricao || '',
              concessionadaRubrica:
                sepulturaTipoData?.info?.data?.concessionadaRubrica || '',
              concessionadaValor:
                sepulturaTipoData?.info?.data?.concessionadaValor,
              concessionadaDescricao:
                sepulturaTipoData?.info?.data?.concessionadaDescricao || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}
