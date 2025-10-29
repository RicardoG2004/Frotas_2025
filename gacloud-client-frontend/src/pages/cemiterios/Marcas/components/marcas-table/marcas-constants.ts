import { MarcaDTO } from '@/types/dtos/cemiterios/marcas.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<MarcaDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Criado em',
    value: 'createdOn',
    order: 2,
  },
]
