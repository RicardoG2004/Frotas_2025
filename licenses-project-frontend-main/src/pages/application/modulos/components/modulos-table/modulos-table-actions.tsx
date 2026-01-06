import { useState } from 'react'
import ModuloCreateForm from '@/pages/application/modulos/components/modulo-forms/modulo-create-form'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'

type ModulosTableActionsProps = {
  currentFilters?: Array<{ id: string; value: string }>
}

export default function ModulosTableActions({
  currentFilters,
}: ModulosTableActionsProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const aplicacaoFilter = currentFilters?.find(
    (filter) => filter.id === 'aplicacaoId'
  )
  const preSelectedAplicacaoId = aplicacaoFilter?.value || ''

  return (
    <div className='flex items-center justify-between py-5'>
      <div className='flex flex-1 gap-4'>
        {/* <TableSearchInput placeholder="Procurar Módulos..." /> */}
      </div>
      <div className='flex gap-3'>
        <Button variant='emerald' onClick={() => setIsCreateModalOpen(true)}>
          <Plus className='mr-2 h-4 w-4' /> Adicionar
        </Button>

        <EnhancedModal
          title='Criar Novo Modulo'
          description='Crie um novo modulo'
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          size='lg'
        >
          <ModuloCreateForm
            modalClose={() => setIsCreateModalOpen(false)}
            preSelectedAplicacaoId={preSelectedAplicacaoId}
          />
        </EnhancedModal>
      </div>
    </div>
  )
}
