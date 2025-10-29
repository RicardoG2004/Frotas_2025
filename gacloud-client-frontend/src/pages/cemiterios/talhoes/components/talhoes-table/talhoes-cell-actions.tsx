import { useState } from 'react'
import { TalhaoDTO } from '@/types/dtos/cemiterios/talhoes.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteTalhao } from '../../queries/talhoes-mutations'

interface CellActionProps {
  data: TalhaoDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteTalhaoMutation = useDeleteTalhao()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteTalhaoMutation.mutateAsync(data.id || '')
      const result = handleApiResponse(
        response,
        'Talhão removido com sucesso',
        'Erro ao remover o talhão',
        'Talhão removido com avisos'
      )

      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o talhão')
      setOpen(false)
    }
  }

  const handleUpdateClick = (talhao: TalhaoDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/cemiterios/configuracoes/talhoes/update?talhaoId=${talhao.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteTalhaoMutation.isPending}
        title='Remover Talhão'
        description='Tem certeza que deseja remover este talhão?'
      />

      <div className='flex items-center gap-2'>
        <Button
          onClick={() => handleUpdateClick(data)}
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
