import { useState } from 'react'
import { ModeloDTO } from '@/types/dtos/frotas/modelos.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteModelo } from '../../queries/modelos-mutations'

interface CellActionProps {
  data: ModeloDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteModeloMutation = useDeleteModelo()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteModeloMutation.mutateAsync(data.id || '')
      const result = handleApiResponse(
        response,
        'Modelo removido com sucesso',
        'Erro ao remover o modelo',
        'Modelo removido com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o modelo')
      setOpen(false)
    }
  }

  const handleUpdateClick = (modelo: ModeloDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/frotas/configuracoes/modelos/update?modeloId=${modelo.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteModeloMutation.isPending}
        title='Remover Modelo'
        description='Tem certeza que deseja remover este modelo?'
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
