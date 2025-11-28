import { ViaturaDTO } from '@/types/dtos/frotas/viaturas.dtos'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { ViaturasCellAction } from './viaturas-cell-actions'

export const columns: DataTableColumnDef<ViaturaDTO>[] = [
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
    accessorKey: 'matricula',
    header: 'Matrícula',
    sortKey: 'matricula',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => row.original.matricula || '-',
  },
  {
    accessorKey: 'marca.nome',
    header: 'Marca',
    sortKey: 'marca.nome',
    enableSorting: true,
    cell: ({ row }) => row.original.marca?.nome || '-',
  },
  {
    accessorKey: 'modelo.nome',
    header: 'Modelo',
    sortKey: 'modelo.nome',
    enableSorting: true,
    cell: ({ row }) => row.original.modelo?.nome || '-',
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className='flex items-center justify-end'>
        <ViaturasCellAction data={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]

