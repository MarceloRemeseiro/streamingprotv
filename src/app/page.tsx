import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { LogoutButton } from "@/components/ui/logout-button"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Si es admin, redirigir al panel de admin
  if (session.user.role === 'ADMIN') {
    redirect('/admin')
  }

  // Obtener el evento del usuario
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      event: true
    }
  })

  if (!user?.event) {
    return <div>No tienes acceso a ningún evento</div>
  }

  const { event } = user

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: event.theme?.backgroundColor || '#f3f4f6' }}
    >
      <header className="shadow" style={{ backgroundColor: event.theme?.secondaryColor || '#ffffff' }}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 
              className="text-3xl font-bold"
              style={{ color: event.theme?.primaryColor || '#111827' }}
            >
              {event.title || `Bienvenido a ${event.name}`}
            </h1>
            <LogoutButton 
              className="hover:opacity-80 transition-opacity"
              style={{ color: event.theme?.textColor || '#4B5563' }}
            />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div 
          className="overflow-hidden shadow rounded-lg"
          style={{ backgroundColor: event.theme?.secondaryColor || '#ffffff' }}
        >
          <div className="px-4 py-5 sm:p-6">
            <h2 
              className="text-lg font-medium mb-2"
              style={{ color: event.theme?.primaryColor || '#111827' }}
            >
              {event.subtitle || 'Tu evento está listo'}
            </h2>
            <div className="mt-3">
              <p style={{ color: event.theme?.textColor || '#6B7280' }}>
                {event.description || 'Accede al streaming del evento cuando esté disponible.'}
              </p>
            </div>
            <div className="mt-5">
              <a
                href={`/player/${event.id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm hover:opacity-90 transition-opacity"
                style={{ 
                  backgroundColor: event.theme?.primaryColor || '#4F46E5',
                  color: event.theme?.secondaryColor || '#ffffff'
                }}
              >
                Ir al streaming
              </a>
            </div>
          </div>
        </div>

        {/* Estado del evento */}
        <div 
          className="mt-6 p-4 rounded-lg"
          style={{ backgroundColor: event.theme?.secondaryColor || '#ffffff', opacity: 0.9 }}
        >
          <div className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: event.isActive ? '#10B981' : '#EF4444',
                boxShadow: event.isActive ? '0 0 12px #10B981' : 'none'
              }}
            />
            <p style={{ color: event.theme?.textColor || '#6B7280' }}>
              {event.isActive ? 'Evento activo' : 'Evento no iniciado'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
