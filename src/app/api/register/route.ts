import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    // Verificar que podemos leer el body
    let body;
    try {
      body = await req.json()
      console.log('Body recibido:', body)
    } catch (e) {
      console.error('Error al parsear el body:', e)
      return NextResponse.json(
        { message: 'Error al leer los datos de registro' },
        { status: 400 }
      )
    }

    const { name, email, password, code } = body

    // Validación de campos
    if (!name || !email || !password || !code) {
      console.log('Campos faltantes:', { name, email, password, code })
      return NextResponse.json(
        { message: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Verificar conexión con la base de datos
    try {
      await prisma.$connect()
    } catch (e) {
      console.error('Error de conexión a la base de datos:', e)
      return NextResponse.json(
        { message: 'Error de conexión a la base de datos' },
        { status: 500 }
      )
    }

    // Buscar el evento
    let event;
    try {
      event = await prisma.event.findUnique({
        where: { code }
      })
      console.log('Evento encontrado:', event)
    } catch (e) {
      console.error('Error al buscar evento:', e)
      return NextResponse.json(
        { message: 'Error al verificar el código del evento' },
        { status: 500 }
      )
    }

    if (!event) {
      return NextResponse.json(
        { message: 'Código de evento inválido' },
        { status: 400 }
      )
    }

    // Verificar si el email existe
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { message: 'El email ya está registrado' },
          { status: 400 }
        )
      }
    } catch (e) {
      console.error('Error al verificar email existente:', e)
      return NextResponse.json(
        { message: 'Error al verificar el email' },
        { status: 500 }
      )
    }

    // Crear usuario
    try {
      // Verificar que el password es una cadena válida
      if (typeof password !== 'string' || password.length === 0) {
        return NextResponse.json(
          { message: 'Contraseña inválida' },
          { status: 400 }
        )
      }

      // Generar el hash con un catch específico
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 10)
      } catch (e) {
        console.error('Error al hashear password:', e)
        return NextResponse.json(
          { message: 'Error al procesar la contraseña' },
          { status: 500 }
        )
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          eventId: event.id
        }
      })

      console.log('Usuario creado exitosamente:', {
        id: user.id,
        name: user.name,
        email: user.email
      })

      return NextResponse.json({
        message: 'Usuario registrado correctamente',
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })
    } catch (e) {
      console.error('Error al crear usuario:', e)
      return NextResponse.json(
        { message: 'Error al crear el usuario en la base de datos' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error general:', error)
    return NextResponse.json(
      { 
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
} 