import { CellAction } from '@/pages/base/epocas/components/epocas-table/epocas-cell-actions'
import { EpocaDTO } from '@/types/dtos/base/epocas.dtos'
import { Check as CheckIcon, X as XIcon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<EpocaDTO>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Selecionar todos'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Selecionar linha'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      width: 'w-[4%]',
    },
  },
  {
    accessorKey: 'descricao',
    header: 'Descrição',
    sortKey: 'descricao',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'epocaAnteriorId',
    header: 'Época Anterior',
    sortKey: 'epocaAnterior.descricao',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <span>{row.original.epocaAnterior?.descricao || '-'}</span>
      </div>
    ),
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'predefinida',
    header: 'Predefinida',
    sortKey: 'predefinida',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        {row.original.predefinida ? (
          <CheckIcon className='h-4 w-4 text-emerald-500' />
        ) : (
          <XIcon className='h-4 w-4 text-destructive' />
        )}
      </div>
    ),
    meta: {
      align: 'center',
      width: 'w-[100px]',
    },
  },
  {
    accessorKey: 'bloqueada',
    header: 'Bloqueada',
    sortKey: 'bloqueada',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        {row.original.bloqueada ? (
          <CheckIcon className='h-4 w-4 text-emerald-500' />
        ) : (
          <XIcon className='h-4 w-4 text-destructive' />
        )}
      </div>
    ),
    meta: {
      align: 'center',
      width: 'w-[100px]',
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className='flex items-center justify-end'>
        <CellAction data={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
