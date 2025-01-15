import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const sortField = searchParams.get('sortField') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    const eventId = searchParams.get('eventId')

    // Construir el query
    const where = eventId ? { eventId } : {}
    const orderBy = { [sortField]: sortOrder }

    // Obtener total de usuarios
    const total = await prisma.user.count({ where })

    // Obtener usuarios paginados
    const users = await prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        email: true,
        event: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
} 