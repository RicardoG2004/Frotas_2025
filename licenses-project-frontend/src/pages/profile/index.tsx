import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PasswordForm from './components/profile-forms/password-form'
import ProfileForm from './components/profile-forms/profile-form'
import ProfileHeader from './components/profile-header'
import ProfileMap from './components/profile-map'
import { useGetProfile } from './queries/profile-queries'

export default function ProfilePage() {
  const { data: profileData, isLoading: isProfileLoading } = useGetProfile()

  if (isProfileLoading) {
    return (
      <div className='container max-w-7xl space-y-6 py-10'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-[200px]' />
          <Skeleton className='h-4 w-[300px]' />
        </div>
        <div className='rounded-lg bg-card/50 p-6 shadow-sm backdrop-blur-sm'>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-[140px]' />
            <div className='space-y-4'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className='h-full'>
      <div className='container max-w-7xl space-y-6 p-10'>
        <ProfileHeader profileData={profileData} />

        <Tabs defaultValue='general' className='space-y-6'>
          <TabsList>
            <TabsTrigger value='general' className='flex-1'>
              Geral
            </TabsTrigger>
            <TabsTrigger value='security' className='flex-1'>
              Segurança
            </TabsTrigger>
            <TabsTrigger value='map' className='flex-1'>
              Mapa
            </TabsTrigger>
          </TabsList>

          <TabsContent value='general'>
            <div className='rounded-lg bg-card/50 p-6 shadow-sm backdrop-blur-sm'>
              <div className='mb-6'>
                <h3 className='text-lg font-semibold'>Informações do Perfil</h3>
                <p className='text-sm text-muted-foreground'>
                  Atualize suas informações pessoais e dados de contato
                </p>
              </div>
              <ProfileForm
                profileData={profileData}
                isLoading={isProfileLoading}
              />
            </div>
          </TabsContent>

          <TabsContent value='security'>
            <div className='rounded-lg bg-card/50 p-6 shadow-sm backdrop-blur-sm'>
              <div className='mb-6'>
                <h3 className='text-lg font-semibold'>Alterar palavra-passe</h3>
                <p className='text-sm text-muted-foreground'>
                  Atualize a sua palavra-passe para manter sua conta segura
                </p>
              </div>
              <PasswordForm />
            </div>
          </TabsContent>

          <TabsContent value='map'>
            <div className='rounded-lg bg-card/50 p-6 shadow-sm backdrop-blur-sm'>
              <div className='mb-6'>
                <h3 className='text-lg font-semibold'>Localização</h3>
                <p className='text-sm text-muted-foreground'>
                  Visualize e atualize sua localização no mapa
                </p>
              </div>
              <ProfileMap />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}
