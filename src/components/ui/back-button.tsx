'use client'

import { useRouter } from 'next/navigation'
import { CSSProperties } from 'react'

interface BackButtonProps {
  className?: string
  style?: CSSProperties
}

export function BackButton({ className = "", style }: BackButtonProps) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className={className}
      style={style}
    >
      ← Volver
    </button>
  )
} 