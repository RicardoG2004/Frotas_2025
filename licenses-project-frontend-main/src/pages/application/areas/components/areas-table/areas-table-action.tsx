import { useState } from 'react'
import AreaCreateForm from '@/pages/application/areas/components/area-forms/area-create-form'
import { Plus, Trash2 } from 'lucide-react'
import { getErrorMessage } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteMultipleAreas } from '../../queries/areas-mutations'

interface AreasTableActionsProps {
  selectedRows?: string[]
  setSelectedRows?: (rows: string[]) => void
}

export default function AreasTableActions({
  selectedRows = [],
  setSelectedRows,
}: AreasTableActionsProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const deleteMultipleAreasMutation = useDeleteMultipleAreas()

  const handleDeleteMultiple = async () => {
    try {
      const response =
        await deleteMultipleAreasMutation.mutateAsync(selectedRows)

      if (response.info.succeeded) {
        toast.success('Áreas removidas com sucesso')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao remover áreas'))
      }
    } catch (error) {
      toast.error('Erro ao remover áreas')
    } finally {
      setSelectedRows?.([])
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <div className='flex items-center justify-between py-5'>
      <div className='flex flex-1 gap-4'>
        {selectedRows.length > 0 && (
          <Button
            variant='destructive'
            onClick={() => setIsDeleteModalOpen(true)}
            className='gap-2'
          >
            <Trash2 className='h-4 w-4' />
            Excluir Selecionados ({selectedRows.length})
          </Button>
        )}
      </div>
      <div className='flex gap-3'>
        <Button variant='emerald' onClick={() => setIsCreateModalOpen(true)}>
          <Plus className='mr-2 h-4 w-4' /> Adicionar
        </Button>
      </div>

      <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteMultiple}
        loading={deleteMultipleAreasMutation.isPending}
        title='Remover Áreas'
        description='Tem certeza que deseja remover as áreas selecionadas?'
      />

      <EnhancedModal
        title='Criar Nova Área'
        description='Crie uma nova área para atribuir nas aplicações'
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        size='md'
      >
        <AreaCreateForm modalClose={() => setIsCreateModalOpen(false)} />
      </EnhancedModal>
    </div>
  )
}
