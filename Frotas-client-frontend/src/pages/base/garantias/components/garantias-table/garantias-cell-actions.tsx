import { useState } from 'react'
import { GarantiaDTO } from '@/types/dtos/base/garantias.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteGarantia } from '../../queries/garantias-mutations'

interface CellActionProps {
  data: GarantiaDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteGarantiaMutation = useDeleteGarantia()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteGarantiaMutation.mutateAsync(data.id || '')

      const result = handleApiResponse(
        response,
        'Garantia removida com sucesso',
        'Erro ao remover a garantia',
        'Garantia removida com avisos'
      )

      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover a garantia')
      setOpen(false)
    }
  }

  const handleUpdateClick = (garantia: GarantiaDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/configuracoes/garantias/update?garantiaId=${garantia.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteGarantiaMutation.isPending}
        title='Remover Garantia'
        description='Tem certeza que deseja remover esta garantia?'
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


