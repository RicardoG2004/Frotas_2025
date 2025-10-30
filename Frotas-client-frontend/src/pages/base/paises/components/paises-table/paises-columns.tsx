import { CellAction } from '@/pages/base/paises/components/paises-table/paises-cell-actions'
import { PaisDTO } from '@/types/dtos/base/paises.dtos'
import Flag from 'react-world-flags'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<PaisDTO>[] = [
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
    accessorKey: 'codigo',
    header: 'Código',
    sortKey: 'codigo',
    enableSorting: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'flag',
    header: 'Bandeira',
    cell: ({ row }) => (
      <div className='flex justify-center'>
        <Flag
          code={row.original.codigo}
          height={24}
          width={32}
          fallback={<span>🏳️</span>}
        />
      </div>
    ),
    enableSorting: false,
    meta: {
      width: 'w-[80px]',
      align: 'center',
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
