import React from 'react'
import { useGetSepulturasSelect } from '@/pages/cemiterios/sepulturas/queries/sepulturas-queries'
import { useGetTalhoesSelect } from '@/pages/cemiterios/talhoes/queries/talhoes-queries'
import { useGetZonasSelect } from '@/pages/cemiterios/zonas/queries/zonas-queries'
import { Copy, ClipboardPaste } from 'lucide-react'
import { HexColorPicker } from 'react-colorful'
import { Autocomplete } from '@/components/ui/autocomplete'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type ShapeType = 'Zona' | 'Talhão' | 'Sepultura'

interface NamingDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  isEditing: boolean
  newName: string
  setNewName: (name: string) => void
  currentFillColor: string
  currentBorderColor: string
  onFillColorChange: (color: string) => void
  onBorderColorChange: (color: string) => void
  lineType: 'solid' | 'dashed' | 'dotted'
  setLineType: (type: 'solid' | 'dashed' | 'dotted') => void
  lineHeight: number
  setLineHeight: (height: number) => void
  shapeType: ShapeType
  setShapeType: (type: ShapeType) => void
  relationId?: string
  setRelationId: (id: string) => void
  scale: number
  setScale: (scale: number) => void
  fillOpacity?: number
  onFillOpacityChange?: (opacity: number) => void
  textColor?: string
  onTextColorChange?: (color: string) => void
  showBorderColor: boolean
  setShowBorderColor: (show: boolean) => void
}

