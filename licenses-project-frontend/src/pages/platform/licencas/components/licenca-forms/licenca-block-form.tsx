import { useState } from 'react'
import { useBlockLicenca } from '@/pages/platform/licencas/queries/licencas-mutations'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface LicencaBlockFormProps {
  licencaId: string
  modalClose: () => void
}

const LicencaBlockForm = ({ licencaId, modalClose }: LicencaBlockFormProps) => {
  const [motivoBloqueio, setMotivoBloqueio] = useState('')
  const blockLicencaMutation = useBlockLicenca()

  const handleBlockConfirm = async () => {
    if (!motivoBloqueio.trim()) {
      toast.error('O motivo do bloqueio é obrigatório')
      return
    }

    try {
      const response = await blockLicencaMutation.mutateAsync({
        licencaId,
        motivoBloqueio: motivoBloqueio.trim(),
      })

      if (response.info.succeeded) {
        toast.success('Licença bloqueada com sucesso!')
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao bloquear licença'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao bloquear licença'))
    }
  }

  return (
    <div className='space-y-4'>
      <Textarea
        placeholder='Digite o motivo do bloqueio'
        value={motivoBloqueio}
        onChange={(e) => setMotivoBloqueio(e.target.value)}
        className='min-h-[100px]'
      />
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
          onClick={handleBlockConfirm}
          disabled={blockLicencaMutation.isPending}
          className='w-full md:w-auto'
          variant='destructive'
        >
          {blockLicencaMutation.isPending ? 'A bloquear...' : 'Bloquear'}
        </Button>
      </div>
    </div>
  )
}

export default LicencaBlockForm
