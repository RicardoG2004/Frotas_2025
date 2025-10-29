import { cn } from '@/lib/utils'
import { handleApiError } from '@/utils/error-handlers'
import { getErrorMessage } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { roleConfig } from '@/constants/roles'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { ColoredBadge } from '@/components/shared/colored-badge'
import { useUpdateLicencaUtilizadores } from '../queries/licencas-admin-mutations'
import { useGetLicencaUtilizadoresRoleClient } from '../queries/licencas-admin-queries'

interface LicencaUtilizadoresListProps {
  licencaId: string
}

export function LicencaUtilizadoresList({
  licencaId,
}: LicencaUtilizadoresListProps) {
  console.log('LicencaUtilizadoresList - licencaId:', licencaId)

  const {
    data: utilizadoresResponse,
    isLoading,
    error,
  } = useGetLicencaUtilizadoresRoleClient(licencaId)

  const updateLicencaMutation = useUpdateLicencaUtilizadores()
  const utilizadores = utilizadoresResponse?.info?.data || []

  const handleToggleUser = async (userId: string, currentActive: boolean) => {
    if (!licencaId) return

    const updatedUsers = utilizadores
      .filter((u) => u.utilizador.id)
      .map((u) => ({
        utilizadorId: u.utilizador.id!,
        ativo: u.utilizador.id === userId ? !currentActive : u.ativo,
      }))

    try {
      const response = await updateLicencaMutation.mutateAsync({
        licencaId,
        data: updatedUsers,
      })

      if (response.info.succeeded) {
        toast.success('Utilizadores atualizados com sucesso')
      } else {
        toast.error(getErrorMessage(response, 'Erro ao atualizar utilizadores'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao atualizar utilizadores'))
    }
  }

  if (isLoading) {
    return (
      <div className='space-y-4 p-6'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='flex items-center justify-between'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-[200px]' />
              <Skeleton className='h-3 w-[150px]' />
            </div>
            <Skeleton className='h-6 w-10' />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    console.error('LicencaUtilizadoresList - Error:', error)
    return <div className='p-6 text-destructive'>Error loading users</div>
  }

  if (!utilizadores.length) {
    return <div className='p-6 text-muted-foreground'>No users found</div>
  }

  return (
    <div className='space-y-2 p-2 sm:space-y-4 sm:p-6'>
      {utilizadores.map((utilizador) => {
        const role = (utilizador.utilizador.roleId?.toLowerCase() ||
          'client') as keyof typeof roleConfig
        const fullName = [
          utilizador.utilizador.firstName,
          utilizador.utilizador.lastName,
        ]
          .filter(Boolean)
          .join(' ')
        const initials = fullName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()

        return (
          <div
            key={utilizador.utilizador.id}
            className='flex flex-row items-center justify-between rounded-lg border bg-card p-2 sm:p-4 shadow-sm transition-all hover:shadow-md cursor-pointer gap-2 sm:gap-4'
            onClick={() =>
              utilizador.utilizador.id &&
              handleToggleUser(utilizador.utilizador.id, utilizador.ativo)
            }
          >
            <div className='flex items-center space-x-2 sm:space-x-4 min-w-0'>
              <div className='relative shrink-0'>
                <Avatar className='h-8 w-8 sm:h-12 sm:w-12'>
                  <AvatarImage
                    src=''
                    alt={fullName}
                    className='aspect-square h-full w-full object-cover'
                  />
                  <AvatarFallback className='bg-primary'>
                    <span className='text-xs sm:text-sm font-medium text-primary-foreground'>
                      {initials}
                    </span>
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-4 sm:w-4 rounded-full border-2 border-background',
                    utilizador.ativo ? 'bg-green-500' : 'bg-muted'
                  )}
                />
              </div>
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-1.5 mb-0.5'>
                  <Label className='text-xs sm:text-base font-medium truncate'>
                    {fullName}
                  </Label>
                  <ColoredBadge
                    label={roleConfig[role].label}
                    color={roleConfig[role].color}
                    size='xs'
                  />
                </div>
                <span className='text-[10px] sm:text-xs text-muted-foreground truncate block'>
                  {utilizador.utilizador.email}
                </span>
              </div>
            </div>
            <Switch
              checked={utilizador.ativo}
              onCheckedChange={() =>
                handleToggleUser(utilizador.utilizador.id!, utilizador.ativo)
              }
              className='data-[state=checked]:bg-primary shrink-0'
              aria-label='Toggle user activation'
            />
          </div>
        )
      })}
    </div>
  )
}
