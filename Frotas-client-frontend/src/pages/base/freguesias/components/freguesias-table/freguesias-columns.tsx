import { CellAction } from '@/pages/base/freguesias/components/freguesias-table/freguesias-cell-actions'
import { FreguesiaDTO } from '@/types/dtos/base/freguesias.dtos'
import Flag from 'react-world-flags'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<FreguesiaDTO>[] = [
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
    accessorKey: 'concelho.nome',
    id: 'concelho.nome',
    header: 'Concelho',
    sortKey: 'concelho.nome',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <span>{row.original.concelho.nome}</span>
      </div>
    ),
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'concelho.distrito.nome',
    id: 'concelho.distrito.nome',
    header: 'Distrito',
    sortKey: 'concelho.distrito.nome',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <span>{row.original.concelho.distrito.nome}</span>
      </div>
    ),
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'concelho.distrito.pais',
    header: 'País',
    sortKey: 'concelho.distrito.pais.nome',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Flag
          code={row.original.concelho.distrito.pais.codigo}
          height={16}
          width={24}
          fallback={<span>🏳️</span>}
        />
        <span>{row.original.concelho.distrito.pais.nome}</span>
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
