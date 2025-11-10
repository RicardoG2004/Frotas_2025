import { useState } from 'react'
import { SeguradoraDTO } from '@/types/dtos/frotas/seguradoras.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteSeguradora } from '@/pages/frotas/seguradoras/queries/seguradoras-mutations'

interface CellActionProps {
  data: SeguradoraDTO
}

export const CellAction = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteSeguradoraMutation = useDeleteSeguradora()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteSeguradoraMutation.mutateAsync(data.id || '')
      const result = handleApiResponse(
        response,
        'Seguradora removida com sucesso',
        'Erro ao remover a seguradora',
        'Seguradora removida com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover a seguradora')
      setOpen(false)
    }
  }

  const handleUpdateClick = (seguradora: SeguradoraDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/frotas/configuracoes/seguradoras/update?seguradoraId=${seguradora.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteSeguradoraMutation.isPending}
        title='Remover Seguradora'
        description='Tem certeza que deseja remover esta seguradora?'
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


