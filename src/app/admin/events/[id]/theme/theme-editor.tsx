'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

type Theme = {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  logoUrl?: string
}

type EventContent = {
  title: string
  subtitle: string
  description: string
  streamUrl: string
}

export default function ThemeEditor({ eventId }: { eventId: string }) {
  const router = useRouter()
  const [theme, setTheme] = useState<Theme>({
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    backgroundColor: '#ffffff',
    textColor: '#000000'
  })
  const [content, setContent] = useState<EventContent>({
    title: '',
    subtitle: '',
    description: '',
    streamUrl: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadEvent() {
      try {
        const response = await fetch(`/api/events/${eventId}`)
        const data = await response.json()
        if (data.theme) {
          setTheme(data.theme)
        }
        setContent({
          title: data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          streamUrl: data.streamConfig?.streamUrl || ''
        })
      } catch (error) {
        console.error('Error loading event:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [eventId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          theme,
          title: content.title,
          subtitle: content.subtitle,
          description: content.description,
          streamUrl: content.streamUrl
        }),
      })

      if (!response.ok) {
        throw new Error('Error al guardar los cambios')
      }

      router.refresh()
    } catch (error) {
      console.error('Error saving:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Personalizar Tema</h2>
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Volver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Color Principal
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                className="h-8 w-8 rounded border border-gray-700"
              />
              <input
                type="text"
                value={theme.primaryColor}
                onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Color Secundario
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="color"
                value={theme.secondaryColor}
                onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                className="h-8 w-8 rounded border border-gray-700"
              />
              <input
                type="text"
                value={theme.secondaryColor}
                onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Color de Fondo
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="color"
                value={theme.backgroundColor}
                onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                className="h-8 w-8 rounded border border-gray-700"
              />
              <input
                type="text"
                value={theme.backgroundColor}
                onChange={(e) => setTheme({ ...theme, backgroundColor: e.target.value })}
                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">
              Color de Texto
            </label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="color"
                value={theme.textColor}
                onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                className="h-8 w-8 rounded border border-gray-700"
              />
              <input
                type="text"
                value={theme.textColor}
                onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
                className="block w-full rounded-md border-gray-600 bg-gray-700 text-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">
            URL del Logo
          </label>
          <input
            type="text"
            value={theme.logoUrl || ''}
            onChange={(e) => setTheme({ ...theme, logoUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
            placeholder="https://ejemplo.com/logo.png"
          />
        </div>

        <div className="border-t border-gray-700 pt-6 mt-6">
          <h3 className="text-lg font-medium text-white mb-4">Contenido del Player</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200">
                Título del Player
              </label>
              <input
                type="text"
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                placeholder="Título que aparecerá en el player"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                Subtítulo
              </label>
              <input
                type="text"
                value={content.subtitle}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                placeholder="Subtítulo del player"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                Descripción
              </label>
              <textarea
                value={content.description}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                placeholder="Texto descriptivo que aparecerá en el player"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200">
                Código del iframe
              </label>
              <textarea
                value={content.streamUrl}
                onChange={(e) => setContent({ ...content, streamUrl: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white"
                placeholder='<iframe width="560" height="315" src="https://www.youtube.com/embed/..." ...'
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>

      {/* Preview */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-white mb-4">Vista Previa</h3>
        <div
          style={{
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
            padding: '2rem',
            borderRadius: '0.5rem',
          }}
        >
          <h1 style={{ color: theme.primaryColor }}>Título de Ejemplo</h1>
          <p style={{ color: theme.textColor }}>
            Este es un texto de ejemplo para ver cómo se verán los colores en la página del evento.
          </p>
          <button
            style={{
              backgroundColor: theme.primaryColor,
              color: theme.secondaryColor,
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              border: 'none',
            }}
          >
            Botón de Ejemplo
          </button>
        </div>
      </div>
    </div>
  )
} 