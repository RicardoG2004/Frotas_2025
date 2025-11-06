import { useState } from 'react'
import { DelegacaoDTO } from '@/types/dtos/base/delegacoes.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteDelegacao } from '../../queries/delegacoes-mutations'

interface CellActionProps {
  data: DelegacaoDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteDelegacaoMutation = useDeleteDelegacao()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteDelegacaoMutation.mutateAsync(data.id || '')

      const result = handleApiResponse(
        response,
        'Delegação removida com sucesso',
        'Erro ao remover a delegação',
        'Delegação removida com avisos'
      )

      if (result.success) {
        // Success or partial success - close modal
        setOpen(false)
      }
    } catch (error) {
        toast.error('Erro ao remover a delegação')
        setOpen(false)
    }
  }

  const handleUpdateClick = (delegacao: DelegacaoDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/configuracoes/delegacoes/update?delegacaoId=${delegacao.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteDelegacaoMutation.isPending}
        title='Remover Delegação'
        description='Tem certeza que deseja remover esta delegação?'
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

