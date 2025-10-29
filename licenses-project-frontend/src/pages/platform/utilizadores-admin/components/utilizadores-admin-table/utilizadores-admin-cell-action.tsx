import { useState } from 'react'
import { UtilizadorAdminUpdateForm } from '@/pages/platform/utilizadores-admin/components/utilizador-admin-forms/utilizador-admin-update-form'
import { useDeleteUser } from '@/pages/platform/utilizadores-admin/queries/utilizadores-admin-mutations'
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

  const deleteUtilizadorMutation = useDeleteUser()

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
    console.log('Selected utilizador:', utilizador)
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
          <UtilizadorAdminUpdateForm
            modalClose={() => setIsUpdateModalOpen(false)}
            utilizadorId={selectedUtilizador.id ?? ''}
            initialData={{
              firstName: selectedUtilizador.firstName,
              lastName: selectedUtilizador.lastName,
              email: selectedUtilizador.email,
              roleId: selectedUtilizador.roleId,
              isActive: selectedUtilizador.isActive ?? false,
              perfilId: selectedUtilizador.perfisUtilizador?.[0],
              perfisUtilizador: selectedUtilizador.perfisUtilizador,
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
