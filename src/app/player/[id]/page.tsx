import { requireAuth } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { StreamPlayer } from "@/components/ui/stream-player"
import { NavHeader } from "@/components/ui/nav-header"
import type { EventWithRelations } from "@/types"

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PlayerPage({ params }: PageProps) {
  const { id } = await params
  const session = await requireAuth()

  if (!session.user.email) {
    redirect('/login')
  }

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      streamConfig: true
    }
  }) as EventWithRelations | null

  if (!event) {
    redirect('/')
  }

  const user = await prisma.user.findUnique({
    where: { 
      email: session.user.email,
      eventId: id
    }
  })

  if (!user && session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: event.theme?.backgroundColor || '#111827' }}
    >
      <NavHeader 
        logo={event.theme?.logoUrl || undefined}
        theme={event.theme}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
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
              mode={event.streamConfig.mode}
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

        
      </div>
    </div>
  )
} 