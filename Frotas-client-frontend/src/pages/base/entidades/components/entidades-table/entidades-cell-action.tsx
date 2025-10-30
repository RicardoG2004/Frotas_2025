import { useState } from 'react'
import { EntidadeDTO } from '@/types/dtos/base/entidades.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteEntidade } from '../../queries/entidades-mutations'

interface CellActionProps {
  data: EntidadeDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const deleteEntidadeMutation = useDeleteEntidade()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteEntidadeMutation.mutateAsync(data.id || '')

      const result = handleApiResponse(
        response,
        'Entidade removida com sucesso',
        'Erro ao remover a entidade',
        'Entidade removida com avisos'
      )

      if (result.success) {
        // Success or partial success - close modal
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover a entidade')
      setOpen(false)
    }
  }

  const handleUpdateClick = () => {
    // Generate a unique instance ID for the new window
    const uniqueInstanceId = generateInstanceId()

    // Navigate to the update page with the unique instance ID
    navigate(
      `/utilitarios/tabelas/configuracoes/entidades/update?entidadeId=${data.id}&instanceId=${uniqueInstanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteEntidadeMutation.isPending}
        title='Remover Entidade'
        description='Tem certeza que deseja remover a entidade selecionada?'
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
