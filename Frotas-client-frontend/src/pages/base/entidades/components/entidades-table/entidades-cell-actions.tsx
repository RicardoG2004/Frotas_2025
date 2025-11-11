import { useState } from 'react'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { EntidadeDTO } from '@/types/dtos/base/entidades.dtos'
import { useDeleteEntidade } from '@/pages/base/entidades/queries/entidades-mutations'

interface CellActionProps {
  data: EntidadeDTO
}

export const CellAction = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteEntidadeMutation = useDeleteEntidade()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteEntidadeMutation.mutateAsync(data.id)
      const result = handleApiResponse(
        response,
        'Entidade removida com sucesso',
        'Erro ao remover a entidade',
        'Entidade removida com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro ao remover a entidade')
      setOpen(false)
    }
  }

  const handleUpdateClick = (entidade: EntidadeDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/configuracoes/entidades/update?entidadeId=${entidade.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteEntidadeMutation.isPending}
        title='Remover Entidade'
        description='Tem certeza que deseja remover esta entidade?'
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


