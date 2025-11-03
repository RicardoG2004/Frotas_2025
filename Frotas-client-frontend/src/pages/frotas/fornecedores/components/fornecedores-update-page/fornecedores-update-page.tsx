import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetFornecedor } from '@/pages/frotas/fornecedores/queries/fornecedores-queries'
import FornecedorUpdateForm from '@/pages/frotas/fornecedores/components/fornecedores-forms/fornecedor-update-form'

export function FornecedoresUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const fornecedorId = searchParams.get('fornecedorId')
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

  // If no fornecedorId is provided, redirect to fornecedores page
  if (!fornecedorId) {
    return null
  }

  const { data: fornecedorData, isLoading } = useGetFornecedor(fornecedorId)

  // Update window state with fornecedorId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (fornecedorId && currentWindow && !currentWindow.searchParams?.fornecedorId) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { fornecedorId },
      })
    }
  }, [fornecedorId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Fornecedor | Frotas' />

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
              link: '/frotas/configuracoes',
            },
            {
              title: 'Fornecedores',
              link: '/frotas/configuracoes/fornecedores',
            },
            {
              title: 'Atualizar',
              link: `/frotas/configuracoes/fornecedores/update?fornecedorId=${fornecedorId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Fornecedor</h2>
        </div>
        <div className='p-6'>
          <FornecedorUpdateForm
            modalClose={handleClose}
            fornecedorId={fornecedorId}
            initialData={{
              nome: fornecedorData?.info?.data?.nome || '',
              numContribuinte: fornecedorData?.info?.data?.numContribuinte || '',
              origem: fornecedorData?.info?.data?.origem || 'Nacional',
              ativo: fornecedorData?.info?.data?.ativo ?? true,
              contacto: fornecedorData?.info?.data?.contacto || '',
              telefone: fornecedorData?.info?.data?.telefone || '',
              telemovel: fornecedorData?.info?.data?.telemovel || '',
              fax: fornecedorData?.info?.data?.fax || '',
              email: fornecedorData?.info?.data?.email || '',
              url: fornecedorData?.info?.data?.url || '',
              moradaEscritorio: fornecedorData?.info?.data?.moradaEscritorio || '',
              codigoPostalEscritorioId: fornecedorData?.info?.data?.codigoPostalEscritorioId || '',
              paisEscritorioId: fornecedorData?.info?.data?.paisEscritorioId || '',
              moradaCarga: fornecedorData?.info?.data?.moradaCarga || '',
              codigoPostalCargaId: fornecedorData?.info?.data?.codigoPostalCargaId || '',
              paisCargaId: fornecedorData?.info?.data?.paisCargaId || '',
              mesmoEndereco: fornecedorData?.info?.data?.mesmoEndereco ?? false,
            }}
          />
        </div>
      </div>
    </div>
  )
}

