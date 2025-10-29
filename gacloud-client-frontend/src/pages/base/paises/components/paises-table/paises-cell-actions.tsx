import { useState } from 'react'
import { PaisDTO } from '@/types/dtos/base/paises.dtos'
import { Edit, Map, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeletePais } from '../../queries/paises-mutations'

interface CellActionProps {
  data: PaisDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deletePaisMutation = useDeletePais()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deletePaisMutation.mutateAsync(data.id || '')

      const result = handleApiResponse(
        response,
        'País removido com sucesso',
        'Erro ao remover o país',
        'País removido com avisos'
      )

      if (result.success) {
        // Success or partial success - close modal
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o país')
      setOpen(false)
    }
  }

  const handleUpdateClick = (pais: PaisDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/geograficas/paises/update?paisId=${pais.id}&instanceId=${instanceId}`
    )
  }

  const handleViewDistritos = (paisId: string) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/geograficas/distritos?instanceId=${instanceId}`,
      {
        state: {
          initialFilters: [{ id: 'paisId', value: paisId }],
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
        loading={deletePaisMutation.isPending}
        title='Remover País'
        description='Tem certeza que deseja remover este país?'
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
          onClick={() => handleViewDistritos(data.id || '')}
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <Map color='hsl(var(--primary))' className='h-4 w-4' />
          <span className='sr-only'>Ver Distritos</span>
        </Button>
      </div>
    </>
  )
}
