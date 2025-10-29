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
import { useGetSepulturaTipoDescricao } from '../../queries/sepulturas-tipos-descricoes-queries'
import { SepulturaTipoDescricaoUpdateForm } from '../sepulturas-tipos-descricoes-forms/sepulturas-tipos-descricoes-update-form'

export function SepulturasTiposDescricoesUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const sepulturaTipoDescricaoId = searchParams.get('sepulturaTipoDescricaoId')
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

  // If no sepulturaTipoDescricaoId is provided, redirect to ruas page
  if (!sepulturaTipoDescricaoId) {
    navigate('/cemiterios/outros/tipos-descricoes')
    return null
  }

  const { data: sepulturaTipoDescricaoData, isLoading } =
    useGetSepulturaTipoDescricao(sepulturaTipoDescricaoId)

  // Update window state with sepulturaTipoDescricaoId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (
      sepulturaTipoDescricaoId &&
      currentWindow &&
      !currentWindow.searchParams?.sepulturaTipoDescricaoId
    ) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { sepulturaTipoDescricaoId },
      })
    }
  }, [sepulturaTipoDescricaoId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Tipo de Sepultura [G] | Luma' />

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
              title: 'Outros',
              link: '/cemiterios/outros',
            },
            {
              title: 'Tipos de Sepultura [G]',
              link: '/cemiterios/outros/tipos-descricoes',
            },
            {
              title: 'Atualizar',
              link: `/cemiterios/outros/tipos-descricoes/update?sepulturaTipoDescricaoId=${sepulturaTipoDescricaoId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>
            Atualizar Tipo de Sepultura [G]
          </h2>
        </div>
        <div className='p-6'>
          <SepulturaTipoDescricaoUpdateForm
            modalClose={handleClose}
            sepulturaTipoDescricaoId={sepulturaTipoDescricaoId}
            initialData={{
              descricao:
                sepulturaTipoDescricaoData?.info?.data?.descricao || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}
