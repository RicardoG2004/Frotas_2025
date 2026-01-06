import { format } from 'date-fns'
import { CellAction } from '@/pages/platform/licencas/components/licencas-table/licencas-cell-action'
import { LicencaDTO } from '@/types/dtos'
import { Check, X, Layers } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ColoredBadge } from '@/components/shared/colored-badge'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<LicencaDTO>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Seleccionar todos'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Seleccionar linha'
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
    cell: ({ row }) => (
      <div className='max-w-[200px] truncate' title={row.original.nome}>
        {row.original.nome}
      </div>
    ),
  },
  {
    accessorKey: 'clienteId',
    header: 'Cliente',
    sortKey: 'cliente.nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => (
      <div
        className='max-w-[200px] truncate'
        title={row.original.cliente?.nome}
      >
        {row.original.cliente?.nome}
      </div>
    ),
  },
  {
    accessorKey: 'aplicacaoId',
    header: 'Aplicação',
    sortKey: 'aplicacao.nome',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      const area = row.original.aplicacao?.area
      const appName = row.original.aplicacao?.nome || '-'

      return (
        <ColoredBadge
          label={appName}
          color={area?.color}
          icon={<Layers className='h-3.5 w-3.5' />}
          size='md'
        />
      )
    },
  },
  {
    accessorKey: 'versaoInstalada',
    header: 'Versão Instalada',
    sortKey: 'versaoInstalada',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'center',
    },
    cell: ({ row }) => {
      const versaoInstalada = row.original.versaoInstalada
      const versaoAplicacao = row.original.aplicacao?.versao
      const isUpToDate =
        versaoInstalada && versaoAplicacao
          ? versaoInstalada === versaoAplicacao
          : null

      if (!versaoInstalada) {
        return <span className='text-sm text-muted-foreground'>N/A</span>
      }

      return (
        <div className='flex items-center justify-center gap-2'>
          <Badge
            variant={isUpToDate === true ? 'default' : 'secondary'}
            className='font-mono text-xs'
          >
            v{versaoInstalada}
          </Badge>
          {isUpToDate === false && versaoAplicacao && (
            <span className='text-xs text-muted-foreground'>
              (App: v{versaoAplicacao})
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'numeroUtilizadores',
    header: 'Nº Utilizadores',
    sortKey: 'numeroUtilizadores',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'center',
    },
  },
  {
    accessorKey: 'dataInicio',
    header: 'Data Início',
    sortKey: 'dataInicio',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'center',
    },
    cell: ({ row }) => {
      const date = row.original.dataInicio
      return date ? format(new Date(date), 'dd/MM/yyyy') : '-'
    },
  },
  {
    accessorKey: 'dataFim',
    header: 'Data Fim',
    sortKey: 'dataFim',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'center',
    },
    cell: ({ row }) => {
      const date = row.original.dataFim
      return date ? format(new Date(date), 'dd/MM/yyyy') : '-'
    },
  },
  {
    accessorKey: 'ativo',
    header: () => <div className='text-center'>Estado</div>,
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
