import { useState } from 'react'
import { DefuntoTipoDTO } from '@/types/dtos/cemiterios/defuntos-tipos.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteDefuntoTipo } from '../../queries/defuntos-tipos-mutations'

interface CellActionProps {
  data: DefuntoTipoDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteDefuntoTipoMutation = useDeleteDefuntoTipo()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteDefuntoTipoMutation.mutateAsync(data.id)
      const result = handleApiResponse(
        response,
        'Tipo de defunto removido com sucesso',
        'Erro ao remover o tipo de defunto',
        'Tipo de defunto removido com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o tipo de defunto')
      setOpen(false)
    }
  }

  const handleUpdateClick = (defuntoTipo: DefuntoTipoDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/cemiterios/configuracoes/defuntos/tipos/update?defuntoTipoId=${defuntoTipo.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteDefuntoTipoMutation.isPending}
        title='Remover Tipo de Defunto'
        description='Tem certeza que deseja remover este tipo de defunto?'
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
