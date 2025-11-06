import { useState } from 'react'
import { ConservatoriaDTO } from '@/types/dtos/base/conservatorias.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteConservatoria } from '../../../conservatorias/queries/conservatorias-mutations'
import { ResponseApi } from '@/types/responses'
import { GSGenericResponse } from '@/types/api/responses'

interface CellActionProps {
  data: ConservatoriaDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteConservatoriaMutation = useDeleteConservatoria()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteConservatoriaMutation.mutateAsync(data.id || '') as ResponseApi<GSGenericResponse>

      const result = handleApiResponse(
        response,
        'Conservatória removida com sucesso',
        'Erro ao remover a conservatória',
        'Conservatória removida com avisos'
      )

      if (result.success) {
        // Success or partial success - close modal
        setOpen(false)
      }
    } catch (error) {
        toast.error('Erro ao remover a conservatória')
        setOpen(false)
    }
  }

  const handleUpdateClick = (conservatoria: ConservatoriaDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/configuracoes/conservatorias/update?conservatoriaId=${conservatoria.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteConservatoriaMutation.isPending}
        title='Remover Conservatória'
        description='Tem certeza que deseja remover esta conservatória?'
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

