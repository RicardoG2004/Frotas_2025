import { useState, useEffect } from 'react'
import { UpdateInfo } from '@/types/dtos'
import { AlertCircle, X, Download } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { UpdateDialog } from './update-dialog'

interface UpdateNotificationProps {
  updateInfo: UpdateInfo
  onDismiss?: () => void
}

export function UpdateNotification({
  updateInfo,
  onDismiss,
}: UpdateNotificationProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Auto-show dialog for mandatory updates
    if (updateInfo.isMandatory) {
      setIsDialogOpen(true)
    }
  }, [updateInfo.isMandatory])

  if (isDismissed || !updateInfo.updateAvailable) {
    return null
  }

  const handleUpdateNow = () => {
    setIsDialogOpen(true)
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    if (onDismiss) {
      onDismiss()
    }
  }

  // For mandatory updates, show modal dialog
  if (updateInfo.isMandatory) {
    return (
      <UpdateDialog
        updateInfo={updateInfo}
        isOpen={isDialogOpen}
        onClose={() => {
          // Don't allow closing mandatory updates
          if (!updateInfo.isMandatory) {
            setIsDialogOpen(false)
          }
        }}
      />
    )
  }

  // For optional updates, show banner
  return (
    <>
      <Alert className='mb-4 border-primary bg-primary/10'>
        <AlertCircle className='h-4 w-4 text-primary' />
        <AlertTitle className='flex items-center justify-between'>
          <span>Nova Atualização Disponível</span>
          {!updateInfo.isMandatory && (
            <Button
              variant='ghost'
              size='icon'
              className='h-6 w-6'
              onClick={handleDismiss}
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </AlertTitle>
        <AlertDescription className='space-y-2'>
          <div>
            <p className='font-medium'>
              Versão {updateInfo.latestVersion} disponível
            </p>
          </div>
          <div className='flex gap-2'>
            <Button onClick={handleUpdateNow} size='sm'>
              <Download className='mr-2 h-4 w-4' />
              Atualizar Agora
            </Button>
            {!updateInfo.isMandatory && (
              <Button onClick={handleDismiss} variant='outline' size='sm'>
                Lembrar Mais Tarde
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>

      <UpdateDialog
        updateInfo={updateInfo}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  )
}
