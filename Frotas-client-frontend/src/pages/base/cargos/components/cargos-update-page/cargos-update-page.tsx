import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { useGetCargo } from '@/pages/base/cargos/queries/cargos-queries'
import { CargoUpdateForm } from '@/pages/base/cargos/components/cargos-forms/cargo-update-form'

export function CargosUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow, updateWindowState } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const cargoId = searchParams.get('cargoId')
  const instanceId = searchParams.get('instanceId') || 'default'
  const formId = instanceId

  const handleClose = () => {
    removeFormState(formId)

    const currentWindow = windows.find(
      (window) => window.path === location.pathname && window.instanceId === instanceId
    )

    if (currentWindow) {
      handleWindowClose(currentWindow.id, navigate, removeWindow)
    }
  }

  if (!cargoId) {
    navigate('/utilitarios/tabelas/configuracoes/cargos')
    return null
  }

  const { data: cargoData, isLoading } = useGetCargo(cargoId)

  useEffect(() => {
    const currentWindow = windows.find(
      (window) => window.path === location.pathname && window.instanceId === instanceId
    )

    if (
      cargoId &&
      currentWindow &&
      (!currentWindow.searchParams?.cargoId ||
        currentWindow.searchParams?.cargoId !== cargoId)
    ) {
      updateWindowState(currentWindow.id, {
        searchParams: {
          ...currentWindow.searchParams,
          cargoId,
        },
      })
    }
  }, [cargoId, instanceId, windows, location.pathname, updateWindowState])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Cargo | Frotas' />

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
              title: 'Cargos',
              link: '/utilitarios/tabelas/configuracoes/cargos',
            },
            {
              title: 'Atualizar',
              link: `/utilitarios/tabelas/configuracoes/cargos/update?cargoId=${cargoId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Cargo</h2>
        </div>
        <div className='p-6'>
          <CargoUpdateForm
            modalClose={handleClose}
            cargoId={cargoId}
            initialData={{
              designacao: cargoData?.designacao ?? '',
            }}
          />
        </div>
      </div>
    </div>
  )
}


