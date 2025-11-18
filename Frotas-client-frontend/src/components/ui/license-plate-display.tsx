import { useMemo, useRef, forwardRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import LicensePlate from 'react-license-plate'
import { getPlateCode, getLicensePlateConfig } from '@/data/license-plate-configs'
import swissShieldImage from '@/assets/images/license-plate/BrasaoSuica.png'
import ukShieldImage from '@/assets/images/license-plate/BrasaoReinoUnido.png'

interface LicensePlateDisplayProps {
  countryCode: string
  plateId: string
  height?: number
  plateColor?: string
  countryCodeColor?: string
  className?: string
  editable?: boolean
  onChange?: (value: string) => void
  onBlur?: () => void
  name?: string
}

// Lista de códigos de países europeus comuns
const EUROPEAN_COUNTRIES = [
  { code: 'P', name: 'Portugal' },
  { code: 'ES', name: 'Espanha' },
  { code: 'FR', name: 'França' },
  { code: 'IT', name: 'Itália' },
  { code: 'DE', name: 'Alemanha' },
  { code: 'NL', name: 'Países Baixos' },
  { code: 'BE', name: 'Bélgica' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'IE', name: 'Irlanda' },
  { code: 'AT', name: 'Áustria' },
  { code: 'CH', name: 'Suíça' },
  { code: 'PL', name: 'Polónia' },
  { code: 'CZ', name: 'República Checa' },
  { code: 'SE', name: 'Suécia' },
  { code: 'NO', name: 'Noruega' },
  { code: 'DK', name: 'Dinamarca' },
  { code: 'FI', name: 'Finlândia' },
  { code: 'GR', name: 'Grécia' },
  { code: 'LU', name: 'Luxemburgo' },
]

export const getCountryOptions = () => {
  return EUROPEAN_COUNTRIES.map((country) => ({
    value: country.code,
    label: country.name,
  }))
}

export const LicensePlateDisplay = forwardRef<HTMLInputElement, LicensePlateDisplayProps>(({
  countryCode,
  plateId,
  height = 150,
  plateColor = '#fff',
  countryCodeColor = '#fff',
  className,
  editable = false,
  onChange,
  onBlur,
  name,
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Usa o ref externo se fornecido, senão usa o interno
  const actualRef = (ref as React.RefObject<HTMLInputElement>) || inputRef

  const plateConfig = useMemo(() => {
    if (!countryCode) return getLicensePlateConfig('PT')
    return getLicensePlateConfig(countryCode.toUpperCase().trim())
  }, [countryCode])

  const plateCode = useMemo(() => {
    if (!countryCode) return 'P'
    return getPlateCode(countryCode.toUpperCase().trim()) || countryCode.toUpperCase().trim().slice(0, 3)
  }, [countryCode])

  const normalizedCountryCode = useMemo(() => {
    return plateCode
  }, [plateCode])

  const finalPlateColor = useMemo(() => {
    return plateConfig?.plateColor || plateColor || '#fff'
  }, [plateConfig, plateColor])

  const finalTextColor = useMemo(() => {
    return plateConfig?.textColor || '#000'
  }, [plateConfig])

  const shouldHideEUFlag = useMemo(() => {
    return plateConfig?.hideEUFlag || false
  }, [plateConfig])

  // Esconde o texto cinzento do SVG quando está em modo editável
  useEffect(() => {
    if (!editable || !containerRef.current) return
    
    const hideGrayText = () => {
      if (!containerRef.current) return
      
      // Injeta CSS global para esconder o texto da matrícula
      const styleId = 'license-plate-hide-text'
      let styleElement = document.getElementById(styleId) as HTMLStyleElement
      
      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.id = styleId
        document.head.appendChild(styleElement)
      }
      
      // Esconde todos os elementos de texto do SVG exceto os que estão na faixa azul (código do país)
      // O código do país geralmente está dentro de um grupo (g) que contém a faixa azul
      styleElement.textContent = `
        [data-license-plate-editable] svg text,
        [data-license-plate-editable] svg tspan {
          opacity: 0 !important;
          visibility: hidden !important;
          display: none !important;
        }
        /* Mantém visível apenas o código do país na faixa azul (geralmente o primeiro grupo) */
        [data-license-plate-editable] svg > g:first-child text,
        [data-license-plate-editable] svg > g:first-child tspan {
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
        }
      `
      
      // Marca o container para aplicar o CSS
      containerRef.current.setAttribute('data-license-plate-editable', 'true')
      
      // Esconde diretamente os elementos de texto da matrícula
      const svgElements = containerRef.current.querySelectorAll('svg')
      svgElements.forEach((svg) => {
        // Encontra o primeiro grupo (faixa azul com código do país)
        const firstGroup = svg.querySelector('g:first-child')
        const countryCodeTexts = firstGroup ? firstGroup.querySelectorAll('text, tspan') : []
        const countryCodeTextSet = new Set(countryCodeTexts)
        
        // Esconde todos os textos exceto os do código do país
        const allTextElements = svg.querySelectorAll('text, tspan')
        allTextElements.forEach((element) => {
          if (!countryCodeTextSet.has(element)) {
            const svgElement = element as SVGTextElement | SVGTSpanElement
            svgElement.style.setProperty('opacity', '0', 'important')
            svgElement.style.setProperty('visibility', 'hidden', 'important')
            svgElement.style.setProperty('display', 'none', 'important')
          }
        })
      })
    }

    // Usa MutationObserver apenas para detectar quando o SVG é renderizado
    let timeoutId: NodeJS.Timeout | null = null
    
    const observer = new MutationObserver(() => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        hideGrayText()
      }, 50)
    })

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      })
    }

    // Aplica após delays para garantir que o SVG foi renderizado
    const timeout1 = setTimeout(hideGrayText, 50)
    const timeout2 = setTimeout(hideGrayText, 200)
    const timeout3 = setTimeout(hideGrayText, 500)
    
    return () => {
      observer.disconnect()
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [countryCode, plateId, height, normalizedCountryCode, editable])

  const isSwitzerland = useMemo(() => {
    return countryCode.toUpperCase().trim() === 'CH'
  }, [countryCode])

  const isUnitedKingdom = useMemo(() => {
    const code = countryCode.toUpperCase().trim()
    return code === 'GB' || code === 'UK'
  }, [countryCode])

  const normalizedPlateId = useMemo(() => {
    if (!plateId) return ''
    return plateId.trim()
  }, [plateId])

  // Foca no input quando clica na placa
  const handlePlateClick = () => {
    if (editable) {
      const targetRef = (ref as React.RefObject<HTMLInputElement>)?.current || inputRef.current
      if (targetRef) {
        targetRef.focus()
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  if (editable) {
    return (
      <div
        ref={containerRef}
        className={cn('relative flex items-center justify-center cursor-text', className)}
        onClick={handlePlateClick}
      >
        <div 
          className={cn('relative', shouldHideEUFlag && !isUnitedKingdom && '[&>div>div:first-child]:hidden [&>div>svg:first-child]:hidden [&>div>img:first-child]:hidden', isUnitedKingdom && '[&>div>div:first-child>svg]:hidden [&>div>div:first-child>img]:hidden [&>div>div:first-child>div>svg]:hidden [&>div>div:first-child>div>img]:hidden [&>div>div:first-child>div>div]:hidden')}
        >
          <LicensePlate
            countryCode={normalizedCountryCode}
            plateId={' '}
            height={height}
            plateColor={finalPlateColor}
            countryCodeColor={countryCodeColor}
          />
          <input
            ref={actualRef as React.RefObject<HTMLInputElement>}
            type='text'
            name={name}
            value={plateId || ''}
            onChange={handleInputChange}
            onBlur={onBlur}
            className='absolute inset-0 bg-transparent border-none outline-none cursor-text'
            style={{
              fontSize: `${height * 0.32}px`,
              paddingLeft: isSwitzerland ? `${height * 0.75}px` : isUnitedKingdom ? `${height * 0.5}px` : `${height * 0.45}px`,
              paddingRight: `${height * 0.1}px`,
              textAlign: 'center',
              letterSpacing: `${height * 0.0012}em`,
              fontWeight: 600,
              color: finalTextColor,
              caretColor: finalTextColor,
            }}
            placeholder=''
            autoComplete='off'
            spellCheck={false}
          />
        </div>
        {isSwitzerland && (
          <div
            className='absolute z-[100] pointer-events-none'
            style={{
              left: `${height * 0.12}px`,
              top: '50%',
              transform: 'translateY(-50%)',
              width: `${height * 0.42}px`,
              height: `${height * 0.42}px`,
            }}
          >
            <img
              src={swissShieldImage}
              alt='Brasão da Suíça'
              className='w-full h-full object-contain drop-shadow-sm'
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
          </div>
        )}
        {isUnitedKingdom && (
          <div
            className='absolute z-[100] pointer-events-none flex flex-col items-center justify-center'
            style={{
              left: `${height * 0.08}px`,
              top: '32%',
              transform: 'translateY(-50%)',
              width: `${height * 0.35}px`,
              height: `${height * 0.35}px`,
            }}
          >
            <img
              src={ukShieldImage}
              alt='Brasão do Reino Unido'
              className='object-contain drop-shadow-sm'
              style={{
                width: `${height * 0.3}px`,
                height: `${height * 0.3}px`,
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
          </div>
        )}
      </div>
    )
  }

  if (!normalizedPlateId) {
    return (
      <div
        className={cn('flex items-center justify-center rounded border-2 border-dashed border-muted-foreground/30', className)}
        style={{ height: `${height}px`, minWidth: `${height * 2.5}px` }}
      >
        <span className='text-sm text-muted-foreground'>Sem matrícula</span>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn('flex items-center justify-center relative', className)}>
      <div 
        className={cn('relative', shouldHideEUFlag && !isUnitedKingdom && '[&>div>div:first-child]:hidden [&>div>svg:first-child]:hidden [&>div>img:first-child]:hidden', isUnitedKingdom && '[&>div>div:first-child>svg]:hidden [&>div>div:first-child>img]:hidden [&>div>div:first-child>div>svg]:hidden [&>div>div:first-child>div>img]:hidden [&>div>div:first-child>div>div]:hidden', '[&_svg_text]:fill-black [&_svg_tspan]:fill-black [&_svg_text]:!fill-[#000] [&_svg_tspan]:!fill-[#000]')}
      >
        <LicensePlate
          countryCode={normalizedCountryCode}
          plateId={normalizedPlateId}
          height={height}
          plateColor={finalPlateColor}
          countryCodeColor={countryCodeColor}
        />
      </div>
      {isSwitzerland && (
        <div
          className='absolute z-[100] pointer-events-none'
          style={{
            left: `${height * 0.12}px`,
            top: '50%',
            transform: 'translateY(-50%)',
            width: `${height * 0.42}px`,
            height: `${height * 0.42}px`,
          }}
        >
          <img
            src={swissShieldImage}
            alt='Brasão da Suíça'
            className='w-full h-full object-contain drop-shadow-sm'
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </div>
      )}
      {isUnitedKingdom && (
        <div
          className='absolute z-[100] pointer-events-none flex flex-col items-center justify-center'
          style={{
            left: `${height * 0.08}px`,
            top: '32%',
            transform: 'translateY(-50%)',
            width: `${height * 0.35}px`,
            height: `${height * 0.35}px`,
          }}
        >
          <img
            src={ukShieldImage}
            alt='Brasão do Reino Unido'
            className='object-contain drop-shadow-sm'
            style={{
              width: `${height * 0.3}px`,
              height: `${height * 0.3}px`,
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          />
        </div>
      )}
    </div>
  )
})

LicensePlateDisplay.displayName = 'LicensePlateDisplay'
