import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useGetManutencao } from '../../queries/manutencoes-queries'
import { ManutencaoUpdateForm } from '../manutencoes-forms/manutencao-update-form'
import { parse } from 'date-fns'

export function ManutencoesUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const manutencaoId = searchParams.get('manutencaoId')
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

  if (!manutencaoId) {
    navigate('/frotas/manutencoes')
    return null
  }

  const { data: manutencaoData, isLoading } = useGetManutencao(manutencaoId)

  useEffect(() => {
    const currentWindow = windows.find(
      (w) => w.path === location.pathname && w.instanceId === instanceId
    )

    if (manutencaoId && currentWindow && !currentWindow.searchParams?.manutencaoId) {
      useWindowsStore.getState().updateWindowState(currentWindow.id, {
        searchParams: { manutencaoId },
      })
    }
  }, [manutencaoId, instanceId, windows])

  if (isLoading || !manutencaoData?.info?.data) {
    return <div>Loading...</div>
  }

  const manutencao = manutencaoData.info.data

  // Convert string dates to Date objects
  const initialData = {
    dataRequisicao: manutencao.dataRequisicao
      ? parse(manutencao.dataRequisicao.split('T')[0], 'yyyy-MM-dd', new Date())
      : new Date(),
    fseId: manutencao.fseId || '',
    funcionarioId: manutencao.funcionarioId || '',
    dataEntrada: manutencao.dataEntrada
      ? parse(manutencao.dataEntrada.split('T')[0], 'yyyy-MM-dd', new Date())
      : new Date(),
    horaEntrada: manutencao.horaEntrada || '',
    dataSaida: manutencao.dataSaida
      ? parse(manutencao.dataSaida.split('T')[0], 'yyyy-MM-dd', new Date())
      : new Date(),
    horaSaida: manutencao.horaSaida || '',
    viaturaId: manutencao.viaturaId || '',
    kmsRegistados: manutencao.kmsRegistados || 0,
    totalSemIva: manutencao.totalSemIva || 0,
    valorIva: manutencao.valorIva || 0,
    total: manutencao.total || 0,
    servicos: manutencao.manutencaoServicos?.map((servico) => ({
      id: servico.id || undefined,
      servicoId: servico.servicoId || '',
      quantidade: servico.quantidade || 1,
      kmProxima: servico.kmProxima ?? null,
      dataProxima: servico.dataProxima
        ? parse(servico.dataProxima.split('T')[0], 'yyyy-MM-dd', new Date())
        : null,
      valorSemIva: servico.valorSemIva || 0,
      ivaPercentagem: servico.ivaPercentagem || 0,
      valorTotal: servico.valorTotal || 0,
    })) || [],
  }

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Manutenção | Frotas' />

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
              title: 'Frotas',
              link: '/frotas',
            },
            {
              title: 'Manutenções',
              link: '/frotas/manutencoes',
            },
            {
              title: 'Atualizar',
              link: `/frotas/manutencoes/update?manutencaoId=${manutencaoId}&instanceId=${instanceId}`,
            },
          ]}
        />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Manutenção</h2>
        </div>
        <div className='p-6'>
          <ManutencaoUpdateForm
            modalClose={handleClose}
            manutencaoId={manutencaoId}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  )
}

