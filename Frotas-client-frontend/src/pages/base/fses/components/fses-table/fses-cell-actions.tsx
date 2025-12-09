import { useState } from 'react'
import { FseDTO } from '@/types/dtos/base/fses.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteFse } from '@/pages/base/fses/queries/fses-mutations'

interface CellActionProps {
  data: FseDTO
}

export const CellAction = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteFseMutation = useDeleteFse()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteFseMutation.mutateAsync(data.id || '')
      const result = handleApiResponse(
        response,
        'Fornecedor Serviços Externos removido com sucesso',
        'Erro ao remover o fornecedor serviços externos',
        'Fornecedor Serviços Externos removido com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o fornecedor serviços externos')
      setOpen(false)
    }
  }

  const handleUpdateClick = (fse: FseDTO) => {
    const instanceId = generateInstanceId()
    navigate(
        `/utilitarios/tabelas/configuracoes/fses/update?fseId=${fse.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteFseMutation.isPending}
        title='Remover Fornecedor Serviços Externos'
        description='Tem certeza que deseja remover este fornecedor serviços externos?'
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

