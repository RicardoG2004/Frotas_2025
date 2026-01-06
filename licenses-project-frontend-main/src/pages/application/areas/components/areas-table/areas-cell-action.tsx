import { useState } from 'react'
import AreaUpdateForm from '@/pages/application/areas/components/area-forms/area-update-form'
import { useDeleteArea } from '@/pages/application/areas/queries/areas-mutations'
import { AreaDTO } from '@/types/dtos'
import { Edit, Trash, AppWindow } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'

interface CellActionProps {
  data: AreaDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState<AreaDTO | null>(null)
  const navigate = useNavigate()

  const deleteAreaMutation = useDeleteArea()

  const handleDeleteConfirm = async () => {
    try {
      await deleteAreaMutation.mutateAsync(data.id || '')
      toast.success('Área removida com sucesso')
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao remover área'))
    } finally {
      setOpen(false)
    }
  }

  const handleUpdateClick = (area: AreaDTO) => {
    setSelectedArea(area)
    setIsUpdateModalOpen(true)
  }

  const handleViewApplications = (areaId: string) => {
    navigate(`/administracao/aplicacoes?areaId=${areaId}`)
  }

  return (
    <>
      <EnhancedModal
        title='Atualizar Área'
        description='Atualize os dados da área'
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        size='md'
      >
        {selectedArea && (
          <AreaUpdateForm
            modalClose={() => setIsUpdateModalOpen(false)}
            areaId={selectedArea.id || ''}
            initialData={{
              nome: selectedArea.nome,
              color: selectedArea.color,
              id: selectedArea.id || '',
            }}
          />
        )}
      </EnhancedModal>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteAreaMutation.isPending}
        title='Remover Área'
        description='Tem certeza que deseja remover esta área?'
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
          onClick={() => handleViewApplications(data.id || '')}
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <AppWindow className='h-4 w-4' />
          <span className='sr-only'>Ver Aplicações</span>
        </Button>
      </div>
    </>
  )
}
