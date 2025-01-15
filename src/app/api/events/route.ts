import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const body = await req.json()
    console.log('Creando evento con datos:', body)

    const event = await prisma.event.create({
      data: {
        name: body.name,
        code: body.code,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        theme: {
          primaryColor: '#000000',
          secondaryColor: '#ffffff',
          backgroundColor: '#ffffff'
        }
      }
    })

    console.log('Evento creado:', event)
    return NextResponse.json(event)
  } catch (error) {
    console.error('Error creating event:', error)
    return new NextResponse('Error creating event', { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('Eventos encontrados:', events)
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return new NextResponse('Error fetching events', { status: 500 })
  }
} 