import { useState } from 'react'
import { PecaDTO } from '@/types/dtos/frotas/pecas.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeletePeca } from '../../queries/pecas-mutations'

interface CellActionProps {
  data: PecaDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deletePecaMutation = useDeletePeca()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deletePecaMutation.mutateAsync(
        data.id || ''
      )
      const result = handleApiResponse(
        response,
        'Peça removida com sucesso',
        'Erro ao remover a peça',
        'Peça removida com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover a peça')
      setOpen(false)
    }
  }

  const handleUpdateClick = (peca: PecaDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/frotas/configuracoes/pecas/update?pecaId=${peca.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deletePecaMutation.isPending}
        title='Remover Peça'
        description='Tem certeza que deseja remover esta peça?'
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

