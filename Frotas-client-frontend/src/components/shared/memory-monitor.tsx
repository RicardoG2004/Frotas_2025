import React, { useState, useEffect } from 'react'
import { AlertTriangle, Trash2, RefreshCw, Database } from 'lucide-react'
import { useFormsStore } from '@/stores/use-forms-store'
import { usePagesStore } from '@/stores/use-pages-store'
import { useMemoryManager } from '@/utils/memory-manager'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface MemoryStats {
  formStates: number
  pageStates: number
  windowCache: number
  mapStates: number
  localStorageSize: number
  formMemoryUsage: { totalForms: number; totalSize: number }
  pageMemoryUsage: { totalPages: number; totalSize: number }
}

export const MemoryMonitor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [stats, setStats] = useState<MemoryStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { performCleanup, getMemoryStats, forceCleanup } = useMemoryManager()
  const formsStore = useFormsStore()
  const pagesStore = usePagesStore()

  const updateStats = () => {
    const memoryStats = getMemoryStats()
    const formMemoryUsage = formsStore.getMemoryUsage()
    const pageMemoryUsage = pagesStore.getMemoryUsage()

    setStats({
      ...memoryStats,
      formMemoryUsage,
      pageMemoryUsage,
    })
  }

  useEffect(() => {
    updateStats()
    const interval = setInterval(updateStats, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const handleCleanup = async () => {
    setIsLoading(true)
    try {
      await performCleanup()
      updateStats()
    } finally {
      setIsLoading(false)
    }
  }

  const handleForceCleanup = async () => {
    setIsLoading(true)
    try {
      await forceCleanup()
      updateStats()
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalMemoryUsage = () => {
    if (!stats) return 0
    return (
      stats.localStorageSize +
      stats.formMemoryUsage.totalSize / 1024 + // Convert to KB
      stats.pageMemoryUsage.totalSize / 1024
    )
  }

  const getMemoryLevel = (usage: number) => {
    if (usage < 100) return 'low'
    if (usage < 500) return 'medium'
    return 'high'
  }

  if (!isVisible) {
    return (
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsVisible(true)}
        className='fixed bottom-4 right-4 z-50'
      >
        <Database className='w-4 h-4 mr-2' />
        Memória
      </Button>
    )
  }

  if (!stats) {
    return (
      <Card className='fixed bottom-4 right-4 w-80 z-50'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-sm'>Monitor de Memória</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-center text-sm text-gray-500'>
            A carregar estatísticas de memória...
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalUsage = getTotalMemoryUsage()
  const memoryLevel = getMemoryLevel(totalUsage)

  return (
    <Card className='fixed bottom-4 right-4 w-80 z-50 max-h-96 overflow-y-auto'>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-sm flex items-center'>
            <Database className='w-4 h-4 mr-2' />
            Monitor de Memória
          </CardTitle>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsVisible(false)}
            className='h-6 w-6 p-0'
          >
            ×
          </Button>
        </div>
      </CardHeader>

      <CardContent className='space-y-3'>
        {/* Total Memory Usage */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between text-sm'>
            <span>Utilização Total</span>
            <Badge
              variant={memoryLevel === 'high' ? 'destructive' : 'secondary'}
            >
              {totalUsage.toFixed(1)} KB
            </Badge>
          </div>
          <Progress
            value={Math.min((totalUsage / 1000) * 100, 100)}
            className='h-2'
          />
        </div>

        {/* Store Statistics */}
        <div className='space-y-2 text-xs'>
          <div className='flex justify-between'>
            <span>Estados de Formulários:</span>
            <span>
              {stats.formStates} ({stats.formMemoryUsage.totalSize} bytes)
            </span>
          </div>
          <div className='flex justify-between'>
            <span>Estados de Páginas:</span>
            <span>
              {stats.pageStates} ({stats.pageMemoryUsage.totalSize} bytes)
            </span>
          </div>
          <div className='flex justify-between'>
            <span>Cache de Janelas:</span>
            <span>{stats.windowCache} itens</span>
          </div>
          <div className='flex justify-between'>
            <span>Estados de Mapas:</span>
            <span>{stats.mapStates} itens</span>
          </div>
          <div className='flex justify-between'>
            <span>LocalStorage:</span>
            <span>{stats.localStorageSize} KB</span>
          </div>
        </div>

        {/* Memory Level Alert */}
        {memoryLevel === 'high' && (
          <Alert variant='destructive' className='text-xs'>
            <AlertTriangle className='h-3 w-3' />
            <AlertDescription>
              Detetada utilização elevada de memória. Considere limpar dados não
              utilizados.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className='flex gap-2 pt-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={handleCleanup}
            disabled={isLoading}
            className='flex-1'
          >
            <RefreshCw
              className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`}
            />
            Limpar
          </Button>
          <Button
            size='sm'
            variant='destructive'
            onClick={handleForceCleanup}
            disabled={isLoading}
            className='flex-1'
          >
            <Trash2 className='w-3 h-3 mr-1' />
            Limpar Tudo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
