import { CellAction } from '@/pages/application/areas/components/areas-table/areas-cell-action'
import { AreaDTO } from '@/types/dtos'
import { Circle } from 'lucide-react'
import { PREDEFINED_COLORS } from '@/lib/constants/colors'
import { Checkbox } from '@/components/ui/checkbox'
import { ColoredBadge } from '@/components/shared/colored-badge'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<AreaDTO>[] = [
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
    accessorKey: 'color',
    header: 'Cor',
    enableSorting: false,
    enableHiding: true,
    sortKey: 'color',
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      const color = row.original.color
      return (
        <ColoredBadge
          label={
            PREDEFINED_COLORS.find((c) => c.value === color)?.label || color
          }
          color={color}
          icon={<Circle className='h-3.5 w-3.5' fill={color} />}
          size='md'
        />
      )
    },
  },
  {
    id: 'actions',
    header: () => <div className='text-right'></div>,
    cell: ({ row }) => (
      <div className='flex items-center justify-end'>
        <CellAction data={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
