import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    const event = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        streamConfig: true
      }
    })

    if (!event) {
      return NextResponse.json(
        { message: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error getting event:', error)
    return NextResponse.json(
      { message: 'Error al obtener el evento' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (session?.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    const { theme, title, subtitle, description, streamUrl } = await request.json()

    // Actualizar el evento
    const event = await prisma.event.update({
      where: { id: params.id },
      data: {
        theme,
        title,
        subtitle,
        description,
        streamConfig: {
          upsert: {
            create: {
              streamUrl,
              isLive: false
            },
            update: {
              streamUrl
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