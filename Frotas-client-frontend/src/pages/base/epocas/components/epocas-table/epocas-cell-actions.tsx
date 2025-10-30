import { useState } from 'react'
import { EpocaDTO } from '@/types/dtos/base/epocas.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteEpoca } from '../../queries/epocas-mutations'

interface CellActionProps {
  data: EpocaDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const deleteEpocaMutation = useDeleteEpoca()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteEpocaMutation.mutateAsync(data.id || '')

      const result = handleApiResponse(
        response,
        'Época removida com sucesso',
        'Erro ao remover a época',
        'Época removida com avisos'
      )

      if (result.success) {
        // Success or partial success - close modal
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover a época')
      setOpen(false)
    }
  }

  const handleUpdateClick = () => {
    // Generate a unique instance ID for the new window
    const uniqueInstanceId = generateInstanceId()

    // Navigate to the update page with the unique instance ID
    navigate(
      `/utilitarios/tabelas/configuracoes/epocas/update?epocaId=${data.id}&instanceId=${uniqueInstanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteEpocaMutation.isPending}
        title='Remover Época'
        description='Tem certeza que deseja remover a época selecionada?'
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
