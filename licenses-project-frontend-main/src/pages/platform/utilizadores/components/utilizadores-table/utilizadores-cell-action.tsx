import { useState } from 'react'
import { UtilizadorUpdateForm } from '@/pages/platform/utilizadores/components/utilizador-forms/utilizador-update-form'
import { useDeleteUtilizador } from '@/pages/platform/utilizadores/queries/utilizadores-mutations'
import { UtilizadorDTO } from '@/types/dtos'
import { Edit, Trash } from 'lucide-react'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'

interface CellActionProps {
  data: UtilizadorDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedUtilizador, setSelectedUtilizador] =
    useState<UtilizadorDTO | null>(null)

  const deleteUtilizadorMutation = useDeleteUtilizador()

  const handleDeleteConfirm = async () => {
    try {
      await deleteUtilizadorMutation.mutateAsync(data.id || '')
      toast.success('Utilizador removido com sucesso')
    } catch (error) {
      toast.error('Erro ao remover o utilizador')
    } finally {
      setOpen(false)
    }
  }

  const handleUpdateClick = (utilizador: UtilizadorDTO) => {
    console.log('Selected utilizador data:', utilizador)
    setSelectedUtilizador(utilizador)
    setIsUpdateModalOpen(true)
  }

  return (
    <>
      <EnhancedModal
        title='Atualizar Utilizador'
        description='Atualize os dados do utilizador'
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        size='xl'
      >
        {selectedUtilizador && (
          <UtilizadorUpdateForm
            modalClose={() => setIsUpdateModalOpen(false)}
            utilizadorId={selectedUtilizador.id || ''}
            initialData={{
              clienteId: selectedUtilizador.clienteId || '',
              email: selectedUtilizador.email,
              firstName: selectedUtilizador.firstName,
              lastName: selectedUtilizador.lastName,
              roleId: selectedUtilizador.roleId || '',
              isActive: Boolean(selectedUtilizador.isActive),
              perfilId: selectedUtilizador.perfisUtilizador?.[0] || '',
              licencaId: selectedUtilizador.licencaId || undefined,
            }}
          />
        )}
      </EnhancedModal>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteUtilizadorMutation.isPending}
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
