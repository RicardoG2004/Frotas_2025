import { CellAction } from '@/pages/base/concelhos/components/concelhos-table/concelhos-cell-actions'
import { ConcelhoDTO } from '@/types/dtos/base/concelhos.dtos'
import Flag from 'react-world-flags'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<ConcelhoDTO>[] = [
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
    accessorKey: 'distrito.nome',
    id: 'distrito.nome',
    header: 'Distrito',
    sortKey: 'distrito.nome',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <span>{row.original.distrito.nome}</span>
      </div>
    ),
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'distrito.pais',
    header: 'País',
    sortKey: 'distrito.pais.nome',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Flag
          code={row.original.distrito.pais.codigo}
          height={16}
          width={24}
          fallback={<span>🏳️</span>}
        />
        <span>{row.original.distrito.pais.nome}</span>
      </div>
    ),
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
