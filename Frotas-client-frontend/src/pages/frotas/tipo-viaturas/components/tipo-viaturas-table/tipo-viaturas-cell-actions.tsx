import { useState } from 'react'
import { TipoViaturaDTO } from '@/types/dtos/frotas/tipo-viaturas.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteTipoViatura } from '@/pages/frotas/tipo-viaturas/queries/tipo-viaturas-mutations'

interface CellActionProps {
  data: TipoViaturaDTO
}

export const TipoViaturasCellAction = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteTipoViaturaMutation = useDeleteTipoViatura()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteTipoViaturaMutation.mutateAsync(data.id)
      const result = handleApiResponse(
        response,
        'Tipo de viatura removido com sucesso',
        'Erro ao remover o tipo de viatura',
        'Tipo de viatura removido com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o tipo de viatura')
      setOpen(false)
    }
  }

  const handleUpdateClick = (tipoViatura: TipoViaturaDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/frotas/configuracoes/tipo-viaturas/update?tipoViaturaId=${tipoViatura.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteTipoViaturaMutation.isPending}
        title='Remover Tipo de Viatura'
        description='Tem certeza que deseja remover este tipo de viatura?'
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

