'use client'

interface EventStatusPillProps {
  isActive: boolean
  theme?: {
    secondaryColor?: string
    textColor?: string
  } | null
}

export function EventStatusPill({ isActive, theme }: EventStatusPillProps) {
  return (
    <div 
      className="px-3 py-1 rounded-full text-sm"
      style={{ backgroundColor: theme?.secondaryColor || '#1F2937', opacity: 0.9 }}
    >
      <div className="flex items-center space-x-2">
        <div 
          className="w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: isActive ? '#10B981' : '#EF4444',
            boxShadow: isActive ? '0 0 12px #10B981' : 'none'
          }}
        />
        <p style={{ color: theme?.textColor || '#D1D5DB' }}>
          {isActive ? 'En vivo' : 'Offline'}
        </p>
      </div>
    </div>
  )
} 