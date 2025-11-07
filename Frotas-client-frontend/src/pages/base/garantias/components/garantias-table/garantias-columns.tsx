import { CellAction } from '@/pages/base/garantias/components/garantias-table/garantias-cell-actions'
import { GarantiaDTO } from '@/types/dtos/base/garantias.dtos'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const columns: DataTableColumnDef<GarantiaDTO>[] = [
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
    accessorKey: 'designacao',
    header: 'Designação',
    sortKey: 'designacao',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'anos',
    header: 'Anos',
    sortKey: 'anos',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => row.original.anos ?? '-',
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'kms',
    header: 'Kms',
    sortKey: 'kms',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => row.original.kms ?? '-',
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'createdOn',
    header: 'Criado em',
    sortKey: 'createdOn',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const date = row.original.createdOn
      if (!date) return '-'
      try {
        return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR })
      } catch {
        return '-'
      }
    },
    meta: {
      align: 'left',
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


