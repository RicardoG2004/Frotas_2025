import { GSResponse } from '@/types'
import { UtilizadorDTO } from '@/types/dtos'
import { ResponseApi } from '@/types/responses'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProfileHeaderProps {
  profileData?: ResponseApi<GSResponse<UtilizadorDTO>>
}

export default function ProfileHeader({ profileData }: ProfileHeaderProps) {
  const initials = profileData?.info?.data?.firstName
    ? `${profileData.info.data.firstName[0]}${profileData.info.data.lastName[0]}`
    : ''

  return (
    <div className='mb-8 flex items-center gap-8'>
      <Avatar className='h-16 w-16'>
        <AvatarImage src='' alt={profileData?.info?.data?.firstName || ''} />
        <AvatarFallback className='bg-primary text-primary-foreground text-lg font-semibold'>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className='text-2xl font-bold'>
          {profileData?.info?.data?.firstName}{' '}
          {profileData?.info?.data?.lastName}
        </h2>
        <p className='text-muted-foreground'>
          {profileData?.info?.data?.email}
        </p>
      </div>
    </div>
  )
}