export function NamingDialog({
  isOpen,
  onClose,
  onSave,
  isEditing,
  newName,
  setNewName,
  currentFillColor,
  currentBorderColor,
  onFillColorChange,
  onBorderColorChange,
  lineType,
  setLineType,
  lineHeight,
  setLineHeight,
  shapeType,
  setShapeType,
  relationId,
  setRelationId,
  scale,
  setScale,
  fillOpacity = 0.2,
  onFillOpacityChange,
  textColor,
  onTextColorChange,
  showBorderColor,
  setShowBorderColor,
}: NamingDialogProps) {
  const { data: zonasData, isLoading: isLoadingZonas } = useGetZonasSelect()
  const { data: talhoesData, isLoading: isLoadingTalhoes } =
    useGetTalhoesSelect()
  const { data: sepulturasData, isLoading: isLoadingSepulturas } =
    useGetSepulturasSelect()
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null)
  const [activeColorTab, setActiveColorTab] = React.useState('fill')

  const sortedZonas =
    zonasData?.slice().sort((a, b) => a.nome.localeCompare(b.nome)) || []
  const sortedTalhoes =
    talhoesData?.slice().sort((a, b) => a.nome.localeCompare(b.nome)) || []
  const sortedSepulturas =
    sepulturasData?.slice().sort((a, b) => a.nome.localeCompare(b.nome)) || []

  const handleCopyColor = (color: string) => {
    setCopiedColor(color)
  }

  const handlePasteColor = () => {
    if (copiedColor) {
      if (activeColorTab === 'fill') {
        onFillColorChange(copiedColor)
        if (!showBorderColor) {
          onBorderColorChange(copiedColor)
        }
      } else if (activeColorTab === 'border') {
        onBorderColorChange(copiedColor)
      }
    }
  }

  const handleFillColorChange = (color: string) => {
    onFillColorChange(color)
    if (!showBorderColor) {
      onBorderColorChange(color)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
      <DialogContent className='z-[9999] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-2xl w-full'>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Forma' : 'Nomear Nova Forma'}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='grid grid-cols-2 gap-4'>
            {/* Left Column */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Nome</Label>
                <Input
                  id='name'
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder='Digite o nome'
                />
              </div>

              <div className='space-y-2'>
                <Label>Tipo</Label>
                <Select
                  value={shapeType}
                  onValueChange={(value: ShapeType) => {
                    setShapeType(value)
                    setRelationId('')
                  }}
                >
                  <SelectTrigger className='w-full h-10 px-4 py-2 bg-background border border-input rounded-md shadow-sm'>
                    <SelectValue placeholder='Selecione o tipo' />
                  </SelectTrigger>
                  <SelectContent className='z-[10000]'>
                    <SelectItem value='Zona'>Zona</SelectItem>
                    <SelectItem value='Talhão'>Talhão</SelectItem>
                    <SelectItem value='Sepultura'>Sepultura</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {shapeType === 'Zona' && (
                <div className='space-y-2'>
                  <Label>Selecionar Zona Existente</Label>
                  <Autocomplete
                    options={sortedZonas.map((zona) => ({
                      value: zona.id || '',
                      label: zona.nome,
                    }))}
                    value={relationId || ''}
                    onValueChange={(value) => {
                      if (value) {
                        const selectedZona = sortedZonas.find(
                          (z) => z.id === value
                        )
                        if (selectedZona) {
                          setNewName(selectedZona.nome)
                          setRelationId(selectedZona.id || '')
                        }
                      } else {
                        setRelationId('')
                        setNewName('')
                      }
                    }}
                    placeholder={
                      isLoadingZonas ? 'A carregar...' : 'Selecione uma zona'
                    }
                    emptyText='Nenhuma zona encontrada.'
                    disabled={isLoadingZonas}
                    className='px-4 py-6 shadow-inner drop-shadow-xl'
                  />
                </div>
              )}

              {shapeType === 'Talhão' && (
                <div className='space-y-2'>
                  <Label>Selecionar Talhão Existente</Label>
                  <Autocomplete
                    options={sortedTalhoes.map((talhao) => ({
                      value: talhao.id || '',
                      label: talhao.nome,
                    }))}
                    value={relationId || ''}
                    onValueChange={(value) => {
                      if (value) {
                        const selectedTalhao = sortedTalhoes.find(
                          (t) => t.id === value
                        )
                        if (selectedTalhao) {
                          setNewName(selectedTalhao.nome)
                          setRelationId(selectedTalhao.id || '')
                        }
                      } else {
                        setRelationId('')
                        setNewName('')
                      }
                    }}
                    placeholder={
                      isLoadingTalhoes ? 'A carregar...' : 'Selecione um talhão'
                    }
                    emptyText='Nenhum talhão encontrado.'
                    disabled={isLoadingTalhoes}
                    className='px-4 py-6 shadow-inner drop-shadow-xl'
                  />
                </div>
              )}

              {shapeType === 'Sepultura' && (
                <div className='space-y-2'>
                  <Label>Selecionar Sepultura Existente</Label>
                  <Autocomplete
                    options={sortedSepulturas.map((sepultura) => ({
                      value: sepultura.id || '',
                      label: sepultura.nome,
                    }))}
                    value={relationId || ''}
                    onValueChange={(value) => {
                      if (value) {
                        const selectedSepultura = sortedSepulturas.find(
                          (s) => s.id === value
                        )
                        if (selectedSepultura) {
                          setNewName(selectedSepultura.nome)
                          setRelationId(selectedSepultura.id || '')
                        }
                      } else {
                        setRelationId('')
                        setNewName('')
                      }
                    }}
                    placeholder={
                      isLoadingSepulturas
                        ? 'A carregar...'
                        : 'Selecione uma sepultura'
                    }
                    emptyText='Nenhuma sepultura encontrada.'
                    disabled={isLoadingSepulturas}
                    className='px-4 py-6 shadow-inner drop-shadow-xl'
                  />
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <Label>Cores</Label>
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleCopyColor(currentFillColor)}
                      className='h-8 w-8'
                    >
                      <Copy className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={handlePasteColor}
                      className='h-8 w-8'
                      disabled={!copiedColor}
                    >
                      <ClipboardPaste className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
                <Tabs value={activeColorTab} onValueChange={setActiveColorTab}>
                  <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value='fill'>Preencher</TabsTrigger>
                    <TabsTrigger value='border' disabled={!showBorderColor}>
                      Borda
                    </TabsTrigger>
                    <TabsTrigger value='text'>Texto</TabsTrigger>
                  </TabsList>
                  <TabsContent value='fill' className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-8 h-8 rounded border'
                        style={{ backgroundColor: currentFillColor }}
                      />
                      <HexColorPicker
                        color={currentFillColor}
                        onChange={handleFillColorChange}
                      />
                    </div>
                    <div className='space-y-2 mt-4'>
                      <Label>Transparência do Preenchimento</Label>
                      <Slider
                        value={[fillOpacity * 100]}
                        onValueChange={(value) =>
                          onFillOpacityChange?.(value[0] / 100)
                        }
                        min={0}
                        max={100}
                        step={1}
                      />
                      <div className='text-sm text-muted-foreground text-right'>
                        {Math.round(fillOpacity * 100)}%
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value='border' className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-8 h-8 rounded border'
                        style={{ backgroundColor: currentBorderColor }}
                      />
                      <HexColorPicker
                        color={currentBorderColor}
                        onChange={onBorderColorChange}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value='text' className='space-y-2'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-8 h-8 rounded border'
                        style={{
                          backgroundColor: textColor || currentFillColor,
                        }}
                      />
                      <HexColorPicker
                        color={textColor || currentFillColor}
                        onChange={onTextColorChange || (() => {})}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
                <div className='flex items-center space-x-2 mt-2'>
                  <Switch
                    id='show-border-color'
                    checked={showBorderColor}
                    onCheckedChange={(checked) => {
                      setShowBorderColor(checked)
                      if (!checked) {
                        onBorderColorChange(currentFillColor)
                        setActiveColorTab('fill')
                      } else {
                        setActiveColorTab('border')
                      }
                    }}
                  />
                  <Label htmlFor='show-border-color'>
                    Cor da Borda Diferente
                  </Label>
                </div>
              </div>

              <div className='space-y-2'>
                <Label>Tipo de Linha</Label>
                <Select
                  value={lineType}
                  onValueChange={(value: 'solid' | 'dashed' | 'dotted') =>
                    setLineType(value)
                  }
                >
                  <SelectTrigger className='w-full h-10 px-4 py-2 bg-background border border-input rounded-md shadow-sm'>
                    <SelectValue placeholder='Selecione o tipo de linha' />
                  </SelectTrigger>
                  <SelectContent className='z-[10000]'>
                    <SelectItem value='solid'>Sólida</SelectItem>
                    <SelectItem value='dashed'>Tracejada</SelectItem>
                    <SelectItem value='dotted'>Pontilhada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Espessura da Linha</Label>
                <div className='flex items-center space-x-2'>
                  <Slider
                    value={[lineHeight]}
                    onValueChange={(value) => setLineHeight(value[0])}
                    min={0.1}
                    max={10}
                    step={0.1}
                    className='w-full'
                  />
                  <span className='text-sm w-12 text-right'>
                    {lineHeight.toFixed(1)}px
                  </span>
                </div>
              </div>

              {isEditing && (
                <div className='space-y-2'>
                  <Label>Escala</Label>
                  <div className='flex items-center space-x-2'>
                    <Slider
                      value={[scale]}
                      onValueChange={(value) => setScale(value[0])}
                      min={0.01}
                      max={5}
                      step={0.01}
                      className='w-full'
                    />
                    <div className='flex items-center space-x-2'>
                      <Input
                        type='number'
                        value={scale}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value)
                          if (!isNaN(value) && value >= 0.01 && value <= 5) {
                            setScale(value)
                          }
                        }}
                        min={0.01}
                        max={5}
                        step={0.01}
                        className='w-20'
                      />
                      <span className='text-sm'>x</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
