 'use client'

interface StreamPlayerProps {
  provider: 'CLOUDFLARE' | 'YOUTUBE'
  videoId: string
  className?: string
}

export function StreamPlayer({ provider, videoId, className = "" }: StreamPlayerProps) {
  if (!videoId) return null

  const getEmbedUrl = () => {
    switch (provider) {
      case 'CLOUDFLARE':
        return `https://customer-${videoId}.cloudflarestream.com/${videoId}/iframe`
      case 'YOUTUBE':
        return `https://www.youtube.com/embed/${videoId}`
      default:
        return ''
    }
  }

  return (
    <div className={className}>
      <iframe
        src={getEmbedUrl()}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
} 