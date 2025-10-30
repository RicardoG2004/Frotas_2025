import { CellAction } from '@/pages/base/distritos/components/distritos-table/distritos-cell-actions'
import { DistritoDTO } from '@/types/dtos/base/distritos.dtos'
import Flag from 'react-world-flags'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<DistritoDTO>[] = [
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
    accessorKey: 'paisId',
    header: 'País',
    sortKey: 'pais.nome',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Flag
          code={row.original.pais.codigo}
          height={16}
          width={24}
          fallback={<span>🏳️</span>}
        />
        <span>{row.original.pais.nome}</span>
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
