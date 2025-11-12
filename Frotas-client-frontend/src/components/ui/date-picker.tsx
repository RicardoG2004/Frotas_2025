import * as React from 'react'
import { format, addYears, subYears, getYear } from 'date-fns'
import { pt } from 'date-fns/locale'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DatePickerProps {
  value?: Date
  onChange?: (date?: Date) => void
  placeholder?: string
  className?: string
  minYear?: number
  maxYear?: number
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
  (
    { value, onChange, placeholder, className, minYear = 1900, maxYear = 2100 },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [currentMonth, setCurrentMonth] = React.useState<Date>(
      value || new Date()
    )

    const handleClose = React.useCallback(() => {
      setOpen(false)
    }, [])

    const handleYearChange = (year: string) => {
      const newYear = parseInt(year)
      const newMonth = new Date(currentMonth)
      newMonth.setFullYear(newYear)
      setCurrentMonth(newMonth)
    }

    const handleYearNavigation = (direction: 'prev' | 'next') => {
      const newMonth =
        direction === 'prev'
          ? subYears(currentMonth, 1)
          : addYears(currentMonth, 1)
      setCurrentMonth(newMonth)
    }

    // Generate year options for the dropdown
    const yearOptions = React.useMemo(() => {
      const years = []
      for (let year = maxYear; year >= minYear; year--) {
        years.push(year)
      }
      return years
    }, [minYear, maxYear])

    return (
      <div ref={ref}>
        <Popover open={open} onOpenChange={setOpen}>
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
            onEscapeKeyDown={handleClose}
          >
            {/* Year Navigation Header */}
            <div className='flex items-center justify-between p-3 border-b'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleYearNavigation('prev')}
                className='h-8 w-8 p-0'
              >
                <ChevronLeft className='h-4 w-4' />
              </Button>

              <Select
                value={getYear(currentMonth).toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className='w-24 h-8'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='max-h-60'>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleYearNavigation('next')}
                className='h-8 w-8 p-0'
              >
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>

            <Calendar
              mode='single'
              selected={value}
              onSelect={(date) => {
                onChange?.(date)
                handleClose()
              }}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
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
