import { DataTableFilterField } from '@/components/shared/data-table-types';
import { ClienteDTO } from '@/types/dtos';

export const filterFields: DataTableFilterField<ClienteDTO>[] = [
  {
    label: 'Nome',
    value: 'nome'
  },
  {
    label: 'Sigla',
    value: 'sigla'
  },
  {
    label: 'NIF',
    value: 'nif'
  },
  {
    label: 'Ativo',
    value: 'ativo'
  }
];
