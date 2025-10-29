import { useState } from 'react'
import LicencaBlockDetailsForm from '@/pages/platform/licencas/components/licenca-forms/licenca-block-details-form'
import LicencaBlockForm from '@/pages/platform/licencas/components/licenca-forms/licenca-block-form'
import LicencaModulosForm from '@/pages/platform/licencas/components/licenca-forms/licenca-modulos-form'
import LicencaUpdateForm from '@/pages/platform/licencas/components/licenca-forms/licenca-update-form'
import {
  useDeleteLicenca,
  useRegenerateLicencaApiKey,
} from '@/pages/platform/licencas/queries/licencas-mutations'
import { LicencaDTO } from '@/types/dtos'
import { Edit, Lock, Unlock, Trash, ListTree, Key } from 'lucide-react'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'

interface CellActionProps {
  data: LicencaDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false)
  const [isBlockDetailsModalOpen, setIsBlockDetailsModalOpen] = useState(false)
  const [isModulosModalOpen, setIsModulosModalOpen] = useState(false)
  const [selectedLicenca, setSelectedLicenca] = useState<LicencaDTO | null>(
    null
  )
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false)

  const deleteLicencaMutation = useDeleteLicenca()
  const regenerateApiKey = useRegenerateLicencaApiKey()

  const handleDeleteConfirm = async () => {
    try {
      await deleteLicencaMutation.mutateAsync(data.id || '')
      toast.success('Licença removida com sucesso')
    } catch (error) {
      toast.error('Erro ao remover a licença')
    } finally {
      setOpen(false)
    }
  }

  const handleUpdateClick = (licenca: LicencaDTO) => {
    setSelectedLicenca(licenca)
    setIsUpdateModalOpen(true)
  }

  const handleRegenerateApiKey = async () => {
    try {
      const response = await regenerateApiKey.mutateAsync(data.id || '')
      if (response.info.succeeded) {
        toast.success('API key regenerada com sucesso')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao regenerar API key'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao regenerar API key'))
    }
  }

  return (
    <>
      <EnhancedModal
        title='Atualizar Licença'
        description='Atualize os dados da licença'
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        size='xl'
      >
        {selectedLicenca && (
          <LicencaUpdateForm
            modalClose={() => setIsUpdateModalOpen(false)}
            licencaId={selectedLicenca.id || ''}
            initialData={{
              nome: selectedLicenca.nome,
              dataInicio: selectedLicenca.dataInicio,
              dataFim: selectedLicenca.dataFim,
              numeroUtilizadores: selectedLicenca.numeroUtilizadores,
              ativo: selectedLicenca.ativo || false,
              aplicacaoId: selectedLicenca.aplicacaoId,
              clienteId: selectedLicenca.clienteId,
            }}
          />
        )}
      </EnhancedModal>

      <EnhancedModal
        title='Bloquear Licença'
        description='Informe o motivo do bloqueio'
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        size='md'
      >
        <LicencaBlockForm
          licencaId={data.id || ''}
          modalClose={() => setIsBlockModalOpen(false)}
        />
      </EnhancedModal>

      <EnhancedModal
        title='Detalhes do Bloqueio'
        description='Informações sobre o bloqueio da licença'
        isOpen={isBlockDetailsModalOpen}
        onClose={() => setIsBlockDetailsModalOpen(false)}
        size='md'
      >
        <LicencaBlockDetailsForm
          licencaId={data.id || ''}
          dataBloqueio={data.dataBloqueio}
          motivoBloqueio={data.motivoBloqueio}
          modalClose={() => setIsBlockDetailsModalOpen(false)}
        />
      </EnhancedModal>

      <EnhancedModal
        title='Módulos e Funcionalidades'
        description='Selecione os módulos e funcionalidades para esta licença'
        isOpen={isModulosModalOpen}
        onClose={() => setIsModulosModalOpen(false)}
        size='xl'
      >
        <LicencaModulosForm
          licencaId={data.id || ''}
          aplicacaoId={data.aplicacaoId}
          modalClose={() => setIsModulosModalOpen(false)}
        />
      </EnhancedModal>

      <EnhancedModal
        title='API Key'
        description='Chave de API para esta licença'
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        size='md'
      >
        <div className='space-y-4'>
          <div className='rounded-lg border p-4 bg-muted'>
            <p className='font-mono text-sm break-all'>
              {data.apiKey || 'Nenhuma API key disponível'}
            </p>
          </div>
          <div className='flex justify-end gap-2'>
            <Button
              variant='outline'
              onClick={() => setIsApiKeyModalOpen(false)}
            >
              Fechar
            </Button>
            <Button
              onClick={handleRegenerateApiKey}
              disabled={regenerateApiKey.isPending}
            >
              {regenerateApiKey.isPending ? 'A gerar...' : 'Gerar'}
            </Button>
          </div>
        </div>
      </EnhancedModal>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLicencaMutation.isPending}
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
        {data.bloqueada ? (
          <Button
            onClick={() => setIsBlockDetailsModalOpen(true)}
            variant='ghost'
            className='h-8 w-8 p-0'
          >
            <Unlock color='hsl(var(--emerald))' className='h-4 w-4' />
            <span className='sr-only'>Ver Detalhes do Bloqueio</span>
          </Button>
        ) : (
          <Button
            onClick={() => setIsBlockModalOpen(true)}
            variant='ghost'
            className='h-8 w-8 p-0'
          >
            <Lock color='hsl(var(--destructive))' className='h-4 w-4' />
            <span className='sr-only'>Bloquear</span>
          </Button>
        )}
        <Button
          onClick={() => setIsModulosModalOpen(true)}
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <ListTree color='hsl(var(--primary))' className='h-4 w-4' />
          <span className='sr-only'>Módulos e Funcionalidades</span>
        </Button>
        <Button
          onClick={() => setIsApiKeyModalOpen(true)}
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <Key color='hsl(var(--primary))' className='h-4 w-4' />
          <span className='sr-only'>API Key</span>
        </Button>
      </div>
    </>
  )
}
