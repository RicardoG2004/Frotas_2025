import { useState } from 'react'
import FuncionalidadeUpdateForm from '@/pages/application/funcionalidades/components/funcionalidade-forms/funcionalidade-update-form'
import { useDeleteFuncionalidade } from '@/pages/application/funcionalidades/queries/funcionalidades-mutations'
import { FuncionalidadeDTO } from '@/types/dtos'
import { Edit, Trash } from 'lucide-react'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'

interface CellActionProps {
  data: FuncionalidadeDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedFuncionalidade, setSelectedFuncionalidade] =
    useState<FuncionalidadeDTO | null>(null)

  const deleteFuncionalidadeMutation = useDeleteFuncionalidade()

  const handleDeleteConfirm = async () => {
    try {
      await deleteFuncionalidadeMutation.mutateAsync(data.id || '')
      toast.success('Funcionalidade removida com sucesso')
    } catch (error) {
      toast.error('Erro ao remover a funcionalidade')
    } finally {
      setOpen(false)
    }
  }

  const handleUpdateClick = (funcionalidade: FuncionalidadeDTO) => {
    setSelectedFuncionalidade(funcionalidade)
    setIsUpdateModalOpen(true)
  }

  return (
    <>
      <EnhancedModal
        title='Atualizar Funcionalidade'
        description='Atualize os dados da funcionalidade'
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        size='lg'
      >
        {selectedFuncionalidade && (
          <FuncionalidadeUpdateForm
            modalClose={() => setIsUpdateModalOpen(false)}
            funcionalidadeId={selectedFuncionalidade.id || ''}
            initialData={{
              nome: selectedFuncionalidade.nome,
              descricao: selectedFuncionalidade.descricao,
              ativo: selectedFuncionalidade.ativo || true,
              moduloId: selectedFuncionalidade.moduloId || '',
            }}
          />
        )}
      </EnhancedModal>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteFuncionalidadeMutation.isPending}
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
