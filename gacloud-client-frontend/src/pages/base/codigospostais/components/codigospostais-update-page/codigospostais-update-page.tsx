import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetCodigoPostal } from '../../queries/codigospostais-queries'
import { CodigoPostalUpdateForm } from '../codigospostais-forms/codigopostal-update-form'

export function CodigosPostaisUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const codigoPostalId = searchParams.get('codigoPostalId')
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

  // If no codigoPostalId is provided, redirect to codigospostais page
  if (!codigoPostalId) {
    navigate('/utilitarios/tabelas/geograficas/codigospostais')
    return null
  }

  const { data: codigoPostalData, isLoading } =
    useGetCodigoPostal(codigoPostalId)

  // Update window state with codigoPostalId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (
      codigoPostalId &&
      currentWindow &&
      !currentWindow.searchParams?.codigoPostalId
    ) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { codigoPostalId },
      })
    }
  }, [codigoPostalId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Código Postal | Luma' />

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
              title: 'Geográficas',
              link: '/utilitarios/tabelas/geograficas',
            },
            {
              title: 'Códigos Postais',
              link: '/utilitarios/tabelas/geograficas/codigospostais',
            },
            {
              title: 'Atualizar',
              link: `/utilitarios/tabelas/geograficas/codigospostais/update?codigoPostalId=${codigoPostalId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Código Postal</h2>
        </div>
        <div className='p-6'>
          <CodigoPostalUpdateForm
            modalClose={handleClose}
            codigoPostalId={codigoPostalId}
            initialData={{
              codigo: codigoPostalData?.codigo || '',
              localidade: codigoPostalData?.localidade || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}
