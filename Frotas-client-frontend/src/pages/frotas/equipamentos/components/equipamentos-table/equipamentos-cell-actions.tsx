import { useState } from 'react'
import { EquipamentoDTO } from '@/types/dtos/frotas/equipamentos.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteEquipamento } from '../../queries/equipamentos-mutations'

interface CellActionProps {
  data: EquipamentoDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteEquipamentoMutation = useDeleteEquipamento()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteEquipamentoMutation.mutateAsync(
        data.id || ''
      )
      const result = handleApiResponse(
        response,
        'Equipamento removido com sucesso',
        'Erro ao remover o equipamento',
        'Equipamento removido com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o equipamento')
      setOpen(false)
    }
  }

  const handleUpdateClick = (equipamento: EquipamentoDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/frotas/configuracoes/equipamentos/update?equipamentoId=${equipamento.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteEquipamentoMutation.isPending}
        title='Remover Equipamento'
        description='Tem certeza que deseja remover este equipamento?'
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

