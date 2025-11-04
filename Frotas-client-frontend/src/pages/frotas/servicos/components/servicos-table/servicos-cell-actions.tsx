import { useState } from 'react'
import { ServicoDTO } from '@/types/dtos/frotas/servicos.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteServico } from '../../queries/servicos-mutations'

interface CellActionProps {
  data: ServicoDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteServicoMutation = useDeleteServico()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteServicoMutation.mutateAsync(
        data.id || ''
      )
      const result = handleApiResponse(
        response,
        'Serviço removido com sucesso',
        'Erro ao remover o serviço',
        'Serviço removido com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover o serviço')
      setOpen(false)
    }
  }

  const handleUpdateClick = (servico: ServicoDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/frotas/configuracoes/servicos/update?servicoId=${servico.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteServicoMutation.isPending}
        title='Remover Serviço'
        description='Tem certeza que deseja remover este serviço?'
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

