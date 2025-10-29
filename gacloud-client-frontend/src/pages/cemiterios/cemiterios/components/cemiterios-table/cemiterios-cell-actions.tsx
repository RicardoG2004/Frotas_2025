import { useState } from 'react'
import { CemiterioDTO } from '@/types/dtos/cemiterios/cemiterios.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteCemiterio } from '../../queries/cemiterios-mutations'

interface CellActionProps {
  data: CemiterioDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteCemiterioMutation = useDeleteCemiterio()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteCemiterioMutation.mutateAsync(data.id || '')

      const result = handleApiResponse(
        response,
        'Cemitério removido com sucesso',
        'Erro ao remover o cemitério',
        'Cemitério removido com avisos'
      )

      if (result.success) {
        // Success or partial success - close modal
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o cemitério')
      setOpen(false)
    }
  }

  const handleUpdateClick = (cemiterio: CemiterioDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/cemiterios/configuracoes/cemiterios/update?cemiterioId=${cemiterio.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteCemiterioMutation.isPending}
        title='Remover Cemitério'
        description='Tem certeza que deseja remover este cemitério?'
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
