import { ServicoDTO } from '@/types/dtos/frotas/servicos.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<ServicoDTO>[] = [
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

