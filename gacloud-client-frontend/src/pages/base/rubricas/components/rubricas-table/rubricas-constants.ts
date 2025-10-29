import { RubricaDTO } from '@/types/dtos/base/rubricas.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<RubricaDTO>[] = [
  {
    label: 'Código',
    value: 'codigo',
    order: 1,
  },
  {
    label: 'Tipo de Classificação',
    value: 'classificacaoTipo',
    order: 2,
  },
  {
    label: 'Tipo de Rubrica',
    value: 'rubricaTipo',
    order: 3,
  },
]
