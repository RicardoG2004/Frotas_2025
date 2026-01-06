import { useState } from 'react'
import { useGetClientesByAplicacao } from '@/pages/platform/licencas/queries/licencas-queries'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface ClienteMultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  aplicacaoId: string
  disabled?: boolean
}

export function ClienteMultiSelect({
  value,
  onChange,
  aplicacaoId,
  disabled,
}: ClienteMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { data: clientes = [], isLoading } =
    useGetClientesByAplicacao(aplicacaoId)

  const selectedClientes = clientes.filter((cliente) =>
    value.includes(cliente.id)
  )

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggleCliente = (clienteId: string) => {
    const newValue = value.includes(clienteId)
      ? value.filter((id) => id !== clienteId)
      : [...value, clienteId]
    onChange(newValue)
  }

  const handleSelectAll = () => {
    if (value.length === filteredClientes.length) {
      onChange([])
    } else {
      onChange(filteredClientes.map((c) => c.id))
    }
  }

  const handleRemoveCliente = (clienteId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter((id) => id !== clienteId))
  }

  const getDisplayText = () => {
    if (value.length === 0) {
      return 'Selecione clientes (opcional)'
    }
    if (value.length === 1) {
      const cliente = clientes.find((c) => c.id === value[0])
      return cliente?.nome || '1 cliente selecionado'
    }
    return `${value.length} clientes selecionados`
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className='w-full justify-between px-4 py-6 shadow-inner drop-shadow-xl'
        >
          <div className='flex flex-1 flex-wrap gap-1 overflow-hidden'>
            {selectedClientes.length === 0 ? (
              <span className='text-muted-foreground'>{getDisplayText()}</span>
            ) : (
              <div className='flex flex-1 flex-wrap gap-1'>
                {selectedClientes.slice(0, 2).map((cliente) => (
                  <span
                    key={cliente.id}
                    className='inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-xs'
                  >
                    {cliente.nome}
                    <span
                      role='button'
                      tabIndex={0}
                      onClick={(e) => handleRemoveCliente(cliente.id, e)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleRemoveCliente(cliente.id, e as any)
                        }
                      }}
                      className='ml-1 rounded-full hover:bg-primary/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1'
                    >
                      <X className='h-3 w-3' />
                    </span>
                  </span>
                ))}
                {selectedClientes.length > 2 && (
                  <span className='text-xs text-muted-foreground'>
                    +{selectedClientes.length - 2} mais
                  </span>
                )}
              </div>
            )}
          </div>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[400px] p-0' align='start'>
        <div className='flex flex-col'>
          <div className='border-b p-2'>
            <Input
              placeholder='Pesquisar clientes...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='h-9'
            />
          </div>
          <div className='max-h-[300px] overflow-y-auto p-2'>
            {isLoading ? (
              <div className='py-6 text-center text-sm text-muted-foreground'>
                A carregar clientes...
              </div>
            ) : clientes.length === 0 ? (
              <div className='py-6 text-center text-sm text-muted-foreground'>
                Nenhum cliente com licença para esta aplicação
              </div>
            ) : filteredClientes.length === 0 ? (
              <div className='py-6 text-center text-sm text-muted-foreground'>
                Nenhum cliente encontrado
              </div>
            ) : (
              <>
                <div className='mb-2 flex items-center justify-between border-b pb-2'>
                  <button
                    type='button'
                    onClick={handleSelectAll}
                    className='text-sm text-primary hover:underline'
                  >
                    {value.length === filteredClientes.length
                      ? 'Desmarcar todos'
                      : 'Selecionar todos'}
                  </button>
                  <span className='text-xs text-muted-foreground'>
                    {filteredClientes.length} cliente(s)
                  </span>
                </div>
                <div className='space-y-1'>
                  {filteredClientes.map((cliente) => {
                    const isSelected = value.includes(cliente.id)
                    return (
                      <div
                        key={cliente.id}
                        className={cn(
                          'flex items-center space-x-2 rounded-md p-2 hover:bg-accent cursor-pointer',
                          isSelected && 'bg-accent'
                        )}
                        onClick={() => handleToggleCliente(cliente.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            handleToggleCliente(cliente.id)
                          }
                        />
                        <label
                          className='flex-1 cursor-pointer text-sm'
                          onClick={(e) => e.stopPropagation()}
                        >
                          {cliente.nome}
                          {cliente.sigla && (
                            <span className='ml-2 text-xs text-muted-foreground'>
                              ({cliente.sigla})
                            </span>
                          )}
                        </label>
                        {isSelected && (
                          <Check className='h-4 w-4 text-primary' />
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
          {value.length > 0 && (
            <div className='border-t p-2'>
              <div className='flex items-center justify-between text-xs text-muted-foreground'>
                <span>{value.length} cliente(s) selecionado(s)</span>
                <button
                  type='button'
                  onClick={() => onChange([])}
                  className='text-primary hover:underline'
                >
                  Limpar seleção
                </button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
