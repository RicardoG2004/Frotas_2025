import { useState } from 'react'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { TerceiroDTO } from '@/types/dtos/base/terceiros.dtos'
import { useDeleteTerceiro } from '../../queries/terceiros-mutations'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'

interface CellActionProps {
  data: TerceiroDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteTerceiroMutation = useDeleteTerceiro()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteTerceiroMutation.mutateAsync(data.id || '')

      const result = handleApiResponse(
        response,
        'Outros Devedores/Credores removido com sucesso',
        'Erro ao remover Outros Devedores/Credores',
        'Outros Devedores/Credores removido com avisos'
      )

      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover Outros Devedores/Credores')
      setOpen(false)
    }
  }

  const handleUpdateClick = (terceiro: TerceiroDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/configuracoes/terceiros/update?terceiroId=${terceiro.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteTerceiroMutation.isPending}
        title='Remover Outros Devedores/Credores'
        description='Tem certeza que deseja remover este registo?'
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


