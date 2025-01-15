import { EventList } from "./components/event-list"
import { CreateEventButton } from "./components/create-event-button"

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Eventos</h2>
        <CreateEventButton />
      </div>
      <EventList />
    </div>
  )
} 