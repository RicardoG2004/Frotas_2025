import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetConservatoria } from '../../../conservatorias/queries/conservatorias-queries'
import { ConservatoriaUpdateForm } from '../conservatorias-forms/conservatoria-update-form'

export function ConservatoriasUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const conservatoriaId = searchParams.get('conservatoriaId')
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

  // If no setorId is provided, redirect to setores page
  if (!conservatoriaId) {
    navigate('/utilitarios/tabelas/configuracoes/conservatorias')
    return null
  }

    const { data: conservatoriaData, isLoading } = useGetConservatoria(conservatoriaId)

  // Update window state with conservatoriaId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (
      conservatoriaId &&
      currentWindow &&
      !currentWindow.searchParams?.conservatoriaId
    ) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: {
          ...currentWindow.searchParams,
          conservatoriaId,
        },
      })
    }
  }, [conservatoriaId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Conservatória | Frotas' />

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
              link: '/utilitarios/tabelas/configuracoes',
            },
            {
              title: 'Conservatorias',
              link: '/utilitarios/tabelas/configuracoes/conservatorias',
            },
            {
              title: 'Atualizar',
              link: `/utilitarios/tabelas/configuracoes/conservatorias/update?conservatoriaId=${conservatoriaId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Conservatória</h2>
        </div>
        <div className='p-6'>
          <ConservatoriaUpdateForm
            modalClose={handleClose}
            conservatoriaId={conservatoriaId}
            initialData={{
              designacao:
                conservatoriaData?.designacao ?? conservatoriaData?.nome ?? '',
              morada: conservatoriaData?.morada || '',
              codigoPostalId: conservatoriaData?.codigoPostalId || '',
              freguesiaId: conservatoriaData?.freguesiaId || '',
              concelhoId: conservatoriaData?.concelhoId || '',
              telefone: conservatoriaData?.telefone || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}

