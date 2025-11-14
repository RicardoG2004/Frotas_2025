import { useState } from 'react'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { CargoDTO } from '@/types/dtos/base/cargos.dtos'
import { useDeleteCargo } from '@/pages/base/cargos/queries/cargos-mutations'

interface CellActionProps {
  data: CargoDTO
}

export const CellAction = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const deleteCargoMutation = useDeleteCargo()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteCargoMutation.mutateAsync(data.id)
      const result = handleApiResponse(
        response,
        'Cargo removido com sucesso',
        'Erro ao remover o cargo',
        'Cargo removido com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro ao remover o cargo')
      setOpen(false)
    }
  }

  const handleUpdateClick = (cargo: CargoDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/configuracoes/cargos/update?cargoId=${cargo.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteCargoMutation.isPending}
        title='Remover Cargo'
        description='Tem certeza que deseja remover este cargo?'
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


