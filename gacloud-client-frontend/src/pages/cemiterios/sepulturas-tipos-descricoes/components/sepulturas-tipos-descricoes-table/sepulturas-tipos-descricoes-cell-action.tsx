import { useState } from 'react'
import { SepulturaTipoGeralDTO } from '@/types/dtos/cemiterios/sepulturas-tipos-geral.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteSepulturaTipoDescricao } from '../../queries/sepulturas-tipos-descricoes-mutations'

interface CellActionProps {
  data: SepulturaTipoGeralDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteSepulturaTipoDescricaoMutation = useDeleteSepulturaTipoDescricao()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteSepulturaTipoDescricaoMutation.mutateAsync(
        data.id || ''
      )
      const result = handleApiResponse(
        response,
        'Descrição de tipo de sepultura removida com sucesso',
        'Erro ao remover a descrição de tipo de sepultura',
        'Descrição de tipo de sepultura removida com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover a descrição de tipo de sepultura')
      setOpen(false)
    }
  }

  const handleUpdateClick = (sepulturaTipoDescricao: SepulturaTipoGeralDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/cemiterios/outros/tipos-descricoes/update?sepulturaTipoDescricaoId=${sepulturaTipoDescricao.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteSepulturaTipoDescricaoMutation.isPending}
        title='Remover Descrição de Tipo de Sepultura'
        description='Tem certeza que deseja remover esta descrição de tipo de sepultura?'
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
