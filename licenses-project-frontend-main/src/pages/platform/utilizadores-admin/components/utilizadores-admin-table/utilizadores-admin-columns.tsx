import { useGetPerfis } from '@/pages/platform/perfis-admin/queries/perfis-admin-queries'
import { CellAction } from '@/pages/platform/utilizadores-admin/components/utilizadores-admin-table/utilizadores-admin-cell-action'
import { UtilizadorDTO } from '@/types/dtos'
import { Check, X, Shield } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { roleConfig } from '@/constants/roles'
import { Checkbox } from '@/components/ui/checkbox'
import { ColoredBadge } from '@/components/shared/colored-badge'
import { DataTableColumnDef } from '@/components/shared/data-table-types'

export const columns: DataTableColumnDef<UtilizadorDTO>[] = [
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
    cell: ({ row }) => (
      <div>
        {[row.original.firstName, row.original.lastName]
          .filter(Boolean)
          .join(' ') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    sortKey: 'email',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
  },
  {
    accessorKey: 'roleId',
    header: 'Role',
    sortKey: 'roleId',
    enableSorting: true,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      const role = (row.original.roleId?.toLowerCase() ||
        'client') as keyof typeof roleConfig

      return (
        <ColoredBadge
          label={roleConfig[role].label}
          color={roleConfig[role].color}
          icon={<Shield className='h-3.5 w-3.5' />}
          size='md'
        />
      )
    },
  },
  // {
  //   accessorKey: 'cliente.nome',
  //   header: 'Cliente',
  //   sortKey: 'cliente.nome',
  //   enableSorting: true,
  //   enableHiding: true,
  //   meta: {
  //     align: 'left',
  //   },
  //   cell: ({ row }) => (
  //     <div
  //       className='truncate max-w-[200px]'
  //       title={row.original.cliente?.nome}
  //     >
  //       {row.original.cliente?.nome || '-'}
  //     </div>
  //   ),
  // },
  {
    accessorKey: 'perfisUtilizador',
    header: 'Perfil',
    enableSorting: false,
    enableHiding: true,
    meta: {
      align: 'left',
    },
    cell: ({ row }) => {
      const { licencaId } = useAuthStore()
      const perfis = row.original.perfisUtilizador
      if (!perfis || perfis.length === 0) return '-'

      return <PerfilCell perfilId={perfis[0]} licencaId={licencaId!} />
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
        {row.original.isActive ? (
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

const PerfilCell = ({
  perfilId,
  licencaId,
}: {
  perfilId: string
  licencaId: string
}) => {
  const { data: perfis } = useGetPerfis(licencaId)
  const perfil = perfis?.find((p) => p.id === perfilId)

  if (!perfil) return '-'

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'bg-slate-100 text-slate-700 border border-slate-200'
      )}
      title={perfil.nome}
    >
      {perfil.nome}
    </div>
  )
}
