import { useState } from 'react'
import { ManutencaoDTO } from '@/types/dtos/frotas/manutencoes.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteManutencao } from '../../queries/manutencoes-mutations'

interface CellActionProps {
  data: ManutencaoDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteManutencaoMutation = useDeleteManutencao()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteManutencaoMutation.mutateAsync(
        data.id || ''
      )
      const result = handleApiResponse(
        response,
        'Manutenção removida com sucesso',
        'Erro ao remover a manutenção',
        'Manutenção removida com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover a manutenção')
      setOpen(false)
    }
  }

  const handleUpdateClick = (manutencao: ManutencaoDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/frotas/manutencoes/update?manutencaoId=${manutencao.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteManutencaoMutation.isPending}
        title='Remover Manutenção'
        description='Tem certeza que deseja remover esta manutenção?'
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

