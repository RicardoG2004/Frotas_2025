import { useState } from 'react'
import { SetorDTO } from '@/types/dtos/base/setores.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteSetor } from '../../queries/setores-mutations'

interface CellActionProps {
  data: SetorDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteSetorMutation = useDeleteSetor()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteSetorMutation.mutateAsync(data.id || '')

      const result = handleApiResponse(
        response,
        'Setor removido com sucesso',
        'Erro ao remover o setor',
        'Setor removido com avisos'
      )

      if (result.success) {
        // Success or partial success - close modal
        setOpen(false)
      }
    } catch (error) {
        toast.error('Erro ao remover o setor')
        setOpen(false)
    }
  }

  const handleUpdateClick = (setor: SetorDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/configuracoes/setores/update?setorId=${setor.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteSetorMutation.isPending}
        title='Remover Setor'
        description='Tem certeza que deseja remover este setor?'
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

