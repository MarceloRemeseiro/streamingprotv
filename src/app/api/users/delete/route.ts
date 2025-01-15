import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { userIds } = await request.json()

    if (!Array.isArray(userIds)) {
      return NextResponse.json(
        { error: 'userIds debe ser un array' },
        { status: 400 }
      )
    }

    // Eliminar usuarios
    await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting users:', error)
    return NextResponse.json(
      { error: 'Error al eliminar usuarios' },
      { status: 500 }
    )
  }
} 