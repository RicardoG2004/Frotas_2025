import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetGarantia } from '../../queries/garantias-queries'
import { GarantiaUpdateForm } from '../garantias-forms/garantia-update-form'

export function GarantiasUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const garantiaId = searchParams.get('garantiaId')
  const instanceId = searchParams.get('instanceId') || 'default'
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

  if (!garantiaId) {
    navigate('/utilitarios/tabelas/configuracoes/garantias')
    return null
  }

  const { data: garantiaData, isLoading } = useGetGarantia(garantiaId)

  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (
      garantiaId &&
      currentWindow &&
      !currentWindow.searchParams?.garantiaId
    ) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { garantiaId },
      })
    }
  }, [garantiaId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Garantia | Frotas' />

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
              title: 'Utilitários',
              link: '/utilitarios/tabelas',
            },
            {
              title: 'Garantias',
              link: '/utilitarios/tabelas/configuracoes/garantias',
            },
            {
              title: 'Atualizar',
              link: `/utilitarios/tabelas/configuracoes/garantias/update?garantiaId=${garantiaId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

  <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Garantia</h2>
        </div>
        <div className='p-6'>
          <GarantiaUpdateForm
            modalClose={handleClose}
            garantiaId={garantiaId}
            initialData={{
              designacao: garantiaData?.designacao ?? '',
              anos:
                garantiaData?.anos != null ? String(garantiaData.anos) : '',
              kms:
                garantiaData?.kms != null ? String(garantiaData.kms) : '',
            }}
          />
        </div>
      </div>
    </div>
  )
}


