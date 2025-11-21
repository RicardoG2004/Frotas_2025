import * as React from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'onChange' | 'step' | 'min' | 'max'
  > {
  value?: number | null
  onValueChange?: (value?: number) => void
  step?: number
  min?: number
  max?: number
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onValueChange,
      step = 1,
      min,
      max,
      className,
      onWheel,
      onBlur,
      disabled,
      placeholder,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node

        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = node
        }
      },
      [ref]
    )

    const [displayValue, setDisplayValue] = React.useState<string>('')
    const [isFocused, setIsFocused] = React.useState(false)

    const roundToDecimals = React.useCallback(
      (value: number, decimals: number = 2) => {
        const factor = Math.pow(10, decimals)
        return Math.round(value * factor) / factor
      },
      []
    )

    const clampValue = React.useCallback(
      (nextValue: number) => {
        let result = nextValue

        // Arredondar para 2 casas decimais se step for menor que 1 (tem decimais)
        if (step < 1) {
          result = roundToDecimals(result, 2)
        }

        if (typeof min === 'number') {
          result = Math.max(min, result)
        }

        if (typeof max === 'number') {
          result = Math.min(max, result)
        }

        return result
      },
      [min, max, step, roundToDecimals]
    )

    // Tratar null e undefined como valores vazios
    const numericValue =
      typeof value === 'number' && !Number.isNaN(value) && value !== null
        ? value
        : undefined

    const isIntermediateValue = React.useCallback((raw: string) => {
      return (
        raw === '-' ||
        raw === '-.' ||
        raw === '.' ||
        raw.endsWith('.') ||
        raw.endsWith(',')
      )
    }, [])

    React.useEffect(() => {
      // Se o campo está focado, não atualizar o displayValue para permitir que o utilizador escreva/apague
      if (inputRef.current === document.activeElement) {
        return
      }

      let desired: string
      if (numericValue !== undefined && numericValue !== null) {
        // Formatar com 2 casas decimais se step < 1, caso contrário mostrar como inteiro
        if (step < 1) {
          desired = roundToDecimals(numericValue, 2).toFixed(2).replace('.', ',')
        } else {
          desired = String(Math.round(numericValue))
        }
      } else {
        desired = ''
      }

      if (displayValue === desired) {
        return
      }

      setDisplayValue(desired)
    }, [numericValue, displayValue, step, roundToDecimals])

    const emitValue = React.useCallback(
      (next: number | undefined) => {
        if (!onValueChange) {
          return
        }

        if (typeof next === 'number' && !Number.isNaN(next)) {
          const clamped = clampValue(next)
          // Garantir que o valor emitido está arredondado corretamente
          const rounded = step < 1 ? roundToDecimals(clamped, 2) : clamped
          onValueChange(rounded)
          // Formatar o display value com 2 casas decimais se step < 1
          if (step < 1) {
            setDisplayValue(rounded.toFixed(2).replace('.', ','))
          } else {
            setDisplayValue(String(Math.round(rounded)))
          }
          return
        }

        onValueChange(undefined)
        setDisplayValue('')
      },
      [clampValue, onValueChange, step, roundToDecimals]
    )

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value

        const numberPattern = /^-?\d*(?:[.,]\d*)?$/
        if (!numberPattern.test(rawValue)) {
          // Se não corresponde ao padrão, manter o valor atual
          return
        }

        setDisplayValue(rawValue)

        const normalized = rawValue.replace(',', '.')

        if (rawValue === '' || rawValue === '-' || rawValue === '-.' || rawValue === '.') {
          onValueChange?.(undefined)
          return
        }

        const parsed = Number(normalized)

        if (Number.isNaN(parsed)) {
          // Se não é um número válido mas passou o padrão, não fazer nada
          return
        }

        // Arredondar valores durante a digitação também para evitar problemas de precisão
        const rounded = step < 1 ? roundToDecimals(parsed, 2) : parsed
        onValueChange?.(rounded)
      },
      [step, roundToDecimals, onValueChange]
    )

    const handleInternalBlur = React.useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false)
        if (
          displayValue === '' ||
          displayValue === '-' ||
          displayValue === '-.' ||
          displayValue === '.'
        ) {
          emitValue(undefined)
        } else {
          const normalized = displayValue.replace(',', '.')
          const parsed = Number(normalized)

          if (!Number.isNaN(parsed)) {
            // Arredondar para 2 casas decimais antes de emitir se step < 1
            const rounded = step < 1 ? roundToDecimals(parsed, 2) : parsed
            emitValue(rounded)
          }
        }

        onBlur?.(event)
      },
      [displayValue, step, roundToDecimals, emitValue, onBlur]
    )

    const handleInternalFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(event)
    }

    const resolveCurrentValue = React.useCallback(() => {
      if (typeof numericValue === 'number') {
        return numericValue
      }

      const parsed = Number(displayValue.replace(',', '.'))
      return Number.isNaN(parsed) ? 0 : parsed
    }, [numericValue, displayValue])

    const handleStep = React.useCallback(
      (direction: 1 | -1) => {
        const current = resolveCurrentValue()
        const next = current + direction * step
        // Arredondar imediatamente após o cálculo para evitar erros de precisão
        const rounded = step < 1 ? roundToDecimals(next, 2) : next
        emitValue(rounded)
      },
      [step, roundToDecimals, emitValue, resolveCurrentValue]
    )

    const handleWheel = (event: React.WheelEvent<HTMLInputElement>) => {
      if (disabled) {
        onWheel?.(event)
        return
      }

      if (inputRef.current !== document.activeElement) {
        onWheel?.(event)
        return
      }

      event.preventDefault()
      event.stopPropagation()
      event.nativeEvent.stopImmediatePropagation?.()

      const direction: 1 | -1 = event.deltaY < 0 ? 1 : -1
      handleStep(direction)
    }

    React.useEffect(() => {
      if (!isFocused) {
        return
      }

      const listener = (event: WheelEvent) => {
        if (!inputRef.current) {
          return
        }

        const path = event.composedPath ? event.composedPath() : []

        const isTargetWithinInput =
          path.length > 0
            ? path.includes(inputRef.current)
            : inputRef.current.contains(event.target as Node)

        if (!isTargetWithinInput) {
          return
        }

        event.preventDefault()
        event.stopPropagation()
        ;(event as any).stopImmediatePropagation?.()

        const direction: 1 | -1 = event.deltaY < 0 ? 1 : -1
        handleStep(direction)
      }

      window.addEventListener('wheel', listener, { passive: false, capture: true })

      return () => {
        window.removeEventListener('wheel', listener, { capture: true } as any)
      }
    }, [handleStep, isFocused])

    const resolvedPlaceholder =
      placeholder !== undefined ? placeholder : step < 1 ? '0,00' : '0'

    return (
      <div className='relative'>
        <Input
          ref={setRefs}
          type='text'
          value={displayValue}
          onChange={handleChange}
          onWheel={handleWheel}
          onBlur={handleInternalBlur}
          onFocus={handleInternalFocus}
          className={cn('pr-12', className)}
          placeholder={resolvedPlaceholder}
          disabled={disabled}
          inputMode='decimal'
          {...props}
        />
        <div className='absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-0.5'>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
            onClick={() => handleStep(1)}
            disabled={disabled}
          >
            <ChevronUp className='h-3 w-3' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-6 w-6 rounded hover:bg-primary/10 hover:text-primary transition-colors'
            onClick={() => handleStep(-1)}
            disabled={disabled}
          >
            <ChevronDown className='h-3 w-3' />
          </Button>
        </div>
      </div>
    )
  }
)

NumberInput.displayName = 'NumberInput'

