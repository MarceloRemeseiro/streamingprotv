'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { CreateEventForm } from './create-event-form'
import { useRouter } from 'next/navigation'

export function CreateEventButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleEventCreated = () => {
    router.refresh() // Esto forzará una recarga de los datos del servidor
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Crear Evento
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear nuevo evento"
      >
        <CreateEventForm 
          onClose={() => setIsModalOpen(false)} 
          onEventCreated={handleEventCreated}
        />
      </Modal>
    </>
  )
} 