import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { ViaturaCreateForm } from '../viaturas-forms/viatura-create-form'

export function ViaturasCreatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
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

  return (
    <div className='flex h-full flex-col gap-8 px-4 pb-24 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl md:px-8 md:pb-8 md:pt-28'>
      <PageHead title='Criar Viatura | Frotas' />

      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={handleClose} className='h-8 w-8'>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <Breadcrumbs
          items={[
            {
              title: 'Frotas',
              link: '/frotas',
            },
            {
              title: 'Viaturas',
              link: '/frotas/viaturas',
            },
            {
              title: 'Criar',
              link: `/frotas/viaturas/create?instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Criar Viatura</h2>
        </div>
        <div className='p-6'>
          <ViaturaCreateForm />
        </div>
      </div>
    </div>
  )
}

