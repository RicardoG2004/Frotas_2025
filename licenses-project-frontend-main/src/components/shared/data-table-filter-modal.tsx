import { CheckIcon, TrashIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { ScrollArea } from '@/components/ui/scroll-area'

interface DataTableFilterModalProps {
  isOpen: boolean
  onClose: () => void
  table: any
  columns: any[]
  onApplyFilters: () => void
  onClearFilters: () => void
  FilterControls: React.ComponentType<{
    table: any
    columns: any[]
    onApplyFilters: () => void
    onClearFilters: () => void
  }>
}

export function DataTableFilterModal({
  isOpen,
  onClose,
  table,
  columns,
  onApplyFilters,
  onClearFilters,
  FilterControls,
}: DataTableFilterModalProps) {
  const handleApplyFilters = () => {
    onApplyFilters()
    onClose()
  }

  return (
    <Modal
      title='Filtros'
      isOpen={isOpen}
      onClose={onClose}
      className='sm:max-w-[800px]'
    >
      <div className='flex h-[calc(100vh-200px)] flex-col sm:h-auto'>
        <ScrollArea className='flex-1'>
          <div className='px-6'>
            <div className='grid grid-cols-1 gap-x-6 gap-y-4 pb-6 sm:grid-cols-2'>
              <FilterControls
                table={table}
                columns={columns}
                onApplyFilters={handleApplyFilters}
                onClearFilters={onClearFilters}
              />
            </div>
          </div>
        </ScrollArea>
        <div className='mt-6 flex items-center justify-end space-x-2 border-t bg-background px-6 py-4'>
          <Button variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button variant='outline' onClick={onClearFilters}>
            <TrashIcon className='mr-2 h-4 w-4' />
            Limpar
          </Button>
          <Button onClick={handleApplyFilters}>
            <CheckIcon className='mr-2 h-4 w-4' />
            Aplicar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
