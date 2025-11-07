import { useState } from 'react'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LocalizacaoDTO } from '@/types/dtos/base/localizacoes.dtos'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteLocalizacao } from '../../queries/localizacoes-mutations'

interface CellActionProps {
  data: LocalizacaoDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteLocalizacaoMutation = useDeleteLocalizacao()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteLocalizacaoMutation.mutateAsync(data.id)

      const result = handleApiResponse(
        response,
        'Localização removida com sucesso',
        'Erro ao remover a localização',
        'Localização removida com avisos'
      )

      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover a localização')
      setOpen(false)
    }
  }

  const handleUpdateClick = (localizacao: LocalizacaoDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/geograficas/localizacoes/update?localizacaoId=${localizacao.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLocalizacaoMutation.isPending}
        title='Remover Localização'
        description='Tem certeza que deseja remover esta localização?'
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

