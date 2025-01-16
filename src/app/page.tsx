import { requireAuth } from "@/lib/session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { NavHeader } from "@/components/ui/nav-header"
import Link from "next/link"
import type { UserWithEvent } from "@/types"
import { EventStatusPill } from '@/components/ui/event-status-pill'

export default async function HomePage() {
  const session = await requireAuth()

  if (session.user.role === 'ADMIN') {
    redirect('/admin')
  }

  if (!session.user.email) {
    redirect('/login')
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
  }) as UserWithEvent | null

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
        logo={event.theme?.logoUrl || undefined}
        theme={event.theme}
      />
      <main 
        className="min-h-screen relative"
        style={{ backgroundColor: event.theme?.backgroundColor || '#111827' }}
      >
        <div className="absolute top-4 right-4">
          <EventStatusPill 
            isActive={event.isActive} 
            theme={event.theme}
          />
        </div>

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
            
            {event.isActive && (
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
            )}
          </div>
        </div>
      </main>
    </>
  )
}
