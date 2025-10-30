import { useState } from 'react'
import { CodigoPostalDTO } from '@/types/dtos/base/codigospostais.dtos'
import { Map, Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteCodigoPostal } from '../../queries/codigospostais-mutations'

interface CellActionProps {
  data: CodigoPostalDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteCodigoPostalMutation = useDeleteCodigoPostal()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteCodigoPostalMutation.mutateAsync(
        data.id || ''
      )

      const result = handleApiResponse(
        response,
        'Código Postal removido com sucesso',
        'Erro ao remover o código postal',
        'Código Postal removido com avisos'
      )

      if (result.success) {
        // Success or partial success - close modal
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o código postal')
      setOpen(false)
    }
  }

  const handleUpdateClick = (codigopostal: CodigoPostalDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/geograficas/codigospostais/update?codigoPostalId=${codigopostal.id}&instanceId=${instanceId}`
    )
  }

  const handleViewRuas = (codigoPostal: string) => {
    const instanceId = generateInstanceId()
    navigate(`/utilitarios/tabelas/geograficas/ruas?instanceId=${instanceId}`, {
      state: {
        initialFilters: [{ id: 'codigoPostal.codigo', value: codigoPostal }],
        instanceId,
      },
    })
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteCodigoPostalMutation.isPending}
        title='Remover Código Postal'
        description='Tem certeza que deseja remover este código postal?'
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
          onClick={() => handleViewRuas(data.codigo || '')}
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <Map color='hsl(var(--primary))' className='h-4 w-4' />
          <span className='sr-only'>Ver Ruas</span>
        </Button>
      </div>
    </>
  )
}
