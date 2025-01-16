import Link from "next/link"
import { LogoutButton } from "@/components/ui/logout-button"
import { requireAdmin } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  const events = await prisma.event.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="flex-shrink-0">
                <span className="text-white font-bold">Admin Panel</span>
              </Link>
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/admin/events"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Eventos
                  </Link>
                  <Link
                    href="/admin/users"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Usuarios
                  </Link>
                  <div className="relative group">
                    <button className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Ver Players ▾
                    </button>
                    <div className="absolute left-0 w-56 mt-2 bg-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                      <div className="py-1 max-h-96 overflow-y-auto">
                        {events.map((event) => (
                          <Link
                            key={event.id}
                            href={`/player/${event.id}`}
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                            target="_blank"
                          >
                            {event.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <LogoutButton className="text-gray-300 hover:text-white" />
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
