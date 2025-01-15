'use client'

import { useEffect, useRef } from 'react'

interface StreamPlayerProps {
  url: string
  className?: string
}

export function StreamPlayer({ url, className = "" }: StreamPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Extraer la URL del src del iframe usando DOMParser
    const parser = new DOMParser()
    const doc = parser.parseFromString(url, 'text/html')
    const iframe = doc.querySelector('iframe')
    
    if (!iframe) return

    // Crear un nuevo iframe con los atributos seguros
    const safeIframe = document.createElement('iframe')
    safeIframe.src = iframe.src
    safeIframe.className = 'w-full h-full'
    safeIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
    safeIframe.allowFullscreen = true
    safeIframe.style.border = 'none'

    // Limpiar y añadir el iframe seguro
    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(safeIframe)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [url])

  return <div ref={containerRef} className={className} />
} 