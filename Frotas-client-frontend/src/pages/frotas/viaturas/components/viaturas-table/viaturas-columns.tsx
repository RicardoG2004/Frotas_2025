import { ViaturaDTO } from '@/types/dtos/frotas/viaturas.dtos'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'
import { ViaturasCellAction } from './viaturas-cell-actions'

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return new Intl.DateTimeFormat('pt-PT').format(date)
}

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
    accessorKey: 'marca.designacao',
    header: 'Marca',
    sortKey: 'marca.designacao',
    enableSorting: true,
    cell: ({ row }) => row.original.marca?.designacao || '-',
  },
  {
    accessorKey: 'modelo.designacao',
    header: 'Modelo',
    sortKey: 'modelo.designacao',
    enableSorting: true,
    cell: ({ row }) => row.original.modelo?.designacao || '-',
  },
  {
    accessorKey: 'numero',
    header: 'Número',
    sortKey: 'numero',
    enableSorting: true,
    cell: ({ row }) => row.original.numero ?? '-',
  },
  {
    accessorKey: 'localizacao.designacao',
    header: 'Localização',
    sortKey: 'localizacao.designacao',
    enableSorting: true,
    cell: ({ row }) => row.original.localizacao?.designacao || '-',
  },
  {
    accessorKey: 'dataAquisicao',
    header: 'Aquisição',
    sortKey: 'dataAquisicao',
    enableSorting: true,
    cell: ({ row }) => formatDate(row.original.dataAquisicao),
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

