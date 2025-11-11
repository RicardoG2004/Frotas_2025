import { ViaturaDTO } from '@/types/dtos/frotas/viaturas.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<ViaturaDTO>[] = [
  {
    label: 'Matrícula',
    value: 'matricula',
    order: 1,
  },
  {
    label: 'Marca',
    value: 'marca.designacao',
    order: 2,
  },
  {
    label: 'Modelo',
    value: 'modelo.designacao',
    order: 3,
  },
  {
    label: 'Localização',
    value: 'localizacao.designacao',
    order: 4,
  },
]

