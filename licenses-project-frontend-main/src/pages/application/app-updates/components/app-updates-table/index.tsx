import React, { useState } from 'react'
import AppUpdateCreateForm from '@/pages/application/app-updates/components/app-update-forms/app-update-create-form'
import { columns } from '@/pages/application/app-updates/components/app-updates-table/app-updates-columns'
import { AppUpdatesFilterControls } from '@/pages/application/app-updates/components/app-updates-table/app-updates-filter-controls'
import { AppUpdateDTO } from '@/types/dtos'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from 'use-debounce'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { Input } from '@/components/ui/input'
import DataTable from '@/components/shared/data-table'

type TAppUpdatesTableProps = {
  updates: AppUpdateDTO[]
  aplicacaoId: string
  total: number
  pageCount: number
  onPaginationChange?: (page: number, pageSize: number) => void
  onSortingChange?: (sorting: Array<{ id: string; desc: boolean }>) => void
}

export default function AppUpdatesTable({
  updates,
  aplicacaoId,
  total,
  pageCount,
  onPaginationChange,
  onSortingChange,
}: TAppUpdatesTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState(
    searchParams.get('keyword') || ''
  )
  const [debouncedSearchValue] = useDebounce(searchValue, 500)

  // Update URL when search value changes
  React.useEffect(() => {
    if (debouncedSearchValue) {
      setSearchParams({ keyword: debouncedSearchValue })
    } else {
      setSearchParams({})
    }
  }, [debouncedSearchValue, setSearchParams])

  const handleRowSelectionChange = (newSelectedRows: string[]) => {
    setSelectedRows(newSelectedRows)
  }

  return (
    <>
      <EnhancedModal
        title='Criar Nova Atualização'
        description='Crie uma nova atualização para a aplicação'
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        size='xl'
      >
        <AppUpdateCreateForm
          modalClose={() => setIsCreateModalOpen(false)}
          aplicacaoId={aplicacaoId}
        />
      </EnhancedModal>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-1 items-center gap-4'>
            <Input
              placeholder='Pesquisar atualizações...'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className='max-w-sm'
            />
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            Nova Atualização
          </Button>
        </div>

        <DataTable
          data={updates}
          columns={columns}
          selectedRows={selectedRows}
          onRowSelectionChange={handleRowSelectionChange}
          pageCount={pageCount}
          totalRows={total}
          onPaginationChange={onPaginationChange}
          onSortingChange={onSortingChange}
          FilterControls={AppUpdatesFilterControls}
        />
      </div>
    </>
  )
}
