import { EpocaDTO } from '@/types/dtos/base/epocas.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<EpocaDTO>[] = [
  {
    label: 'Descrição',
    value: 'descricao',
    order: 1,
  },
  {
    label: 'Época Anterior',
    value: 'epocaAnterior.descricao',
    order: 2,
  },
  {
    label: 'Predefinida',
    value: 'predefinida',
    order: 3,
    type: 'boolean',
  },
  {
    label: 'Bloqueada',
    value: 'bloqueada',
    order: 4,
    type: 'boolean',
  },
]
