import { useState } from 'react'
import { CoveiroDTO } from '@/types/dtos/frotas/coveiros.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteCoveiro } from '../../queries/coveiros-mutations'

interface CellActionProps {
  data: CoveiroDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteCoveiroMutation = useDeleteCoveiro()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteCoveiroMutation.mutateAsync(data.id || '')
      const result = handleApiResponse(
        response,
        'Coveiro removido com sucesso',
        'Erro ao remover o coveiro',
        'Coveiro removido com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o coveiro')
      setOpen(false)
    }
  }

  const handleUpdateClick = (coveiro: CoveiroDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/frotas/configuracoes/coveiros/update?coveiroId=${coveiro.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteCoveiroMutation.isPending}
        title='Remover Coveiro'
        description='Tem certeza que deseja remover este coveiro?'
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
