import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Definir el tipo para los eventos
type Event = {
  id: string;
  name: string;
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const events = (await prisma.event.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })) as Event[];

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/admin">
                  <span className="text-white font-bold">Admin Panel</span>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
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
                    <div className="absolute -left-4 -right-4 h-4 bg-transparent" />
                    <div
                      className="absolute left-0 mt-0 w-56 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 ease-in-out"
                      style={{
                        transform: "translateY(8px)",
                        transitionProperty: "opacity, visibility, transform",
                      }}
                    >
                      <div
                        className="py-1 max-h-96 overflow-y-auto"
                        role="menu"
                      >
                        {events.map((event) => (
                          <Link
                            key={event.id}
                            href={`/player/${event.id}`}
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                            role="menuitem"
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
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
