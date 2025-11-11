import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { useGetEntidade } from '@/pages/base/entidades/queries/entidades-queries'
import { EntidadeUpdateForm } from '@/pages/base/entidades/components/entidades-forms/entidade-update-form'

export function EntidadesUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow, updateWindowState } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const entidadeId = searchParams.get('entidadeId')
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

  if (!entidadeId) {
    navigate('/utilitarios/tabelas/configuracoes/entidades')
    return null
  }

  const { data: entidadeData, isLoading } = useGetEntidade(entidadeId)

  useEffect(() => {
    const currentWindow = windows.find(
      (window) => window.path === location.pathname && window.instanceId === instanceId
    )

    if (
      entidadeId &&
      currentWindow &&
      (!currentWindow.searchParams?.entidadeId ||
        currentWindow.searchParams?.entidadeId !== entidadeId)
    ) {
      updateWindowState(currentWindow.id, {
        searchParams: {
          ...currentWindow.searchParams,
          entidadeId,
        },
      })
    }
  }, [entidadeId, instanceId, windows, location.pathname, updateWindowState])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Entidade | Frotas' />

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
              title: 'Entidades',
              link: '/utilitarios/tabelas/configuracoes/entidades',
            },
            {
              title: 'Atualizar',
              link: `/utilitarios/tabelas/configuracoes/entidades/update?entidadeId=${entidadeId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Entidade</h2>
        </div>
        <div className='p-6'>
          <EntidadeUpdateForm
            modalClose={handleClose}
            entidadeId={entidadeId}
            initialData={{
              designacao: entidadeData?.designacao || '',
              morada: entidadeData?.morada || '',
              localidade: entidadeData?.localidade || '',
              codigoPostalId: entidadeData?.codigoPostalId || '',
              paisId: entidadeData?.paisId || '',
              telefone: entidadeData?.telefone || '',
              fax: entidadeData?.fax || '',
              enderecoHttp: entidadeData?.enderecoHttp || '',
              email: entidadeData?.email || '',
            }}
          />
        </div>
      </div>
    </div>
  )
}


