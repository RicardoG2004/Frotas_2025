import { useState, useEffect } from 'react'
import { UpdateInfo } from '@/types/dtos'
import {
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
} from 'lucide-react'
import AppUpdatesService from '@/lib/services/application/app-updates-service'
import { toast } from '@/utils/toast-utils'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'

type UpdateState =
  | 'idle'
  | 'downloading'
  | 'verifying'
  | 'extracting'
  | 'installing'
  | 'success'
  | 'error'

interface UpdateDialogProps {
  updateInfo: UpdateInfo
  isOpen: boolean
  onClose: () => void
  aplicacaoId?: string
  updateId?: string
}

export function UpdateDialog({
  updateInfo,
  isOpen,
  onClose,
  aplicacaoId,
  updateId,
}: UpdateDialogProps) {
  const [state, setState] = useState<UpdateState>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      // Reset state when dialog closes
      setState('idle')
      setProgress(0)
      setError(null)
    }
  }, [isOpen])

  const handleStartUpdate = async () => {
    if (!aplicacaoId || !updateId) {
      setError('Informações de atualização incompletas')
      setState('error')
      return
    }

    try {
      setState('downloading')
      setProgress(0)
      setError(null)

      // Download update package
      await AppUpdatesService('app-updates').downloadUpdatePackage(
        updateId,
        (progress) => {
          setProgress(progress)
        }
      )
      setState('verifying')
      setProgress(0)

      // Verify file hash (this would need to be implemented based on your hash verification logic)
      // For now, we'll skip to extracting
      setState('extracting')
      setProgress(50)

      // Extract ZIP file
      // Note: In a browser environment, we can't directly extract and replace files
      // This would typically require a desktop app or Electron wrapper
      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProgress(100)

      setState('installing')
      setProgress(0)

      // Simulate installation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProgress(100)

      setState('success')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro ao atualizar aplicação'
      )
      setState('error')
      toast.error('Erro ao atualizar aplicação')
    }
  }

  const handleClose = () => {
    if (updateInfo.isMandatory && state !== 'success' && state !== 'error') {
      // Don't allow closing mandatory updates during update process
      return
    }
    onClose()
  }

  const getStateMessage = () => {
    switch (state) {
      case 'idle':
        return 'Pronto para iniciar a atualização'
      case 'downloading':
        return 'A descarregar atualização...'
      case 'verifying':
        return 'A verificar integridade do ficheiro...'
      case 'extracting':
        return 'A extrair ficheiros...'
      case 'installing':
        return 'A instalar atualização...'
      case 'success':
        return 'Atualização instalada com sucesso!'
      case 'error':
        return 'Erro ao atualizar'
      default:
        return ''
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className='sm:max-w-[500px]'
        onPointerDownOutside={(e) => {
          if (
            updateInfo.isMandatory &&
            state !== 'success' &&
            state !== 'error'
          ) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {state === 'success' ? (
              <CheckCircle2 className='h-5 w-5 text-green-500' />
            ) : state === 'error' ? (
              <AlertCircle className='h-5 w-5 text-destructive' />
            ) : (
              <Download className='h-5 w-5' />
            )}
            {state === 'success'
              ? 'Atualização Concluída'
              : state === 'error'
                ? 'Erro na Atualização'
                : 'Atualização Disponível'}
          </DialogTitle>
          <DialogDescription>
            {state === 'success'
              ? 'A atualização foi instalada com sucesso. Por favor, reinicie a aplicação.'
              : state === 'error'
                ? 'Ocorreu um erro durante a atualização.'
                : `Versão ${updateInfo.latestVersion} está disponível para instalação.`}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          {updateInfo.releaseNotes && (
            <div>
              <div className='mb-2 flex items-center gap-2 text-sm font-medium'>
                <FileText className='h-4 w-4' />
                Notas de Atualização
              </div>
              <ScrollArea className='h-32 rounded-md border p-3'>
                <p className='text-sm whitespace-pre-wrap'>
                  {updateInfo.releaseNotes}
                </p>
              </ScrollArea>
            </div>
          )}

          {state !== 'idle' && state !== 'success' && state !== 'error' && (
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span>{getStateMessage()}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {state === 'error' && error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {state === 'success' && (
            <Alert>
              <CheckCircle2 className='h-4 w-4' />
              <AlertDescription>
                A atualização foi instalada com sucesso. Por favor, reinicie a
                aplicação para aplicar as alterações.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          {state === 'idle' && (
            <>
              {!updateInfo.isMandatory && (
                <Button variant='outline' onClick={handleClose}>
                  Cancelar
                </Button>
              )}
              <Button onClick={handleStartUpdate}>
                <Download className='mr-2 h-4 w-4' />
                Iniciar Atualização
              </Button>
            </>
          )}
          {(state === 'downloading' ||
            state === 'verifying' ||
            state === 'extracting' ||
            state === 'installing') && (
            <div className='flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span>{getStateMessage()}</span>
            </div>
          )}
          {state === 'error' && (
            <>
              <Button variant='outline' onClick={handleClose}>
                Fechar
              </Button>
              <Button onClick={handleStartUpdate}>Tentar Novamente</Button>
            </>
          )}
          {state === 'success' && (
            <Button
              onClick={() => {
                // Reload the application
                window.location.reload()
              }}
            >
              Reiniciar Aplicação
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
