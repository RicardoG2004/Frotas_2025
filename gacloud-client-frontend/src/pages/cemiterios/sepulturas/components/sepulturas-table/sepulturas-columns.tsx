import { CellAction } from '@/pages/cemiterios/sepulturas/components/sepulturas-table/sepulturas-cell-actions'
import { SepulturaDTO } from '@/types/dtos/cemiterios/sepulturas.dtos'
import {
  SepulturaEstado,
  SepulturaEstadoLabel,
} from '@/types/enums/sepultura-estado.enum'
import {
  SepulturaSituacao,
  SepulturaSituacaoLabel,
} from '@/types/enums/sepultura-situacao.enum'
import { Check as CheckIcon, X as XIcon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<SepulturaDTO>[] = [
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
    accessorKey: 'talhao.nome',
    id: 'talhao.nome',
    header: 'Talhão',
    sortKey: 'talhao.nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'sepulturaTipo.nome',
    id: 'sepulturaTipo.nome',
    header: 'Tipo',
    sortKey: 'sepulturaTipo.nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'sepulturaSituacaoId',
    id: 'sepulturaSituacaoId',
    header: 'Situação',
    sortKey: 'sepulturaSituacaoId',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const situacaoId = row.original.sepulturaSituacaoId
      const situacaoLabel =
        SepulturaSituacaoLabel[situacaoId as SepulturaSituacao] ||
        'Desconhecida'
      return <span>{situacaoLabel}</span>
    },
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'sepulturaEstadoId',
    id: 'sepulturaEstadoId',
    header: 'Estado',
    sortKey: 'sepulturaEstadoId',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      const estadoId = row.original.sepulturaEstadoId
      const estadoLabel =
        SepulturaEstadoLabel[estadoId as SepulturaEstado] || 'Desconhecido'
      return <span>{estadoLabel}</span>
    },
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'bloqueada',
    header: () => <div className='flex justify-center w-full'>Bloqueada</div>,
    sortKey: 'bloqueada',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => (
      <div className='flex items-center justify-center w-full'>
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
    accessorKey: 'litigio',
    header: () => <div className='flex justify-center w-full'>Litigio</div>,
    sortKey: 'litigio',
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => (
      <div className='flex items-center justify-center w-full'>
        {row.original.litigio ? (
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
