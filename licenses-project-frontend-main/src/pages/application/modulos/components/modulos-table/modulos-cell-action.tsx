import { useState } from 'react'
import ModuloUpdateForm from '@/pages/application/modulos/components/modulo-forms/modulo-update-form'
import { useDeleteModulo } from '@/pages/application/modulos/queries/modulos-mutations'
import { ModuloDTO } from '@/types/dtos'
import { AppWindow, Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'

interface CellActionProps {
  data: ModuloDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedModulo, setSelectedModulo] = useState<ModuloDTO | null>(null)
  const navigate = useNavigate()

  const deleteModuloMutation = useDeleteModulo()

  const handleDeleteConfirm = async () => {
    try {
      await deleteModuloMutation.mutateAsync(data.id || '')
      toast.success('Módulo removido com sucesso')
    } catch (error) {
      toast.error('Erro ao remover o módulo')
    } finally {
      setOpen(false)
    }
  }

  const handleUpdateClick = (modulo: ModuloDTO) => {
    setSelectedModulo(modulo)
    setIsUpdateModalOpen(true)
  }

  const handleViewFuncionalidades = (moduloId: string) => {
    navigate(`/administracao/funcionalidades?moduloId=${moduloId}`)
  }

  return (
    <>
      <EnhancedModal
        title='Atualizar Módulo'
        description='Atualize os dados do módulo'
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        size='lg'
      >
        {selectedModulo && (
          <ModuloUpdateForm
            modalClose={() => setIsUpdateModalOpen(false)}
            moduloId={selectedModulo.id || ''}
            initialData={{
              nome: selectedModulo.nome,
              descricao: selectedModulo.descricao,
              ativo: selectedModulo.ativo || true,
              aplicacaoId: selectedModulo.aplicacaoId || '',
            }}
          />
        )}
      </EnhancedModal>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteModuloMutation.isPending}
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
        <Button
          onClick={() => handleViewFuncionalidades(data.id || '')}
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <AppWindow className='h-4 w-4' />
          <span className='sr-only'>Ver Funcionalidades</span>
        </Button>
      </div>
    </>
  )
}
