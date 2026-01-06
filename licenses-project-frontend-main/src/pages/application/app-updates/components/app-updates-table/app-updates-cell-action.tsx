import { useState } from 'react'
import AppUpdateDetailsView from '@/pages/application/app-updates/components/app-update-details-view'
import AppUpdateUpdateForm from '@/pages/application/app-updates/components/app-update-forms/app-update-update-form'
import UploadUpdatePackageDialog from '@/pages/application/app-updates/components/upload-update-package-dialog'
import { useDeleteAppUpdate } from '@/pages/application/app-updates/queries/app-updates-mutations'
import { AppUpdateDTO } from '@/types/dtos'
import { Edit, Trash, Upload, Eye } from 'lucide-react'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'

interface CellActionProps {
  data: AppUpdateDTO
  aplicacaoId: string
}

export const CellAction: React.FC<CellActionProps> = ({
  data,
  aplicacaoId,
}) => {
  const [open, setOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedUpdate, setSelectedUpdate] = useState<AppUpdateDTO | null>(
    null
  )

  const deleteUpdateMutation = useDeleteAppUpdate()

  const handleDeleteConfirm = async () => {
    try {
      await deleteUpdateMutation.mutateAsync({
        id: data.id,
        aplicacaoId: data.aplicacaoId,
      })
      toast.success('Atualização removida com sucesso')
    } catch (error) {
      toast.error('Erro ao remover a atualização')
    } finally {
      setOpen(false)
    }
  }

  const handleUpdateClick = (update: AppUpdateDTO) => {
    setSelectedUpdate(update)
    setIsUpdateModalOpen(true)
  }

  const handleUploadClick = (update: AppUpdateDTO) => {
    setSelectedUpdate(update)
    setIsUploadModalOpen(true)
  }

  const handleViewDetails = (update: AppUpdateDTO) => {
    setSelectedUpdate(update)
    setIsDetailsModalOpen(true)
  }

  return (
    <>
      <EnhancedModal
        title='Atualizar Atualização'
        description='Atualize os dados da atualização'
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        size='xl'
      >
        {selectedUpdate && (
          <AppUpdateUpdateForm
            modalClose={() => setIsUpdateModalOpen(false)}
            updateId={selectedUpdate.id}
            aplicacaoId={aplicacaoId}
            initialData={{
              versao: selectedUpdate.versao,
              descricao: selectedUpdate.descricao,
              dataLancamento: selectedUpdate.dataLancamento,
              ativo: selectedUpdate.ativo,
              versaoMinima: selectedUpdate.versaoMinima,
              tipoUpdate: selectedUpdate.tipoUpdate,
              notasAtualizacao: selectedUpdate.notasAtualizacao,
              clienteIds: selectedUpdate.clienteIds,
            }}
          />
        )}
      </EnhancedModal>

      <EnhancedModal
        title='Carregar Pacote de Atualização'
        description='Carregue o ficheiro ZIP com os ficheiros de atualização'
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        size='lg'
      >
        {selectedUpdate && (
          <UploadUpdatePackageDialog
            updateId={selectedUpdate.id}
            updateVersion={selectedUpdate.versao}
            tipoUpdate={selectedUpdate.tipoUpdate}
            aplicacaoId={aplicacaoId}
            update={selectedUpdate}
            modalClose={() => setIsUploadModalOpen(false)}
          />
        )}
      </EnhancedModal>

      <EnhancedModal
        title='Detalhes da Atualização'
        description='Informações detalhadas da atualização'
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        size='xl'
      >
        {selectedUpdate && <AppUpdateDetailsView update={selectedUpdate} />}
      </EnhancedModal>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteUpdateMutation.isPending}
      />

      <div className='flex items-center gap-2'>
        <Button
          onClick={() => handleViewDetails(data)}
          variant='ghost'
          className='h-8 w-8 p-0'
          title='Ver detalhes'
        >
          <Eye className='h-4 w-4' />
          <span className='sr-only'>Ver detalhes</span>
        </Button>
        <Button
          onClick={() => handleUpdateClick(data)}
          variant='ghost'
          className='h-8 w-8 p-0'
          title='Editar'
        >
          <Edit color='hsl(var(--primary))' className='h-4 w-4' />
          <span className='sr-only'>Editar</span>
        </Button>
        <Button
          onClick={() => handleUploadClick(data)}
          variant='ghost'
          className='h-8 w-8 p-0'
          title='Carregar ficheiro'
          disabled={!data.id}
        >
          <Upload color='hsl(var(--primary))' className='h-4 w-4' />
          <span className='sr-only'>Carregar ficheiro</span>
        </Button>
        <Button
          onClick={() => setOpen(true)}
          variant='ghost'
          className='h-8 w-8 p-0'
          title='Eliminar'
        >
          <Trash color='hsl(var(--destructive))' className='h-4 w-4' />
          <span className='sr-only'>Eliminar</span>
        </Button>
      </div>
    </>
  )
}
