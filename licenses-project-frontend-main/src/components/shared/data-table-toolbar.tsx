import { Table } from '@tanstack/react-table'
import { PrintOption } from '@/types/data-table'
import { Filter, Columns } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableAction } from '@/components/shared/data-table-types'
import { PrintDropdown } from './print-dropdown'

interface DataTableToolbarProps {
  onFilterClick: () => void
  activeFiltersCount: number
  printOptions?: PrintOption[]
  table?: Table<any>
  toolbarActions?: DataTableAction[]
}

export function DataTableToolbar({
  onFilterClick,
  activeFiltersCount,
  printOptions,
  table,
  toolbarActions,
}: DataTableToolbarProps) {
  return (
    <div className='flex items-center justify-between gap-4'>
      {/* Left side */}
      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={onFilterClick}
          className='h-8 border-dashed'
        >
          <Filter className='h-4 w-4 sm:mr-2' />
          <span className='hidden sm:inline-block'>
            Filtros
            {activeFiltersCount > 0 && (
              <Badge
                variant='secondary'
                className='ml-2 bg-primary/20 text-primary'
              >
                {activeFiltersCount}
              </Badge>
            )}
          </span>
          {/* Mobile badge */}
          {activeFiltersCount > 0 && (
            <Badge
              variant='secondary'
              className='ml-1 bg-primary/20 text-primary sm:hidden'
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {table && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='h-8 border-dashed'>
                <Columns className='h-4 w-4 sm:mr-2' />
                <span className='hidden sm:inline-block'>Colunas</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              side='bottom'
              className='w-[200px]'
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {typeof column.columnDef.header === 'string'
                        ? column.columnDef.header
                        : 'accessorKey' in column.columnDef
                          ? String(column.columnDef.accessorKey)
                          : column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {printOptions && <PrintDropdown options={printOptions} />}
      </div>

      {/* Right side */}
      <div className='flex items-center gap-2'>
        {toolbarActions?.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'default'}
            size='sm'
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn('h-8', action.className)}
          >
            {action.icon && (
              <span
                className={cn('h-4 w-4', action.showOnlyIcon ? '' : 'sm:mr-2')}
              >
                {action.icon}
              </span>
            )}
            {!action.showOnlyIcon && (
              <span className='hidden sm:inline-block'>{action.label}</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
