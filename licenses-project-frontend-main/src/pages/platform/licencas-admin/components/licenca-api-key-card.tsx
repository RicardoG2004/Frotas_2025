import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface LicencaApiKeyCardProps {
  apiKey: string
}

export function LicencaApiKeyCard({ apiKey }: LicencaApiKeyCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)
      toast.success('API Key copiada para a área de transferência')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Erro ao copiar API Key')
    }
  }

  return (
    <Card>
      <div className='p-4'>
        <h3 className='text-sm font-medium mb-2'>API Key</h3>
        <div className='flex items-center gap-2'>
          <code className='flex-1 bg-muted p-2 rounded-md text-xs break-all'>
            {apiKey || 'Nenhuma API key disponível'}
          </code>
          <Button
            variant='outline'
            size='sm'
            onClick={copyToClipboard}
            className='shrink-0'
          >
            {copied ? (
              <Check className='h-4 w-4 text-green-500' />
            ) : (
              <Copy className='h-4 w-4' />
            )}
            <span className='sr-only'>Copiar API Key</span>
          </Button>
        </div>
      </div>
    </Card>
  )
}
