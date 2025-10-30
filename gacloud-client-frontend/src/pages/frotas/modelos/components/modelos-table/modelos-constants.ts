import { ModeloDTO } from '@/types/dtos/frotas/modelos.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<ModeloDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Marca',
    value: 'marca.nome',
    order: 2,
  },
  {
    label: 'Criado em',
    value: 'createdOn',
    order: 3,
  },
]
