import { useState } from 'react'
import AplicacaoCreateForm from '@/pages/application/aplicacoes/components/aplicacao-forms/aplicacao-create-form'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'

type AplicacoesTableActionsProps = {
  currentFilters?: Array<{ id: string; value: string }>
}

export default function AplicacoesTableActions({
  currentFilters,
}: AplicacoesTableActionsProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const areaFilter = currentFilters?.find((filter) => filter.id === 'areaId')
  const preSelectedAreaId = areaFilter?.value || ''

  return (
    <div className='flex items-center justify-between py-5'>
      <div className='flex flex-1 gap-4'>
        {/* <TableSearchInput placeholder="Procurar Aplicações..." /> */}
      </div>
      <div className='flex gap-3'>
        <Button variant='emerald' onClick={() => setIsCreateModalOpen(true)}>
          <Plus className='mr-2 h-4 w-4' /> Adicionar
        </Button>

        <EnhancedModal
          title='Criar Nova Aplicação'
          description='Crie uma nova aplicação'
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          size='md'
        >
          <AplicacaoCreateForm
            modalClose={() => setIsCreateModalOpen(false)}
            preSelectedAreaId={preSelectedAreaId}
          />
        </EnhancedModal>
      </div>
    </div>
  )
}
