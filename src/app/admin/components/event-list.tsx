'use client'

import { useEffect, useState } from "react"
import Link from "next/link"

type Event = {
  id: string
  name: string
  code: string
  isActive: boolean
  startDate: string
  endDate: string
}

export function EventList() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch('/api/events')
        if (!response.ok) throw new Error('Error cargando eventos')
        const data = await response.json()
        setEvents(data)
      } catch {
        setError('Error al cargar los eventos')
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">
              Nombre
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">
              Código
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">
              Estado
            </th>
            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {events.map((event: Event) => (
            <tr key={event.id}>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                {event.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                {event.code}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                {event.isActive ? 'Activo' : 'Inactivo'}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <Link href={`/admin/events/${event.id}/theme`}>
                  <button className="text-indigo-400 hover:text-indigo-300">
                    Editar
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 