import { CellAction } from '@/pages/application/aplicacoes/components/aplicacoes-table/aplicacoes-cell-action'
import { AplicacaoDTO } from '@/types/dtos'
import { Check, X, FolderGit2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ColoredBadge } from '@/components/shared/colored-badge'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<AplicacaoDTO>[] = [
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
    accessorKey: 'descricao',
    header: 'Descrição',
    sortKey: 'descricao',
    enableSorting: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'versao',
    header: 'Versão',
    sortKey: 'versao',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'center',
    },
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <Badge variant='outline' className='font-mono text-xs'>
          v{row.original.versao || 'N/A'}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'ativo',
    header: 'Estado',
    sortKey: 'ativo',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'center',
    },
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        {row.original.ativo ? (
          <Check className='h-4 w-4 text-green-500' />
        ) : (
          <X className='h-4 w-4 text-destructive' />
        )}
      </div>
    ),
  },
  {
    accessorKey: 'areaId',
    header: 'Área',
    sortKey: 'area.nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      const area = row.original.area
      if (!area) {
        return <div>-</div>
      }

      return (
        <ColoredBadge
          label={area.nome}
          color={area.color}
          icon={<FolderGit2 className='h-3.5 w-3.5' />}
          size='md'
        />
      )
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
