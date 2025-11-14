import { DataTableFilterField } from '@/components/shared/data-table-types'
import { FuncionarioDTO } from '@/types/dtos/base/funcionarios.dtos'

export const filterFields: DataTableFilterField<FuncionarioDTO>[] = [
  {
    label: 'Nome',
    value: 'nome',
    order: 1,
  },
  {
    label: 'Email',
    value: 'email',
    order: 2,
  },
  {
    label: 'Telefone',
    value: 'telefone',
    order: 3,
  },
  {
    label: 'Cargo',
    value: 'cargo',
    order: 4,
  },
  {
    label: 'Delegação',
    value: 'delegacao',
    order: 5,
  },
  {
    label: 'Freguesia',
    value: 'freguesia',
    order: 6,
  },
  {
    label: 'Ativo',
    value: 'ativo',
    order: 7,
  },
]

