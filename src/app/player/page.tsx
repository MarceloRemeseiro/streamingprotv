import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { LogoutButton } from "@/components/ui/logout-button"

export default async function PlayerPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
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
      style={{ backgroundColor: event.theme?.backgroundColor || '#111827' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => window.history.back()}
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: event.theme?.secondaryColor || '#9CA3AF' }}
          >
            ← Volver
          </button>
          <LogoutButton 
            className="hover:opacity-80 transition-opacity"
            style={{ color: event.theme?.secondaryColor || '#9CA3AF' }}
          />
        </div>
        <div 
          className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden"
          style={{ backgroundColor: event.theme?.secondaryColor || '#1F2937' }}
        >
          <div className="flex items-center justify-center">
            <h1 
              className="text-2xl font-bold"
              style={{ color: event.theme?.primaryColor || '#ffffff' }}
            >
              {event.name}
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
} 