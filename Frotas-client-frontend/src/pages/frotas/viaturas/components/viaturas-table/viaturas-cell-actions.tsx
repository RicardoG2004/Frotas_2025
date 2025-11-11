import { useState } from 'react'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ViaturaDTO } from '@/types/dtos/frotas/viaturas.dtos'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteViatura } from '@/pages/frotas/viaturas/queries/viaturas-mutations'

interface CellActionProps {
  data: ViaturaDTO
}

export const ViaturasCellAction = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteViaturaMutation = useDeleteViatura()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteViaturaMutation.mutateAsync(data.id)
      const result = handleApiResponse(
        response,
        'Viatura removida com sucesso',
        'Erro ao remover viatura',
        'Viatura removida com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover viatura')
      setOpen(false)
    }
  }

  const handleUpdateClick = (viatura: ViaturaDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/frotas/viaturas/update?viaturaId=${viatura.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteViaturaMutation.isPending}
        title='Remover Viatura'
        description='Tem certeza que deseja remover esta viatura?'
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

