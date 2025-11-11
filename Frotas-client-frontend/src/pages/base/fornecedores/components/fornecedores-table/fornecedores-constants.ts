import { FornecedorDTO } from '@/types/dtos/base/fornecedores.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<FornecedorDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'NIF',
    value: 'numContribuinte',
    order: 2,
  },
  {
    label: 'Origem',
    value: 'origem',
    order: 3,
  },
  {
    label: 'Email',
    value: 'email',
    order: 4,
  },
  {
    label: 'Criado em',
    value: 'createdOn',
    order: 5,
  },
]

