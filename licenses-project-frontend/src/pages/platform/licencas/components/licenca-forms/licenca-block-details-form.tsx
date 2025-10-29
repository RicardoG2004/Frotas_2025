import { format } from 'date-fns'
import { useUnblockLicenca } from '@/pages/platform/licencas/queries/licencas-mutations'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'

interface LicencaBlockDetailsFormProps {
  licencaId: string
  dataBloqueio?: Date
  motivoBloqueio?: string
  modalClose: () => void
}

const LicencaBlockDetailsForm = ({
  licencaId,
  dataBloqueio,
  motivoBloqueio,
  modalClose,
}: LicencaBlockDetailsFormProps) => {
  const unblockLicencaMutation = useUnblockLicenca()

  const handleUnblockConfirm = async () => {
    try {
      const response = await unblockLicencaMutation.mutateAsync(licencaId)

      if (response.info.succeeded) {
        toast.success('Licença desbloqueada com sucesso!')
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao desbloquear licença'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao desbloquear licença'))
    }
  }

  return (
    <div className='space-y-4'>
      <div className='rounded-lg border p-4'>
        <div className='mb-2'>
          <span className='font-semibold'>Data do Bloqueio:</span>{' '}
          {dataBloqueio
            ? format(new Date(dataBloqueio), 'dd/MM/yyyy HH:mm')
            : '-'}
        </div>
        <div>
          <span className='font-semibold'>Motivo:</span> {motivoBloqueio || '-'}
        </div>
      </div>
      <div className='flex flex-col justify-end space-y-2 pt-4 md:flex-row md:space-x-4 md:space-y-0'>
        <Button
          type='button'
          variant='outline'
          onClick={modalClose}
          className='w-full md:w-auto'
        >
          Cancelar
        </Button>
        <Button
          type='submit'
          onClick={handleUnblockConfirm}
          disabled={unblockLicencaMutation.isPending}
          className='w-full md:w-auto'
          variant='emerald'
        >
          {unblockLicencaMutation.isPending
            ? 'A desbloquear...'
            : 'Desbloquear'}
        </Button>
      </div>
    </div>
  )
}

export default LicencaBlockDetailsForm
