import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { LogoutButton } from "@/components/ui/logout-button"
import { BackButton } from "@/components/ui/back-button"
import { StreamPlayer } from "@/components/ui/stream-player"

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Obtener el evento
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      streamConfig: true
    }
  })

  if (!event) {
    redirect('/')
  }

  // Verificar que el usuario tiene acceso a este evento
  const user = await prisma.user.findUnique({
    where: { 
      email: session.user.email,
      eventId: params.id
    }
  })

  // Si no es admin y no tiene acceso al evento, redirigir
  if (!user && session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: event.theme?.backgroundColor || '#111827' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <BackButton
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: event.theme?.secondaryColor || '#9CA3AF' }}
          />
          <LogoutButton 
            className="hover:opacity-80 transition-opacity"
            style={{ color: event.theme?.secondaryColor || '#9CA3AF' }}
          />
        </div>

        <div className="mb-6">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: event.theme?.primaryColor || '#ffffff' }}
          >
            {event.title || event.name}
          </h1>
          <p
            className="text-lg"
            style={{ color: event.theme?.secondaryColor || '#9CA3AF' }}
          >
            {event.subtitle || 'Streaming en vivo'}
          </p>
        </div>

        <div 
          className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg"
          style={{ backgroundColor: event.theme?.secondaryColor || '#1F2937' }}
        >
          {event.streamConfig?.videoId ? (
            <StreamPlayer 
              provider={event.streamConfig.provider} 
              videoId={event.streamConfig.videoId} 
              className="w-full h-full" 
            />
          ) : (
            <div className="flex items-center justify-center flex-col space-y-4">
              <div 
                className="text-center px-4"
                style={{ color: event.theme?.primaryColor || '#ffffff' }}
              >
                <p className="text-xl font-medium mb-2">
                  {event.description || 'Transmisión no iniciada'}
                </p>
                <p className="text-sm opacity-80">
                  El streaming comenzará cuando el administrador inicie la transmisión
                </p>
              </div>
            </div>
          )}
        </div>

        <div 
          className="mt-6 p-4 rounded-lg"
          style={{ backgroundColor: event.theme?.secondaryColor || '#1F2937', opacity: 0.9 }}
        >
          <div className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: event.isActive ? '#10B981' : '#EF4444',
                boxShadow: event.isActive ? '0 0 12px #10B981' : 'none'
              }}
            />
            <p style={{ color: event.theme?.textColor || '#9CA3AF' }}>
              {event.isActive ? 'Evento activo' : 'Evento no iniciado'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 