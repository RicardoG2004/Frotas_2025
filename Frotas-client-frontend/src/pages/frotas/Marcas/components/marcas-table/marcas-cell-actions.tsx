import { useState } from 'react'
import { MarcaDTO } from '@/types/dtos/frotas/marcas.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteMarca } from '@/pages/frotas/Marcas/queries/marcas-mutations'

interface CellActionProps {
  data: MarcaDTO
}

export const CellAction = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteMarcaMutation = useDeleteMarca()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteMarcaMutation.mutateAsync(data.id || '')
      const result = handleApiResponse(
        response,
        'Marca removida com sucesso',
        'Erro ao remover a marca',
        'Marca removida com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover a marca')
      setOpen(false)
    }
  }

  const handleUpdateClick = (marca: MarcaDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/frotas/configuracoes/marcas/update?marcaId=${marca.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteMarcaMutation.isPending}
        title='Remover Marca'
        description='Tem certeza que deseja remover esta marca?'
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
