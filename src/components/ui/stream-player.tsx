'use client'

import { useEffect, useRef } from 'react'
import Hls from 'hls.js'
import Script from 'next/script'

interface StreamPlayerProps {
  provider: 'CLOUDFLARE' | 'YOUTUBE'
  videoId: string
  className?: string
  mode: string
}

export function StreamPlayer({ provider, videoId, className, mode }: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const getStreamUrl = () => {
    if (provider === 'YOUTUBE') {
      const youtubeId = videoId.includes('youtube.com') 
        ? videoId.split('v=')[1]?.split('&')[0] 
        : videoId
      return `https://www.youtube.com/embed/${youtubeId}`
    }

    const matches = videoId.match(/(.*?cloudflarestream\.com\/[^\/]+)/)
    const baseUrl = matches ? matches[1] : videoId

    if (mode === 'iframe') {
      return `${baseUrl}/iframe`
    }
    
    return mode === 'dash'
      ? `${baseUrl}/manifest/video.mpd`
      : `${baseUrl}/manifest/video.m3u8`
  }

  useEffect(() => {
    if (provider === 'CLOUDFLARE' && mode === 'hls' && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        })
        
        hls.attachMedia(videoRef.current)
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(getStreamUrl())
        })

        return () => {
          hls.destroy()
        }
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Para Safari que tiene soporte nativo de HLS
        videoRef.current.src = getStreamUrl()
      }
    }
  }, [provider, videoId, mode])

  // Renderizar iframe para YouTube o Cloudflare en modo iframe
  if (mode === 'iframe' || provider === 'YOUTUBE') {
    return (
      <div className={className}>
        <iframe
          className={`absolute top-0 left-0 w-full h-full ${className}`}
          src={getStreamUrl()}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
        />
      </div>
    )
  }

  // Renderizar player DASH
  if (mode === 'dash') {
    return (
      <>
        <Script src="https://cdn.dashjs.org/latest/dash.all.min.js" />
        <video
          className={className}
          data-dashjs-player
          src={getStreamUrl()}
          controls
          autoPlay
          playsInline
          muted
        />
      </>
    )
  }

  // Renderizar player HLS
  return (
    <video
      ref={videoRef}
      className={className}
      controls
      autoPlay
      playsInline
      muted
    />
  )
} 