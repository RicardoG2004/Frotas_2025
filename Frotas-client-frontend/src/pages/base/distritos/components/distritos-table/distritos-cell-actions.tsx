import { useState } from 'react'
import { DistritoDTO } from '@/types/dtos/base/distritos.dtos'
import { Map, Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteDistrito } from '../../queries/distritos-mutations'

interface CellActionProps {
  data: DistritoDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteDistritoMutation = useDeleteDistrito()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteDistritoMutation.mutateAsync(data.id || '')

      const result = handleApiResponse(
        response,
        'Distrito removido com sucesso',
        'Erro ao remover o distrito',
        'Distrito removido com avisos'
      )

      if (result.success) {
        // Success or partial success - close modal
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o distrito')
      setOpen(false)
    }
  }

  const handleUpdateClick = (distrito: DistritoDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/geograficas/distritos/update?distritoId=${distrito.id}&instanceId=${instanceId}`
    )
  }

  const handleViewConcelhos = (distrito: string) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/geograficas/concelhos?instanceId=${instanceId}`,
      {
        state: {
          initialFilters: [{ id: 'distrito.nome', value: distrito }],
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
        loading={deleteDistritoMutation.isPending}
        title='Remover Distrito'
        description='Tem certeza que deseja remover este distrito?'
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
          onClick={() => handleViewConcelhos(data.nome || '')}
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <Map color='hsl(var(--primary))' className='h-4 w-4' />
          <span className='sr-only'>Ver Concelhos</span>
        </Button>
      </div>
    </>
  )
}
