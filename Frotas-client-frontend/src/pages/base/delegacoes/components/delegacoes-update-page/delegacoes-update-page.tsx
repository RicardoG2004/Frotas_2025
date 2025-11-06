import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetDelegacao } from '../../queries/delegacoes-queries'
import { DelegacaoUpdateForm } from '../delegacoes-forms/delegacao-update-form'

export function DelegacoesUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const delegacaoId = searchParams.get('delegacaoId')
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

  // If no delegacaoId is provided, redirect to delegacoes page
  if (!delegacaoId) {
    navigate('/utilitarios/tabelas/configuracoes/delegacoes')
    return null
  }

  const { data: delegacaoData, isLoading } = useGetDelegacao(delegacaoId)

  // Update window state with delegacaoId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (
      delegacaoId &&
      currentWindow &&
      !currentWindow.searchParams?.delegacaoId
    ) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: {
          ...currentWindow.searchParams,
          delegacaoId,
        },
      })
    }
  }, [delegacaoId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Delegação | Frotas' />

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
              title: 'Delegações',
              link: '/utilitarios/tabelas/configuracoes/delegacoes',
            },
            {
              title: 'Atualizar',
              link: `/utilitarios/tabelas/configuracoes/delegacoes/update?delegacaoId=${delegacaoId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Delegação</h2>
        </div>
        <div className='p-6'>
          <DelegacaoUpdateForm
            modalClose={handleClose}
            delegacaoId={delegacaoId}
            initialData={{
              designacao: delegacaoData?.designacao || '',
              morada: delegacaoData?.morada || '',
              localidade: delegacaoData?.localidade || '',
              codigoPostalId: delegacaoData?.codigoPostalId || '',
              paisId: delegacaoData?.paisId || '',
              telefone: delegacaoData?.telefone || '',
              email: delegacaoData?.email || '',
              fax: delegacaoData?.fax || '',
              enderecoHttp: delegacaoData?.enderecoHttp || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}

