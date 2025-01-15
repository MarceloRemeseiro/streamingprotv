'use client'

import { useState } from 'react'

type EventFormData = {
  name: string
  code: string
  startDate: string
  endDate: string
}

export function CreateEventForm({ onClose, onEventCreated }: { 
  onClose: () => void
  onEventCreated?: () => void 
}) {
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    code: '',
    startDate: '',
    endDate: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Error al crear el evento')
      }

      onEventCreated?.()
      onClose()
    } catch (error) {
      setError('Error al crear el evento. Inténtalo de nuevo.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-200">
          Nombre del evento
        </label>
        <input
          type="text"
          required
          className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-200">
          Código de acceso
        </label>
        <input
          type="text"
          required
          className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
          value={formData.code}
          onChange={e => setFormData({ ...formData, code: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-200">
            Fecha inicio
          </label>
          <input
            type="datetime-local"
            required
            className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
            value={formData.startDate}
            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            Fecha fin
          </label>
          <input
            type="datetime-local"
            required
            className="mt-1 p-2 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
            value={formData.endDate}
            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Creando...' : 'Crear'}
        </button>
      </div>
    </form>
  )
} 