import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function EpocaSelector() {
  return (
    <div className='space-y-2'>
      <Label>Opção Personalizada</Label>
      <Select disabled>
        <SelectTrigger className='w-full justify-start px-4 py-6 text-left font-normal shadow-inner'>
          <SelectValue placeholder='Funcionalidade desativada' />
        </SelectTrigger>
        <SelectContent />
      </Select>
      <p className='text-xs text-muted-foreground'>
        Mantenha este atalho para futuras configurações personalizadas.
      </p>
    </div>
  )
}
