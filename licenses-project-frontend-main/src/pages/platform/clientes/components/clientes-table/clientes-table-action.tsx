import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { EnhancedModal } from '@/components/ui/enhanced-modal';
import { Plus } from 'lucide-react';
import ClienteCreateForm from '@/pages/platform/clientes/components/cliente-forms/cliente-create-form';

export default function ClientesTableActions() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="flex items-center justify-between py-5">
      <div className="flex flex-1 gap-4">
        {/* <TableSearchInput placeholder="Procurar Aplicações..." /> */}
      </div>
      <div className="flex gap-3">
        <Button variant="emerald" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>

        <EnhancedModal
          title="Criar Novo Cliente"
          description="Crie um novo cliente"
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          size="xl"
        >
          <ClienteCreateForm modalClose={() => setIsCreateModalOpen(false)} />
        </EnhancedModal>
      </div>
    </div>
  );
}
