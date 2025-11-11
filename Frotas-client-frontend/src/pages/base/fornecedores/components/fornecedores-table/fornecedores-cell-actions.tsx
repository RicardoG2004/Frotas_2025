import { useState } from 'react'
import { FornecedorDTO } from '@/types/dtos/base/fornecedores.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteFornecedor } from '@/pages/base/fornecedores/queries/fornecedores-mutations'

interface CellActionProps {
  data: FornecedorDTO
}

export const CellAction = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteFornecedorMutation = useDeleteFornecedor()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteFornecedorMutation.mutateAsync(data.id || '')
      const result = handleApiResponse(
        response,
        'Fornecedor removido com sucesso',
        'Erro ao remover o fornecedor',
        'Fornecedor removido com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o fornecedor')
      setOpen(false)
    }
  }

  const handleUpdateClick = (fornecedor: FornecedorDTO) => {
    const instanceId = generateInstanceId()
    navigate(
        `/utilitarios/tabelas/configuracoes/fornecedores/update?fornecedorId=${fornecedor.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteFornecedorMutation.isPending}
        title='Remover Fornecedor'
        description='Tem certeza que deseja remover este fornecedor?'
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

