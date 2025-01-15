import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NavHeader } from "@/components/ui/nav-header"
import Link from "next/link"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Si es admin, redirigir al panel de admin
  if (session.user.role === 'ADMIN') {
    redirect('/admin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      event: {
        select: {
          id: true,
          name: true,
          title: true,
          subtitle: true,
          description: true,
          isActive: true,
          theme: true
        }
      }
    }
  })

  if (!user?.event) {
    return (
      <>
        <NavHeader 
          logo="/logo.png"
        />
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              No tienes acceso a ningún evento
            </h1>
            <p className="text-gray-400">
              Contacta con el administrador para obtener acceso
            </p>
          </div>
        </div>
      </>
    )
  }

  const { event } = user

  return (
    <>
      <NavHeader 
        logo={event.theme?.logoUrl || '/logo.png'}
        theme={event.theme}
      />
      <main 
        className="min-h-screen"
        style={{ backgroundColor: event.theme?.backgroundColor || '#111827' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 
              className="text-4xl font-bold mb-4"
              style={{ color: event.theme?.primaryColor || '#ffffff' }}
            >
              {event.title || event.name}
            </h1>
            {event.subtitle && (
              <p 
                className="text-xl mb-8"
                style={{ color: event.theme?.secondaryColor || '#9CA3AF' }}
              >
                {event.subtitle}
              </p>
            )}
            {event.description && (
              <p 
                className="text-lg mb-12 max-w-3xl mx-auto"
                style={{ color: event.theme?.textColor || '#D1D5DB' }}
              >
                {event.description}
              </p>
            )}
            
            <Link
              href={`/player/${event.id}`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm hover:opacity-90 transition-opacity"
              style={{ 
                backgroundColor: event.theme?.primaryColor || '#4F46E5',
                color: event.theme?.secondaryColor || '#ffffff'
              }}
            >
              Ver Streaming
            </Link>
          </div>

          <div 
            className="mt-12 max-w-lg mx-auto p-6 rounded-lg"
            style={{ backgroundColor: event.theme?.secondaryColor || '#1F2937', opacity: 0.9 }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: event.isActive ? '#10B981' : '#EF4444',
                  boxShadow: event.isActive ? '0 0 12px #10B981' : 'none'
                }}
              />
              <p style={{ color: event.theme?.textColor || '#D1D5DB' }}>
                {event.isActive ? 'Evento en vivo' : 'El evento aún no ha comenzado'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
