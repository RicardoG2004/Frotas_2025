import { useState } from 'react'
import { CategoriaDTO } from '@/types/dtos/frotas/categorias.dtos'
import { Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteCategoria } from '@/pages/frotas/categorias/queries/categorias-mutations'

interface CellActionProps {
  data: CategoriaDTO
}

export const CellAction = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteCategoriaMutation = useDeleteCategoria()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteCategoriaMutation.mutateAsync(data.id || '')
      const result = handleApiResponse(
        response,
        'Categoria removida com sucesso',
        'Erro ao remover a categoria',
        'Categoria removida com avisos'
      )
      if (result.success) {
        setOpen(false)
      }
    } catch (error) {
      toast.error('Erro ao remover a categoria')
      setOpen(false)
    }
  }

  const handleUpdateClick = (categoria: CategoriaDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/frotas/configuracoes/categorias/update?categoriaId=${categoria.id}&instanceId=${instanceId}`
    )
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteCategoriaMutation.isPending}
        title='Remover Categoria'
        description='Tem certeza que deseja remover esta categoria?'
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
