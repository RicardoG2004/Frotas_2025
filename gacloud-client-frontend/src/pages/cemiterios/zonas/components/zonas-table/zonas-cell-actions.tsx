import { useState } from 'react'
import { ZonaDTO } from '@/types/dtos/cemiterios/zonas.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteZona } from '../../queries/zonas-mutations'

interface CellActionProps {
  data: ZonaDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteZonaMutation = useDeleteZona()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteZonaMutation.mutateAsync(data.id || '')
      const result = handleApiResponse(
        response,
        'Zona removida com sucesso',
        'Erro ao remover a zona',
        'Zona removida com avisos'
      )

      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover a zona')
      setOpen(false)
    }
  }

  const handleUpdateClick = (zona: ZonaDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/cemiterios/configuracoes/zonas/update?zonaId=${zona.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteZonaMutation.isPending}
        title='Remover Zona'
        description='Tem certeza que deseja remover esta zona?'
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
