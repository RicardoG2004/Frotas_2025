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
import { useGetRubrica } from '../../queries/rubricas-queries'
import { RubricaUpdateForm } from '../rubricas-forms/rubrica-update-form'

export function RubricasUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const rubricaId = searchParams.get('rubricaId')
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

  // If no rubricaId is provided, redirect to rubricas page
  if (!rubricaId) {
    navigate('/utilitarios/tabelas/configuracoes/rubricas')
    return null
  }

  const { data: rubricaData, isLoading } = useGetRubrica(rubricaId)

  // Update window state with rubricaId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (rubricaId && currentWindow && !currentWindow.searchParams?.rubricaId) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { rubricaId },
      })
    }
  }, [rubricaId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Rubrica | Luma' />

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
              title: 'Rubricas',
              link: '/utilitarios/tabelas/configuracoes/rubricas',
            },
            {
              title: 'Atualizar',
              link: `/utilitarios/tabelas/configuracoes/rubricas/update?rubricaId=${rubricaId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Rubrica</h2>
        </div>
        <div className='p-6'>
          <RubricaUpdateForm
            modalClose={handleClose}
            rubricaId={rubricaId}
            initialData={{
              codigo: rubricaData?.info?.data?.codigo || '',
              epocaId: rubricaData?.info?.data?.epocaId || '',
              descricao: rubricaData?.info?.data?.descricao || '',
              classificacaoTipo:
                rubricaData?.info?.data?.classificacaoTipo || '',
              rubricaTipo: rubricaData?.info?.data?.rubricaTipo || 1,
            }}
          />
        </div>
      </div>
    </div>
  )
}
