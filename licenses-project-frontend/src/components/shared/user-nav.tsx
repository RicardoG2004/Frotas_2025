import { useRouter } from '@/routes/hooks'
import { useAuthStore } from '@/stores/auth-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function UserNav() {
  const router = useRouter()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const name = useAuthStore((state) => state.name)
  const email = useAuthStore((state) => state.email)

  const initials = name
    ? `${name.split(' ')[0][0]}${name.split(' ')[1]?.[0] || ''}`
    : ''

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-14 w-14 rounded-full'>
          <Avatar className='h-14 w-14'>
            <AvatarImage
              src=''
              alt={name || ''}
              className='aspect-square h-full w-full object-cover'
            />
            <AvatarFallback className='flex h-full w-full items-center justify-center'>
              <div className='flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground text-md font-semibold'>
                {initials}
              </div>
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{name || 'User'}</p>
            <p className='text-xs leading-none text-muted-foreground'>
              {email || 'user@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/platform/profile')}>
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            Configurações
            {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Sair
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
