import { useState } from 'react'
import { CombustivelDTO } from '@/types/dtos/frotas/combustiveis.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteCombustivel } from '../../queries/combustiveis-mutations'

interface CellActionProps {
  data: CombustivelDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteCombustivelMutation = useDeleteCombustivel()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteCombustivelMutation.mutateAsync(data.id || '')
      const result = handleApiResponse(
        response,
        'Combustível removido com sucesso',
        'Erro ao remover o combustível',
        'Combustível removido com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o modelo')
      setOpen(false)
    }
  }

  const handleUpdateClick = (combustivel: CombustivelDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/frotas/configuracoes/combustiveis/update?combustivelId=${combustivel.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteCombustivelMutation.isPending}
        title='Remover Combustível'
        description='Tem certeza que deseja remover este combustível?'
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
