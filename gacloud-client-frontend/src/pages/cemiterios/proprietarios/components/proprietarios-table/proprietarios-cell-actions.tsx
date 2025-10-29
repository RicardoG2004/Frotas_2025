import { useState } from 'react'
import { ProprietarioDTO } from '@/types/dtos/cemiterios/proprietarios.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteProprietario } from '../../queries/proprietarios-mutations'

interface CellActionProps {
  data: ProprietarioDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteProprietarioMutation = useDeleteProprietario()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteProprietarioMutation.mutateAsync(
        data.id || ''
      )
      const result = handleApiResponse(
        response,
        'Proprietário removido com sucesso',
        'Erro ao remover o proprietário',
        'Proprietário removido com avisos'
      )

      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o proprietário')
      setOpen(false)
    }
  }

  const handleUpdateClick = (proprietario: ProprietarioDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/cemiterios/configuracoes/proprietarios/update?proprietarioId=${proprietario.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteProprietarioMutation.isPending}
        title='Remover Proprietário'
        description='Tem certeza que deseja remover este proprietário?'
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
