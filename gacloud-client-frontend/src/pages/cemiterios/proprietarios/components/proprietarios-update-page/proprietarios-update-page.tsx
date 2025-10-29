import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { fromDatabaseDate } from '@/utils/date-utils'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetProprietario } from '../../queries/proprietarios-queries'
import { ProprietarioUpdateForm } from '../proprietarios-forms/proprietario-update-form'

export function ProprietariosUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const proprietarioId = searchParams.get('proprietarioId')
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

  // If no proprietarioId is provided, redirect to proprietarios page
  if (!proprietarioId) {
    navigate('/cemiterios/configuracoes/proprietarios')
    return null
  }

  const { data: proprietarioData, isLoading } =
    useGetProprietario(proprietarioId)

  // Update window state with proprietarioId if it's not already set
  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (
      proprietarioId &&
      currentWindow &&
      !currentWindow.searchParams?.proprietarioId
    ) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { proprietarioId },
      })
    }
  }, [proprietarioId, instanceId, windows])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Proprietário | Luma' />

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
              link: '/configuracoes',
            },
            {
              title: 'Proprietários',
              link: '/cemiterios/configuracoes/proprietarios',
            },
            {
              title: 'Atualizar',
              link: `/cemiterios/configuracoes/proprietarios/update?proprietarioId=${proprietarioId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Proprietário</h2>
        </div>
        <div className='p-6'>
          <ProprietarioUpdateForm
            modalClose={handleClose}
            proprietarioId={proprietarioId}
            initialData={{
              cemiterioId: proprietarioData?.info?.data?.cemiterioId || '',
              entidadeId: proprietarioData?.info?.data?.entidadeId || '',
              sepulturas:
                proprietarioData?.info?.data?.sepulturas?.map((sepultura) => ({
                  id: sepultura.id,
                  sepulturaId: sepultura.sepulturaId,
                  data: fromDatabaseDate(sepultura.data) || new Date(),
                  ativo: sepultura.ativo,
                  isProprietario: sepultura.isProprietario,
                  isResponsavel: sepultura.isResponsavel,
                  isResponsavelGuiaReceita: sepultura.isResponsavelGuiaReceita,
                  dataInativacao: fromDatabaseDate(sepultura.dataInativacao),
                  fracao: sepultura.fracao,
                  observacoes: sepultura.observacoes,
                  historico: sepultura.historico,
                })) || [],
            }}
          />
        </div>
      </div>
    </div>
  )
}
