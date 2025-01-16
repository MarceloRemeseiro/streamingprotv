import type { Event, StreamConfig, Prisma } from "@prisma/client"

// Tema
export interface Theme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  logoUrl: string | null
}

// Evento con relaciones
export type EventWithRelations = Event & {
  theme: Prisma.JsonValue & Theme | null
  streamConfig: StreamConfig | null
}

// Props para componentes de UI comunes
export interface EventStatusPillProps {
  isActive: boolean
  theme?: {
    secondaryColor?: string
    textColor?: string
  } | null
}

// Tipos para la gestión de usuarios
export type User = {
  id: string
  name: string | null
  email: string | null
  event: {
    id: string
    name: string
  } | null
}

// O mejor aún, usar el tipo de Prisma directamente
export type UserWithEvent = {
  id: string
  name: string | null
  email: string
  event: {
    id: string
    name: string
    title: string | null
    subtitle: string | null
    description: string | null
    isActive: boolean
    theme: Prisma.JsonValue & Theme | null
  } | null
}

export type StreamProvider = 'CLOUDFLARE' | 'YOUTUBE'
export type StreamMode = 'iframe' | 'hls' | 'dash' 

// Props para componentes de UI comunes
export interface NavHeaderProps {
  logo?: string
  theme?: Partial<Theme> | null
} 