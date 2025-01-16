import Link from 'next/link'
import Image from 'next/image'
import { LogoutButton } from './logout-button'
import { NavHeaderProps } from '@/types'

export function NavHeader({ logo = '/logo.png', theme }: NavHeaderProps) {
  return (
    <nav 
      className="border-b border-gray-700"
      style={{ backgroundColor: theme?.backgroundColor || '#1F2937' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image 
                src={logo} 
                alt="Logo" 
                width={96}
                height={96}
                className="h-24 p-2 w-auto"
                priority
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