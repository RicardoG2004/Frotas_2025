import { SeguradoraDTO } from '@/types/dtos/frotas/seguradoras.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<SeguradoraDTO>[] = [
  {
    label: 'Descrição',
    value: 'descricao',
    order: 1,
  },
  {
    label: 'Criado em',
    value: 'createdOn',
    order: 2,
  },
]


