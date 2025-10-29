import { useState } from 'react'
import { UtilizadorAdminCreateForm } from '@/pages/platform/utilizadores-admin/components/utilizador-admin-forms/utilizador-admin-create-form'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'

export default function UtilizadoresAdminTableActions() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

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
          title='Criar Novo Utilizador'
          description='Crie um novo utilizador'
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          size='xl'
        >
          <UtilizadorAdminCreateForm
            modalClose={() => setIsCreateModalOpen(false)}
          />
        </EnhancedModal>
      </div>
    </div>
  )
}
