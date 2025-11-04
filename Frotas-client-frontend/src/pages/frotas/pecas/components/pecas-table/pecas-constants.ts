import { PecaDTO } from '@/types/dtos/frotas/pecas.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<PecaDTO>[] = [
  {
    label: 'Designação',
    value: 'designacao',
    order: 1,
  },
  {
    label: 'Tipo',
    value: 'tipo',
    order: 2,
  },
  {
    label: 'Criado em',
    value: 'createdOn',
    order: 3,
  },
]

