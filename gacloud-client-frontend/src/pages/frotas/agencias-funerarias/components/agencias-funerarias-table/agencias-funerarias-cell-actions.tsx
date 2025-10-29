import { useState } from 'react'
import { AgenciaFunerariaDTO } from '@/types/dtos/frotas/agencias-funerarias.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteAgenciaFuneraria } from '../../queries/agencias-funerarias-mutations'

interface CellActionProps {
  data: AgenciaFunerariaDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteAgenciaFunerariaMutation = useDeleteAgenciaFuneraria()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteAgenciaFunerariaMutation.mutateAsync(
        data.id || ''
      )
      const result = handleApiResponse(
        response,
        'Agência funerária removida com sucesso',
        'Erro ao remover a agência funerária',
        'Agência funerária removida com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover a agência funerária')
      setOpen(false)
    }
  }

  const handleUpdateClick = (agenciaFuneraria: AgenciaFunerariaDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/frotas/configuracoes/agencias-funerarias/update?agenciaFunerariaId=${agenciaFuneraria.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteAgenciaFunerariaMutation.isPending}
        title='Remover Agência Funerária'
        description='Tem certeza que deseja remover esta agência funerária?'
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
