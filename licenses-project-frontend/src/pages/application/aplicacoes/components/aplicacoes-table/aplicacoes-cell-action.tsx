import { useState } from 'react'
import AplicacaoUpdateForm from '@/pages/application/aplicacoes/components/aplicacao-forms/aplicacao-update-form'
import { useDeleteAplicacao } from '@/pages/application/aplicacoes/queries/aplicacoes-mutations'
import { AplicacaoDTO } from '@/types/dtos'
import { AppWindow, Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'

interface CellActionProps {
  data: AplicacaoDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedAplicacao, setSelectedAplicacao] =
    useState<AplicacaoDTO | null>(null)
  const navigate = useNavigate()

  const deleteAplicacaoMutation = useDeleteAplicacao()

  const handleDeleteConfirm = async () => {
    try {
      await deleteAplicacaoMutation.mutateAsync(data.id || '')
      toast.success('Aplicação removida com sucesso')
    } catch (error) {
      toast.error('Erro ao remover a aplicação')
    } finally {
      setOpen(false)
    }
  }

  const handleUpdateClick = (aplicacao: AplicacaoDTO) => {
    setSelectedAplicacao(aplicacao)
    setIsUpdateModalOpen(true)
  }

  const handleViewModulos = (aplicacaoId: string) => {
    navigate(`/administracao/modulos?aplicacaoId=${aplicacaoId}`)
  }

  return (
    <>
      <EnhancedModal
        title='Atualizar Aplicação'
        description='Atualize os dados da aplicação'
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        size='lg'
      >
        {selectedAplicacao && (
          <AplicacaoUpdateForm
            modalClose={() => setIsUpdateModalOpen(false)}
            aplicacaoId={selectedAplicacao.id || ''}
            initialData={{
              nome: selectedAplicacao.nome,
              descricao: selectedAplicacao.descricao,
              ativo: selectedAplicacao.ativo,
              areaId: selectedAplicacao.areaId,
              versao: selectedAplicacao.versao || '1',
            }}
          />
        )}
      </EnhancedModal>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteAplicacaoMutation.isPending}
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
          onClick={() => handleViewModulos(data.id || '')}
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <AppWindow className='h-4 w-4' />
          <span className='sr-only'>Ver Modulos</span>
        </Button>
      </div>
    </>
  )
}
