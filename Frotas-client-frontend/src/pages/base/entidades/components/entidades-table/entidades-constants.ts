import { EntidadeDTO } from '@/types/dtos/base/entidades.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<EntidadeDTO>[] = [
  {
    label: 'Designação',
    value: 'designacao',
    order: 1,
  },
  {
    label: 'Localidade',
    value: 'localidade',
    order: 2,
  },
  {
    label: 'Email',
    value: 'email',
    order: 3,
  },
  {
    label: 'Telefone',
    value: 'telefone',
    order: 4,
  },
  {
    label: 'Criado em',
    value: 'createdOn',
    order: 5,
  },
]


