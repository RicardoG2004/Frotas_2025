import { UtilizadorDTO } from '@/types/dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<UtilizadorDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Email',
    value: 'email',
    order: 2,
  },
  {
    label: 'Role',
    value: 'roleId',
    order: 3,
  },
  {
    label: 'Estado',
    value: 'ativo',
    order: 4,
  },
]
