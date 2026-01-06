import { format } from 'date-fns'
import { CellAction } from '@/pages/application/app-updates/components/app-updates-table/app-updates-cell-action'
import { AppUpdateDTO, UpdateType } from '@/types/dtos'
import { pt } from 'date-fns/locale'
import { Check, X, Download, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export const columns: DataTableColumnDef<AppUpdateDTO>[] = [
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
    accessorKey: 'versao',
    header: 'Versão',
    sortKey: 'versao',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => <div className='font-medium'>{row.original.versao}</div>,
  },
  {
    accessorKey: 'descricao',
    header: 'Descrição',
    sortKey: 'descricao',
    enableSorting: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => (
      <div className='max-w-md truncate' title={row.original.descricao}>
        {row.original.descricao}
      </div>
    ),
  },
  {
    accessorKey: 'dataLancamento',
    header: 'Data de Lançamento',
    sortKey: 'dataLancamento',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      try {
        return format(new Date(row.original.dataLancamento), 'dd/MM/yyyy', {
          locale: pt,
        })
      } catch {
        return '-'
      }
    },
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
          <Badge variant='default' className='bg-green-500'>
            <Check className='mr-1 h-3 w-3' />
            Ativo
          </Badge>
        ) : (
          <Badge variant='secondary'>
            <X className='mr-1 h-3 w-3' />
            Inativo
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'obrigatorio',
    header: 'Obrigatório',
    sortKey: 'obrigatorio',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'center',
    },
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        {row.original.obrigatorio ? (
          <Badge variant='destructive'>
            <AlertCircle className='mr-1 h-3 w-3' />
            Sim
          </Badge>
        ) : (
          <Badge variant='outline'>Não</Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'tipoUpdate',
    header: 'Tipo',
    sortKey: 'tipoUpdate',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'center',
    },
    cell: ({ row }) => {
      const tipoLabels: Record<UpdateType, string> = {
        [UpdateType.API]: 'API',
        [UpdateType.Frontend]: 'Frontend',
        [UpdateType.Both]: 'Ambos',
      }
      return (
        <div className='flex items-center justify-center'>
          <Badge variant='outline'>{tipoLabels[row.original.tipoUpdate]}</Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'tamanhoFicheiro',
    header: 'Tamanho',
    sortKey: 'tamanhoFicheiro',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'right',
    },
    cell: ({ row }) => {
      const {
        tipoUpdate,
        tamanhoFicheiro,
        tamanhoFicheiroApi,
        tamanhoFicheiroFrontend,
      } = row.original

      // For Both type, show combined size
      if (tipoUpdate === UpdateType.Both) {
        const totalSize =
          (tamanhoFicheiroApi || 0) + (tamanhoFicheiroFrontend || 0)
        return (
          <div className='text-right'>
            {totalSize > 0 ? formatFileSize(totalSize) : '-'}
          </div>
        )
      }

      return (
        <div className='text-right'>
          {tamanhoFicheiro ? formatFileSize(tamanhoFicheiro) : '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'ficheiroUpdate',
    header: 'Ficheiro',
    sortKey: 'ficheiroUpdate',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      const {
        tipoUpdate,
        ficheiroUpdate,
        ficheiroUpdateApi,
        ficheiroUpdateFrontend,
      } = row.original
      const isBothType = tipoUpdate === UpdateType.Both

      // For Both type, check API and Frontend files
      if (isBothType) {
        const hasApi = !!ficheiroUpdateApi
        const hasFrontend = !!ficheiroUpdateFrontend

        if (hasApi && hasFrontend) {
          return (
            <div className='flex items-center gap-2'>
              <Download className='h-4 w-4 text-green-500' />
              <span className='text-sm text-muted-foreground'>
                API + Frontend
              </span>
            </div>
          )
        } else if (hasApi || hasFrontend) {
          return (
            <div className='flex items-center gap-2'>
              <Download className='h-4 w-4 text-yellow-500' />
              <span className='text-sm text-muted-foreground'>
                {hasApi ? 'API' : 'Frontend'} (parcial)
              </span>
            </div>
          )
        } else {
          return (
            <span className='text-sm text-muted-foreground'>Não carregado</span>
          )
        }
      }

      // For single type (API or Frontend only)
      return (
        <div className='flex items-center gap-2'>
          {ficheiroUpdate ? (
            <>
              <Download className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm text-muted-foreground'>
                {ficheiroUpdate}
              </span>
            </>
          ) : (
            <span className='text-sm text-muted-foreground'>Não carregado</span>
          )}
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className='flex items-center justify-end'>
        <CellAction
          data={row.original}
          aplicacaoId={row.original.aplicacaoId}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
