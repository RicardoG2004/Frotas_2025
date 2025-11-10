import { useState } from 'react'
import { SeguroDTO } from '@/types/dtos/frotas/seguros.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteSeguro } from '@/pages/frotas/seguros/queries/seguros-mutations'

interface CellActionProps {
  data: SeguroDTO
}

export const CellAction = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteSeguroMutation = useDeleteSeguro()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteSeguroMutation.mutateAsync(data.id || '')
      const result = handleApiResponse(
        response,
        'Seguro removido com sucesso',
        'Erro ao remover o seguro',
        'Seguro removido com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o seguro')
      setOpen(false)
    }
  }

  const handleUpdateClick = (seguro: SeguroDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/frotas/configuracoes/seguros/update?seguroId=${seguro.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteSeguroMutation.isPending}
        title='Remover Seguro'
        description='Tem certeza que deseja remover este seguro?'
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


