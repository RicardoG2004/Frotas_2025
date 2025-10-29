import * as React from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
  value?: Date
  onChange?: (date?: Date) => void
  placeholder?: string
  className?: string
}

const DatePickerButton = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithoutRef<typeof Button>, 'value'> & {
    value?: Date | null
    placeholder?: string
  }
>(({ className, value, placeholder, ...props }, ref) => (
  <Button
    ref={ref}
    type='button'
    variant='outline'
    className={cn(
      'w-full justify-start px-4 py-6 text-left font-normal shadow-inner',
      !value && 'text-muted-foreground',
      className
    )}
    {...props}
  >
    <CalendarIcon className='mr-2 h-4 w-4' />
    {value
      ? format(value, 'PPP', { locale: pt })
      : placeholder || 'Selecione uma data'}
  </Button>
))
DatePickerButton.displayName = 'DatePickerButton'

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  ({ value, onChange, placeholder, className }, ref) => {
    const [open, setOpen] = React.useState(false)

    const handleClose = React.useCallback(() => {
      setOpen(false)
    }, [])

    return (
      <div ref={ref}>
        <Popover open={open} onOpenChange={setOpen} modal={true}>
          <PopoverTrigger asChild>
            <DatePickerButton
              value={value as Date | null}
              placeholder={placeholder}
              className={className}
              aria-expanded={open}
            />
          </PopoverTrigger>
          <PopoverContent
            className='w-auto p-0'
            align='start'
            side='bottom'
            sideOffset={4}
            onInteractOutside={(e) => {
              e.preventDefault()
            }}
            onEscapeKeyDown={handleClose}
          >
            <Calendar
              mode='single'
              selected={value}
              onSelect={(date) => {
                onChange?.(date)
                handleClose()
              }}
              defaultMonth={value}
              initialFocus
              locale={pt}
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)
DatePicker.displayName = 'DatePicker'
