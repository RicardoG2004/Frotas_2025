import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import PerfilAdminCreateForm from '../perfis-admin-forms/perfil-admin-create-form'

export default function PerfisAdminTableActions() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className='flex items-center justify-between py-5'>
      <div className='flex flex-1 gap-4'>
        {/* <TableSearchInput placeholder="Procurar Licenças..." /> */}
      </div>
      <div className='flex gap-3'>
        <Button variant='emerald' onClick={() => setIsCreateModalOpen(true)}>
          <Plus className='mr-2 h-4 w-4' /> Adicionar
        </Button>

        <EnhancedModal
          title='Criar Novo Perfil'
          description='Crie um novo perfil'
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          size='md'
        >
          <PerfilAdminCreateForm
            modalClose={() => setIsCreateModalOpen(false)}
          />
        </EnhancedModal>
      </div>
    </div>
  )
}
