'use client'

import { signOut } from 'next-auth/react'
import { CSSProperties } from 'react'

interface LogoutButtonProps {
  className?: string
  style?: CSSProperties
}

export function LogoutButton({ className = "", style }: LogoutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className={`text-sm font-medium hover:text-opacity-80 transition-colors ${className}`}
      style={style}
    >
      Cerrar sesión
    </button>
  )
} 