import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { EpocaUpdateForm } from '../epocas-forms/epoca-update-form'

export function EpocasUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { findWindowByPathAndInstanceId, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const epocaId = searchParams.get('epocaId')
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = instanceId

  const handleClose = () => {
    // Remove form data from the form store
    removeFormState(formId)

    // Find the current window and remove it
    const currentWindow = findWindowByPathAndInstanceId(
      location.pathname,
      instanceId
    )

    if (currentWindow) {
      handleWindowClose(currentWindow.id, navigate, removeWindow)
    }
  }

  // If no epocaId is provided, redirect to epocas page
  if (!epocaId) {
    navigate('/utilitarios/tabelas/configuracoes/epocas')
    return null
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Época | Frotas' />

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
              title: 'Épocas',
              link: '/utilitarios/tabelas/configuracoes/epocas',
            },
            {
              title: 'Atualizar',
              link: `/utilitarios/tabelas/configuracoes/epocas/update?epocaId=${epocaId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Época</h2>
        </div>
        <div className='p-6'>
          <EpocaUpdateForm
            epocaId={epocaId}
            modalClose={handleClose}
            initialData={{
              ano: '',
              descricao: '',
              predefinida: false,
              bloqueada: false,
              epocaAnteriorId: '',
            }}
          />
        </div>
      </div>
    </div>
  )
}
