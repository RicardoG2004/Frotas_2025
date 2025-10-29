import { CellAction } from '@/pages/cemiterios/cemiterios/components/cemiterios-table/cemiterios-cell-actions'
import { CemiterioDTO } from '@/types/dtos/cemiterios/cemiterios.dtos'
import { Check as CheckIcon, X as XIcon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<CemiterioDTO>[] = [
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
    accessorKey: 'nome',
    header: 'Nome',
    sortKey: 'nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'morada',
    header: 'Morada',
    sortKey: 'morada',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'codigoPostal.codigo',
    id: 'codigoPostal.codigo',
    header: 'Código Postal',
    sortKey: 'codigoPostal.codigo',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <span>{row.original.codigoPostal.codigo}</span>
      </div>
    ),
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'predefinido',
    header: () => <div className='flex justify-center w-full'>Predefinido</div>,
    sortKey: 'predefinido',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => (
      <div className='flex items-center justify-center w-full'>
        {row.original.predefinido ? (
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
