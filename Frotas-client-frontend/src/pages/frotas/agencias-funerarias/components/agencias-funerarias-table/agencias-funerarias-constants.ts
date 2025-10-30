import { AgenciaFunerariaDTO } from '@/types/dtos/frotas/agencias-funerarias.dtos'
import { DataTableFilterField } from '@/components/shared/data-table-types'

export const filterFields: DataTableFilterField<AgenciaFunerariaDTO>[] = [
  {
    label: 'Entidade',
    value: 'entidade.nome',
    order: 1,
  },
  {
    label: 'Criado em',
    value: 'createdOn',
    order: 2,
  },
]
