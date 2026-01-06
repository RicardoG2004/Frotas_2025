import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { getErrorMessage } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteMultipleUtilizadores } from '../../queries/utilizadores-mutations'
import { UtilizadorCreateForm } from '../utilizador-forms/utilizador-create-form'

interface UtilizadoresTableActionsProps {
  selectedRows?: string[]
  setSelectedRows?: (rows: string[]) => void
}

export default function UtilizadoresTableActions({
  selectedRows = [],
  setSelectedRows = () => {},
}: UtilizadoresTableActionsProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const deleteMultipleUtilizadores = useDeleteMultipleUtilizadores()

  const handleDeleteConfirm = async () => {
    try {
      const response =
        await deleteMultipleUtilizadores.mutateAsync(selectedRows)

      if (response.info.succeeded) {
        toast.success('Utilizadores removidos com sucesso')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao remover utilizadores'))
      }
    } catch (error) {
      toast.error('Erro ao remover utilizadores')
    } finally {
      // Always clear selection state regardless of success/failure
      setSelectedRows([])
      setOpen(false)
    }
  }

  return (
    <div className='flex items-center justify-between py-5'>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteMultipleUtilizadores.isPending}
      />
      <div className='flex flex-1 gap-4'>
        {/* <TableSearchInput placeholder="Procurar Aplicações..." /> */}
      </div>
      <div className='flex gap-3'>
        <Button
          variant='destructive'
          onClick={() => setOpen(true)}
          disabled={selectedRows.length === 0}
        >
          <Trash2 className='h-4 w-4' />
        </Button>
        <Button variant='emerald' onClick={() => setIsCreateModalOpen(true)}>
          <Plus className='mr-2 h-4 w-4' /> Adicionar
        </Button>

        <EnhancedModal
          title='Criar Novo Utilizador'
          description='Crie um novo utilizador'
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          size='xl'
        >
          <UtilizadorCreateForm
            modalClose={() => setIsCreateModalOpen(false)}
          />
        </EnhancedModal>
      </div>
    </div>
  )
}
