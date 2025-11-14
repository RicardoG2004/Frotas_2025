import { ArrowLeft } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PageHead } from '@/components/shared/page-head'
import { useFormsStore } from '@/stores/use-forms-store'
import { useWindowsStore } from '@/stores/use-windows-store'
import { handleWindowClose } from '@/utils/window-utils'
import { useGetFuncionario } from '../../queries/funcionarios-queries'
import FuncionarioUpdateForm from '../funcionarios-forms/funcionario-update-form'

export function FuncionariosUpdatePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { removeFormState } = useFormsStore()
  const { windows, removeWindow } = useWindowsStore()
  const searchParams = new URLSearchParams(location.search)
  const instanceId = searchParams.get('instanceId') || 'default'
  const funcionarioId = searchParams.get('funcionarioId') || ''
  const formId = instanceId

  const { data: funcionarioData, isLoading } = useGetFuncionario(funcionarioId)

  const handleClose = () => {
    removeFormState(formId)
    const currentWindow = windows.find(
      (window) => window.path === location.pathname && window.instanceId === instanceId
    )
    if (currentWindow) {
      handleWindowClose(currentWindow.id, navigate, removeWindow)
    }
  }

  const breadcrumbs = [
    {
      title: 'Configurações',
      link: '/utilitarios/tabelas/configuracoes',
    },
    {
      title: 'Funcionários',
      link: '/utilitarios/tabelas/configuracoes/funcionarios',
    },
    {
      title: 'Atualizar',
      link: `/utilitarios/tabelas/configuracoes/funcionarios/update?funcionarioId=${funcionarioId}&instanceId=${instanceId}`,
    },
  ]

  return (
    <div className='flex h-full flex-col gap-8 px-4 md:px-8 md:pb-8 md:pt-28 pt-14 md:mx-0 md:my-4 md:mr-4 md:rounded-xl pb-24'>
      <PageHead title='Atualizar Funcionário | Base' />

      <div className='flex items-center gap-4'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleClose}
          className='h-8 w-8'
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className='rounded-lg border bg-card'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-base font-medium'>Atualizar Funcionário</h2>
        </div>
        <div className='p-6'>
          {isLoading || !funcionarioData ? (
            <p className='text-sm text-muted-foreground'>A carregar dados do funcionário...</p>
          ) : (
            <FuncionarioUpdateForm
              modalClose={handleClose}
              funcionarioId={funcionarioId}
              initialData={{
                nome: funcionarioData.nome,
                morada: funcionarioData.morada,
                freguesiaId: funcionarioData.freguesiaId,
                codigoPostalId: funcionarioData.codigoPostalId,
                cargoId: funcionarioData.cargoId,
                email: funcionarioData.email,
                telefone: funcionarioData.telefone,
                delegacaoId: funcionarioData.delegacaoId,
                ativo: funcionarioData.ativo,
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

