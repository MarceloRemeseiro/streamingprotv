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
        console.log('Eventos cargados:', data)
        setEvents(data)
      } catch (error) {
        console.error('Error en la carga de eventos:', error)
        setError('Error al cargar los eventos')
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-12 text-center">
        <p className="text-sm text-gray-400">Cargando eventos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-12 text-center">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-12 text-center">
        <h3 className="mt-2 text-sm font-semibold text-white">No hay eventos</h3>
        <p className="mt-1 text-sm text-gray-400">
          Comienza creando tu primer evento.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800">
      <table className="min-w-full divide-y divide-gray-700">
        <thead>
          <tr>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
              Nombre
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
              Código
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
              Estado
            </th>
            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {events.map((event: any) => (
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