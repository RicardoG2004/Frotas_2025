import { useState } from 'react'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { FuncionarioDTO } from '@/types/dtos/base/funcionarios.dtos'
import { useDeleteFuncionario } from '../../queries/funcionarios-mutations'

interface CellActionProps {
  data: FuncionarioDTO
}

export const CellAction = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const deleteFuncionarioMutation = useDeleteFuncionario()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteFuncionarioMutation.mutateAsync(data.id)
      const result = handleApiResponse(
        response,
        'Funcionário removido com sucesso',
        'Erro ao remover o funcionário',
        'Funcionário removido com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro ao remover o funcionário')
      setOpen(false)
    }
  }

  const handleUpdateClick = () => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/configuracoes/funcionarios/update?funcionarioId=${data.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteFuncionarioMutation.isPending}
        title='Remover Funcionário'
        description='Tem a certeza que deseja remover este funcionário?'
      />

      <div className='flex items-center gap-2'>
        <Button
          onClick={handleUpdateClick}
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <Edit color='hsl(var(--primary))' className='h-4 w-4' />
          <span className='sr-only'>Atualizar</span>
        </Button>
        <Button
          onClick={() => setOpen(true)}
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <Trash color='hsl(var(--destructive))' className='h-4 w-4' />
          <span className='sr-only'>Apagar</span>
        </Button>
      </div>
    </>
  )
}

