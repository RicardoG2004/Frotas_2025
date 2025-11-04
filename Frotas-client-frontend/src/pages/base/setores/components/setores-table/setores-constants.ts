import { SetorDTO } from '@/types/dtos/base/setores.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<SetorDTO>[] = [
  {
    label: 'Descrição',
    value: 'descricao',
    order: 1,
  },
]

