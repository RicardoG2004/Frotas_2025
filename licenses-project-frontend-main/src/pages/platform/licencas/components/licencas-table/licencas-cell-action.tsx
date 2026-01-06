import { useState } from 'react'
import LicencaBlockDetailsForm from '@/pages/platform/licencas/components/licenca-forms/licenca-block-details-form'
import LicencaBlockForm from '@/pages/platform/licencas/components/licenca-forms/licenca-block-form'
import LicencaModulosForm from '@/pages/platform/licencas/components/licenca-forms/licenca-modulos-form'
import LicencaUpdateForm from '@/pages/platform/licencas/components/licenca-forms/licenca-update-form'
import {
  useDeleteLicenca,
  useRegenerateLicencaApiKey,
  useDownloadUpdaterConfig,
  useDownloadFrontendConfig,
  useDownloadApiConfig,
} from '@/pages/platform/licencas/queries/licencas-mutations'
import { LicencaDTO } from '@/types/dtos'
import {
  Edit,
  Lock,
  Unlock,
  Trash,
  ListTree,
  Key,
  Download,
  ChevronDown,
} from 'lucide-react'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  const downloadUpdaterConfigMutation = useDownloadUpdaterConfig()
  const downloadFrontendConfigMutation = useDownloadFrontendConfig()
  const downloadApiConfigMutation = useDownloadApiConfig()

  // Check if the application belongs to "Gestão Interna" area
  const isInternalArea = data.aplicacao?.area?.nome === 'Gestão Interna'

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteLicencaMutation.mutateAsync(data.id || '')
      if (response.info.succeeded) {
        toast.success('Licença removida com sucesso')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao remover a licença'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao remover a licença'))
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

  const handleDownloadUpdaterConfig = async () => {
    if (!data.id) {
      toast.error('Licença não possui ID válido')
      return
    }

    try {
      // API handles all the logic: expansion for updater licenses, config generation, etc.
      const { blob, filename } =
        await downloadUpdaterConfigMutation.mutateAsync([data.id])

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)

      toast.success('Configuração do atualizador descarregada com sucesso')
    } catch (error) {
      toast.error(
        handleApiError(error, 'Erro ao descarregar configuração do atualizador')
      )
    }
  }

  const handleDownloadFrontendConfigClick = async () => {
    if (!data.id) {
      toast.error('Licença não possui ID válido')
      return
    }

    try {
      // API handles all the logic: config generation, etc.
      const { blob, filename } =
        await downloadFrontendConfigMutation.mutateAsync(data.id)

      // Validate blob and filename
      if (!blob || blob.size === 0) {
        toast.error('O ficheiro recebido está vazio')
        return
      }

      if (!filename) {
        toast.error('Nome do ficheiro não disponível')
        return
      }

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()

      // Small delay before cleanup to ensure download starts
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)
      }, 100)

      toast.success('Configuração do frontend descarregada com sucesso')
    } catch (error) {
      toast.error(
        handleApiError(error, 'Erro ao descarregar configuração do frontend')
      )
    }
  }

  const handleDownloadApiConfig = async () => {
    if (!data.id) {
      toast.error('Licença não possui ID válido')
      return
    }

    try {
      // API handles all the logic: config generation, etc.
      const { blob, filename } = await downloadApiConfigMutation.mutateAsync(
        data.id
      )

      // Validate blob and filename
      if (!blob || blob.size === 0) {
        toast.error('O ficheiro recebido está vazio')
        return
      }

      if (!filename) {
        toast.error('Nome do ficheiro não disponível')
        return
      }

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()

      // Small delay before cleanup to ensure download starts
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(link)
      }, 100)

      toast.success('Configuração da API descarregada com sucesso')
    } catch (error) {
      toast.error(
        handleApiError(error, 'Erro ao descarregar configuração da API')
      )
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
              versaoInstalada: selectedLicenca.versaoInstalada,
              versaoAplicacao: selectedLicenca.aplicacao?.versao,
              useOwnUpdater: selectedLicenca.useOwnUpdater,
              frontendPath: selectedLicenca.frontendPath,
              apiPath: selectedLicenca.apiPath,
              apiPoolName: selectedLicenca.apiPoolName,
              frontendPoolName: selectedLicenca.frontendPoolName,
              url1: selectedLicenca.url1,
              url2: selectedLicenca.url2,
              url3: selectedLicenca.url3,
              url4: selectedLicenca.url4,
              url5: selectedLicenca.url5,
              url6: selectedLicenca.url6,
              url7: selectedLicenca.url7,
              url8: selectedLicenca.url8,
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 px-2'>
              <Download color='hsl(var(--primary))' className='h-4 w-4' />
              <ChevronDown className='ml-1 h-3 w-3 opacity-50' />
              <span className='sr-only'>Descarregar Configurações</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuLabel>Descarregar Configurações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {!isInternalArea && (
                <>
                  <DropdownMenuItem
                    onClick={handleDownloadFrontendConfigClick}
                    disabled={!data.apiKey}
                  >
                    <Download className='mr-2 h-4 w-4' />
                    <span>Config Frontend (config.json)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadApiConfig}>
                    <Download className='mr-2 h-4 w-4' />
                    <span>Config API (appsettings.json)</span>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={handleDownloadUpdaterConfig}>
                <Download className='mr-2 h-4 w-4' />
                <span>Config Atualizador</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
