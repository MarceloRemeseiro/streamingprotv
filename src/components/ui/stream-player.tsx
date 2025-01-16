'use client'

import { useEffect, useRef, useCallback } from 'react'
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

  const getStreamUrl = useCallback(() => {
    if (provider === 'YOUTUBE') {
      return `https://www.youtube.com/embed/${videoId}`
    }
    return videoId
  }, [provider, videoId])

  useEffect(() => {
    const url = getStreamUrl()
    
    if (provider === 'CLOUDFLARE' && mode === 'hls' && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls()
        hls.attachMedia(videoRef.current)
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(url)
        })
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = url
      }
    }
  }, [provider, videoId, mode, getStreamUrl])

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