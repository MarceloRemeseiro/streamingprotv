import ThemeEditor from './theme-editor'

export default function EventThemePage({ params }: { params: { id: string } }) {
  return <ThemeEditor eventId={params.id} />
} 