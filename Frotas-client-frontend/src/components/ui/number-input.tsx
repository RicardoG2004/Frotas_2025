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
    const [isHovered, setIsHovered] = React.useState(false)
    const focusRestoreRef = React.useRef<{ selectionStart: number | null; selectionEnd: number | null } | null>(null)

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

    // Restaurar foco após re-renders causados por mudanças de valor
    React.useLayoutEffect(() => {
      if (focusRestoreRef.current && inputRef.current) {
        const { selectionStart, selectionEnd } = focusRestoreRef.current
        inputRef.current.focus()
        if (selectionStart !== null && selectionEnd !== null && inputRef.current.setSelectionRange) {
          inputRef.current.setSelectionRange(selectionStart, selectionEnd)
        }
        focusRestoreRef.current = null
      }
    })

    React.useEffect(() => {
      // Se o campo está focado, não atualizar o displayValue para permitir que o utilizador escreva/apague
      const wasFocused = inputRef.current === document.activeElement
      const selectionStart = inputRef.current?.selectionStart ?? null
      const selectionEnd = inputRef.current?.selectionEnd ?? null
      
      if (wasFocused) {
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
      
      // Se estava focado antes, restaurar o foco após a atualização
      if (wasFocused) {
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.focus()
            if (selectionStart !== null && selectionEnd !== null && inputRef.current.setSelectionRange) {
              inputRef.current.setSelectionRange(selectionStart, selectionEnd)
            }
          }
        })
      }
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
          
          // Só atualizar se o valor realmente mudou para evitar re-renders desnecessários
          if (numericValue !== rounded) {
            onValueChange(rounded)
          }
          
          // Formatar o display value com 2 casas decimais se step < 1
          // Só atualizar displayValue se estiver diferente para evitar re-renders
          const newDisplayValue = step < 1 
            ? rounded.toFixed(2).replace('.', ',')
            : String(Math.round(rounded))
          
          if (displayValue !== newDisplayValue) {
            setDisplayValue(newDisplayValue)
          }
          return
        }

        if (numericValue !== undefined) {
          onValueChange(undefined)
        }
        if (displayValue !== '') {
          setDisplayValue('')
        }
      },
      [clampValue, onValueChange, step, roundToDecimals, numericValue, displayValue]
    )

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value
        const selectionStart = event.target.selectionStart
        const selectionEnd = event.target.selectionEnd

        const numberPattern = /^-?\d*(?:[.,]\d*)?$/
        if (!numberPattern.test(rawValue)) {
          // Se não corresponde ao padrão, manter o valor atual
          return
        }

        setDisplayValue(rawValue)

        const normalized = rawValue.replace(',', '.')

        if (rawValue === '' || rawValue === '-' || rawValue === '-.' || rawValue === '.') {
          // Guardar se estava focado antes de chamar onValueChange
          const wasFocused = inputRef.current === document.activeElement
          onValueChange?.(undefined)
          // SEMPRE restaurar o foco e seleção se estava focado
          if (wasFocused) {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (inputRef.current) {
                  inputRef.current.focus()
                  if (selectionStart !== null && selectionEnd !== null && inputRef.current.setSelectionRange) {
                    inputRef.current.setSelectionRange(selectionStart, selectionEnd)
                  }
                }
              })
            })
          }
          return
        }

        const parsed = Number(normalized)

        if (Number.isNaN(parsed)) {
          // Se não é um número válido mas passou o padrão, não fazer nada
          return
        }

        // Arredondar valores durante a digitação também para evitar problemas de precisão
        const rounded = step < 1 ? roundToDecimals(parsed, 2) : parsed
        
        // Guardar se estava focado ANTES de qualquer mudança
        const wasFocused = inputRef.current === document.activeElement
        const currentSelectionStart = selectionStart
        const currentSelectionEnd = selectionEnd
        
        // Só chamar onValueChange se o valor realmente mudou
        if (numericValue !== rounded && onValueChange) {
          onValueChange(rounded)
        }
        
        // Guardar informações para restaurar o foco após o re-render
        if (wasFocused) {
          focusRestoreRef.current = {
            selectionStart: currentSelectionStart,
            selectionEnd: currentSelectionEnd,
          }
        }
      },
      [step, roundToDecimals, onValueChange, numericValue]
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
        // Manter o foco no input durante a mudança de valor
        const wasFocused = inputRef.current === document.activeElement
        const selectionStart = inputRef.current?.selectionStart ?? null
        const selectionEnd = inputRef.current?.selectionEnd ?? null
        
        const current = resolveCurrentValue()
        const next = current + direction * step
        // Arredondar imediatamente após o cálculo para evitar erros de precisão
        const rounded = step < 1 ? roundToDecimals(next, 2) : next
        
        // Se o valor não mudou, não fazer nada para evitar re-renders desnecessários
        if (numericValue === rounded) {
          return
        }
        
        // Só chamar emitValue se o valor realmente mudou
        const clamped = clampValue(rounded)
        const finalValue = step < 1 ? roundToDecimals(clamped, 2) : clamped
        
        if (numericValue !== finalValue && onValueChange) {
          onValueChange(finalValue)
        }
        
        // Atualizar displayValue localmente sem causar re-render do pai
        const newDisplayValue = step < 1 
          ? finalValue.toFixed(2).replace('.', ',')
          : String(Math.round(finalValue))
        
        if (displayValue !== newDisplayValue) {
          setDisplayValue(newDisplayValue)
        }
        
        // Restaurar o foco e seleção se estava focado antes (para evitar perda de foco visual)
        if (wasFocused && inputRef.current) {
          // Usar múltiplos requestAnimationFrame para garantir que o foco é restaurado após todos os re-renders
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (inputRef.current) {
                inputRef.current.focus()
                // Restaurar a seleção se existia
                if (selectionStart !== null && selectionEnd !== null && inputRef.current.setSelectionRange) {
                  inputRef.current.setSelectionRange(selectionStart, selectionEnd)
                }
              }
            })
          })
        }
      },
      [step, roundToDecimals, clampValue, resolveCurrentValue, numericValue, displayValue, onValueChange]
    )

    const handleWheel = React.useCallback((event: React.WheelEvent<HTMLInputElement>) => {
      if (disabled) {
        onWheel?.(event)
        return
      }

      // Se o campo está focado, SEMPRE prevenir o scroll da página
      if (inputRef.current === document.activeElement) {
        event.preventDefault()
        event.stopPropagation()
        event.nativeEvent.preventDefault()
        event.nativeEvent.stopPropagation()
        event.nativeEvent.stopImmediatePropagation?.()

        // Manter o foco explicitamente antes de alterar o valor
        const wasFocused = true
        const selectionStart = inputRef.current?.selectionStart ?? null
        const selectionEnd = inputRef.current?.selectionEnd ?? null

        const direction: 1 | -1 = event.deltaY < 0 ? 1 : -1
        handleStep(direction)

        // Garantir que o foco permanece após a mudança
        requestAnimationFrame(() => {
          if (inputRef.current && wasFocused) {
            inputRef.current.focus()
            if (selectionStart !== null && selectionEnd !== null && inputRef.current.setSelectionRange) {
              inputRef.current.setSelectionRange(selectionStart, selectionEnd)
            }
          }
        })
        return // Não chamar onWheel para evitar propagação
      } else if (isHovered) {
        // Se apenas com hover, também prevenir mas só alterar valor se hover
        event.preventDefault()
        event.stopPropagation()
        event.nativeEvent.preventDefault()
        event.nativeEvent.stopPropagation()
        event.nativeEvent.stopImmediatePropagation?.()

        const direction: 1 | -1 = event.deltaY < 0 ? 1 : -1
        handleStep(direction)
        return // Não chamar onWheel para evitar propagação
      }

      onWheel?.(event)
    }, [disabled, isHovered, handleStep, onWheel])

    React.useEffect(() => {
      // Quando o campo está focado, bloquear completamente o scroll da página
      if (!isFocused || !inputRef.current) {
        return
      }

      // Guardar a posição atual do scroll
      let scrollPosition = window.scrollY || document.documentElement.scrollTop

      // Listener que bloqueia TODOS os eventos de scroll quando o campo está focado
      const preventScroll = (event: WheelEvent) => {
        // Se o campo está focado, SEMPRE prevenir scroll
        if (inputRef.current === document.activeElement) {
          // Prevenir o scroll da página
          event.preventDefault()
          event.stopPropagation()
          event.stopImmediatePropagation?.()
          
          // Forçar a posição do scroll a permanecer igual
          window.scrollTo(0, scrollPosition)
          document.documentElement.scrollTop = scrollPosition
          document.body.scrollTop = scrollPosition

          // Verificar se o evento está sobre o input ou seus elementos filhos
          const target = event.target as Node
          const path = event.composedPath ? event.composedPath() : []
          const isTargetWithinInput =
            path.length > 0
              ? path.includes(inputRef.current)
              : inputRef.current.contains(target)

          // Só alterar o valor se o evento for sobre o input
          if (isTargetWithinInput) {
            const direction: 1 | -1 = event.deltaY < 0 ? 1 : -1
            handleStep(direction)
          }
        }
      }

      // Atualizar a posição do scroll periodicamente enquanto focado
      const updateScrollPosition = () => {
        if (inputRef.current === document.activeElement) {
          scrollPosition = window.scrollY || document.documentElement.scrollTop
        }
      }

      // Listener para manter a posição do scroll fixa
      const lockScroll = () => {
        if (inputRef.current === document.activeElement) {
          window.scrollTo(0, scrollPosition)
          document.documentElement.scrollTop = scrollPosition
          document.body.scrollTop = scrollPosition
        }
      }

      // Adicionar listeners em múltiplos níveis para garantir captura
      window.addEventListener('wheel', preventScroll, { passive: false, capture: true })
      document.addEventListener('wheel', preventScroll, { passive: false, capture: true })
      document.body.addEventListener('wheel', preventScroll, { passive: false, capture: true })
      
      // Bloquear scroll via eventos de scroll
      window.addEventListener('scroll', lockScroll, { passive: false, capture: true })
      
      // Atualizar posição do scroll periodicamente
      const scrollInterval = setInterval(updateScrollPosition, 100)

      return () => {
        window.removeEventListener('wheel', preventScroll, { capture: true } as any)
        document.removeEventListener('wheel', preventScroll, { capture: true } as any)
        document.body.removeEventListener('wheel', preventScroll, { capture: true } as any)
        window.removeEventListener('scroll', lockScroll, { capture: true } as any)
        clearInterval(scrollInterval)
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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

