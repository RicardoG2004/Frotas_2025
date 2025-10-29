import { useState } from 'react'
import { ConcelhoDTO } from '@/types/dtos/base/concelhos.dtos'
import { Map, Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteConcelho } from '../../queries/concelhos-mutations'

interface CellActionProps {
  data: ConcelhoDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteConcelhoMutation = useDeleteConcelho()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteConcelhoMutation.mutateAsync(data.id || '')

      const result = handleApiResponse(
        response,
        'Concelho removido com sucesso',
        'Erro ao remover o concelho',
        'Concelho removido com avisos'
      )

      if (result.success) {
        // Success or partial success - close modal
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o concelho')
      setOpen(false)
    }
  }

  const handleUpdateClick = (concelho: ConcelhoDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/geograficas/concelhos/update?concelhoId=${concelho.id}&instanceId=${instanceId}`
    )
  }

  const handleViewFreguesias = (concelho: string) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/geograficas/freguesias?instanceId=${instanceId}`,
      {
        state: {
          initialFilters: [{ id: 'concelho.nome', value: concelho }],
          instanceId,
        },
      }
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteConcelhoMutation.isPending}
        title='Remover Concelho'
        description='Tem certeza que deseja remover este concelho?'
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
        <Button
          onClick={() => handleViewFreguesias(data.nome || '')}
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <Map color='hsl(var(--primary))' className='h-4 w-4' />
          <span className='sr-only'>Ver Freguesias</span>
        </Button>
      </div>
    </>
  )
}
