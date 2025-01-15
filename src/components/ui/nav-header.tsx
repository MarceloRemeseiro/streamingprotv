import Link from 'next/link'
import { LogoutButton } from './logout-button'

interface NavHeaderProps {
  logo?: string
  theme?: {
    backgroundColor?: string
    secondaryColor?: string
    primaryColor?: string
    textColor?: string
  } | null
}

export function NavHeader({ logo, theme }: NavHeaderProps) {
  return (
    <nav 
      className="border-b border-gray-700"
      style={{ backgroundColor: theme?.backgroundColor || '#1F2937' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img 
                src={logo || '/logo.png'} 
                alt="Logo" 
                className="h-24 p-2 w-auto"
              />
            </Link>
          </div>
          <LogoutButton 
            className="hover:opacity-80 transition-opacity"
            style={{ color: theme?.secondaryColor || '#9CA3AF' }}
          />
        </div>
      </div>
    </nav>
  )
} 