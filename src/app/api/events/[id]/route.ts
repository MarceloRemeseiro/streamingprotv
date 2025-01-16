import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        streamConfig: true
      }
    })

    if (!event) {
      return NextResponse.json({ message: 'Evento no encontrado' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch {
    return NextResponse.json({ message: 'Error al obtener el evento' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const session = await getServerSession(authOptions)
    if (session?.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    
    const event = await prisma.event.update({
      where: { id },
      data: {
        theme: body.theme,
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        isActive: body.isActive,
        streamConfig: {
          upsert: {
            create: {
              provider: body.streamConfig.provider,
              videoId: body.streamConfig.videoId,
              mode: body.streamConfig.mode,
              isLive: false
            },
            update: {
              provider: body.streamConfig.provider,
              videoId: body.streamConfig.videoId,
              mode: body.streamConfig.mode
            },
            where: {
              eventId: id
            }
          }
        }
      },
      include: {
        streamConfig: true
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { message: 'Error al actualizar el evento' }, 
      { status: 500 }
    )
  }
} 