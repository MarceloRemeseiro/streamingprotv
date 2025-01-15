'use client'

import { signOut } from 'next-auth/react'

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
    >
      Cerrar sesión
    </button>
  )
} 