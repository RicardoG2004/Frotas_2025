import { useState } from 'react'
import { SepulturaTipoDTO } from '@/types/dtos/cemiterios/sepulturas-tipos.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteSepulturaTipo } from '../../queries/sepulturas-tipos-mutations'

interface CellActionProps {
  data: SepulturaTipoDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteSepulturaTipoMutation = useDeleteSepulturaTipo()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteSepulturaTipoMutation.mutateAsync(
        data.id || ''
      )
      const result = handleApiResponse(
        response,
        'Tipo de sepultura removido com sucesso',
        'Erro ao remover o tipo de sepultura',
        'Tipo de sepultura removido com avisos'
      )

      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o tipo de sepultura')
      setOpen(false)
    }
  }

  const handleUpdateClick = (sepulturaTipo: SepulturaTipoDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/cemiterios/configuracoes/sepulturas/tipos/update?sepulturaTipoId=${sepulturaTipo.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteSepulturaTipoMutation.isPending}
        title='Remover Tipo de Sepultura'
        description='Tem certeza que deseja remover este tipo de sepultura?'
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
