import { useState } from 'react'
import FuncionalidadeCreateForm from '@/pages/application/funcionalidades/components/funcionalidade-forms/funcionalidade-create-form'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'

type FuncionalidadeTableActionsProps = {
  currentFilters?: Array<{ id: string; value: string }>
}

export default function FuncionalidadeTableActions({
  currentFilters,
}: FuncionalidadeTableActionsProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const moduloFilter = currentFilters?.find(
    (filter) => filter.id === 'moduloId'
  )
  const preSelectedModuloId = moduloFilter?.value || ''

  return (
    <div className='flex items-center justify-between py-5'>
      <div className='flex flex-1 gap-4'>
        {/* <TableSearchInput placeholder="Procurar Funcionalidades..." /> */}
      </div>
      <div className='flex gap-3'>
        <Button variant='emerald' onClick={() => setIsCreateModalOpen(true)}>
          <Plus className='mr-2 h-4 w-4' /> Adicionar
        </Button>

        <EnhancedModal
          title='Criar Nova Funcionalidade'
          description='Crie uma nova funcionalidade'
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          size='lg'
        >
          <FuncionalidadeCreateForm
            modalClose={() => setIsCreateModalOpen(false)}
            preSelectedModuloId={preSelectedModuloId}
          />
        </EnhancedModal>
      </div>
    </div>
  )
}
