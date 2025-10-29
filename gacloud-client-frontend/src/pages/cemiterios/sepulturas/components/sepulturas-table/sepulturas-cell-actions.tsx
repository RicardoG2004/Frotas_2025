import { useState } from 'react'
import { SepulturaDTO } from '@/types/dtos/cemiterios/sepulturas.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteSepultura } from '../../queries/sepulturas-mutations'

interface CellActionProps {
  data: SepulturaDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteSepulturaMutation = useDeleteSepultura()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteSepulturaMutation.mutateAsync(data.id || '')
      const result = handleApiResponse(
        response,
        'Sepultura removida com sucesso',
        'Erro ao remover a sepultura',
        'Sepultura removida com avisos'
      )

      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover a sepultura')
      setOpen(false)
    }
  }

  const handleUpdateClick = (sepultura: SepulturaDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/cemiterios/configuracoes/sepulturas/update?sepulturaId=${sepultura.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteSepulturaMutation.isPending}
        title='Remover Sepultura'
        description='Tem certeza que deseja remover esta sepultura?'
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
