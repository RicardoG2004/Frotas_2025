import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetFse } from '../../queries/fses-queries'
import FseUpdateForm from '../fses-forms/fse-update-form'

export function FsesUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const fseId = searchParams.get('fseId')
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

  if (!fseId) {
    return null
  }

  const { data: fseData, isLoading } = useGetFse(fseId)

  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (fseId && currentWindow && !currentWindow.searchParams?.fseId) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { fseId },
      })
    }
  }, [fseId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Fornecedor Serviços Externos | Base' />

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
              title: 'Fornecedores Serviços Externos',
              link: '/utilitarios/tabelas/configuracoes/fses',
            },
            {
              title: 'Atualizar',
              link: `/utilitarios/tabelas/configuracoes/fses/update?fseId=${fseId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Fornecedor Serviços Externos</h2>
        </div>
        <div className='p-6'>
          <FseUpdateForm
            modalClose={handleClose}
            fseId={fseId}
            initialData={{
              nome: fseData?.info?.data?.nome || '',
              numContribuinte: fseData?.info?.data?.numContribuinte || '',
              telefone: fseData?.info?.data?.telefone || '',
              morada: fseData?.info?.data?.morada || '',
              codigoPostalId: fseData?.info?.data?.codigoPostalId || '',
              paisId: fseData?.info?.data?.paisId || '',
              contacto: fseData?.info?.data?.contacto || '',
              fax: fseData?.info?.data?.fax || '',
              email: fseData?.info?.data?.email || '',
              enderecoHttp: fseData?.info?.data?.enderecoHttp || '',
              origem: fseData?.info?.data?.origem || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}

