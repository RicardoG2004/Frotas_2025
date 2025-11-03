import { useState } from 'react'
import { TaxaIvaDTO } from '@/types/dtos/base/taxasIva.dtos'
import { Map, Edit, Trash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { handleApiResponse } from '@/utils/response-handlers'
import { toast } from '@/utils/toast-utils'
import { generateInstanceId } from '@/utils/window-utils'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeleteTaxaIva } from '../../queries/taxasIva-mutations'

interface CellActionProps {
  data: TaxaIvaDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const deleteTaxaIvaMutation = useDeleteTaxaIva()

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteTaxaIvaMutation.mutateAsync(data.id || '')

      const result = handleApiResponse(
        response,
        'Taxa de IVA removida com sucesso',
        'Erro ao remover a taxa de IVA',
        'Taxa de IVA removida com avisos'
      )

      if (result.success) {
        // Success or partial success - close modal
        setOpen(false)
      }
    } catch (error) {
        toast.error('Erro ao remover a taxa de IVA')
        setOpen(false)
    }
  }

  const handleUpdateClick = (taxasIva: TaxaIvaDTO) => {
    const instanceId = generateInstanceId()
    navigate(
      `/utilitarios/tabelas/configuracoes/taxas-iva/update?taxaIvaId=${taxasIva.id}&instanceId=${instanceId}`
    )
  }

  const handleViewTaxasIva = () => {
    const instanceId = generateInstanceId()
    navigate(`/utilitarios/tabelas/configuracoes/taxas-iva?instanceId=${instanceId}`, {
      state: {
        initialFilters: [{ id: 'taxasIva.descricao', value: data.descricao }],
        instanceId,
      },
    })
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteTaxaIvaMutation.isPending}
        title='Remover Taxa de IVA'
        description='Tem certeza que deseja remover esta taxa de IVA?'
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
          onClick={handleViewTaxasIva}
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <Map color='hsl(var(--primary))' className='h-4 w-4' />
          <span className='sr-only'>Ver Taxas de IVA</span>
        </Button>
      </div>
    </>
  )
}
