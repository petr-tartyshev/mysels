import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Проверка подключения к базе данных
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL не настроен')
      return NextResponse.json(
        { error: 'Ошибка конфигурации сервера' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const rawEmail = typeof body.email === 'string' ? body.email : ''
    const rawPassword = typeof body.password === 'string' ? body.password : ''
    const rawFirstName = typeof body.firstName === 'string' ? body.firstName : ''
    const rawLastName = typeof body.lastName === 'string' ? body.lastName : ''
    const rawUsername = typeof body.username === 'string' ? body.username : ''

    const email = rawEmail.trim().toLowerCase()
    const password = rawPassword
    const firstName = rawFirstName.trim()
    const lastName = rawLastName.trim()
    const username = rawUsername.trim()

    // Валидация
    if (!email || !password || !firstName || !lastName || !username) {
      return NextResponse.json(
        { error: 'Email, пароль, имя, фамилия и username обязательны' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Пароль должен быть не менее 6 символов' },
        { status: 400 }
      )
    }

    // Проверить, существует ли пользователь
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: {
              equals: email,
              mode: 'insensitive',
            },
          },
          {
            username: {
              equals: username,
              mode: 'insensitive',
            },
          },
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email или username уже существует' },
        { status: 409 }
      )
    }

    // Хешировать пароль
    const hashedPassword = await bcrypt.hash(password, 10)

    // Создать пользователя
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        username,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    })

    // Создать сессию
    const response = NextResponse.json({
      success: true,
      user,
    })

    // Установить cookie
    response.cookies.set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    response.cookies.set('username', user.username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('Ошибка регистрации:', error)
    
    // Детальная информация об ошибке для отладки
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('Детали ошибки:', {
      message: errorMessage,
      stack: errorStack,
      error: error,
    })
    
    // В production не показываем детали ошибки пользователю
    // Но логируем для отладки
    return NextResponse.json(
      { 
        error: 'Ошибка сервера',
        // В development показываем детали
        ...(process.env.NODE_ENV === 'development' && {
          details: errorMessage,
        }),
      },
      { status: 500 }
    )
  }
}
