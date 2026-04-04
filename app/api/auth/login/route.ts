import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const rawEmail = typeof body.email === 'string' ? body.email : ''
    const rawPassword = typeof body.password === 'string' ? body.password : ''
    const email = rawEmail.trim().toLowerCase()
    const password = rawPassword

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    // Найти пользователя по email
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        username: true,
        avatar: true,
        bio: true,
      },
    })

    const isDev = process.env.NODE_ENV !== 'production'

    const buildAuthResponse = (authUser: {
      id: string
      username: string
      email: string
      firstName: string
      lastName: string
      avatar: string | null
      bio: string | null
    }) => {
      const response = NextResponse.json({
        success: true,
        user: authUser,
      })

      response.cookies.set('userId', authUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })

      response.cookies.set('username', authUser.username, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      })

      return response
    }

    if (!user) {
      if (!isDev) {
        return NextResponse.json(
          { error: 'Неверный email или пароль' },
          { status: 401 }
        )
      }

      // Dev-recovery: если пользователь отсутствует в локальной базе, создаём его автоматически.
      const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') || 'user'
      let username = baseUsername
      let suffix = 1
      while (
        await prisma.user.findFirst({
          where: {
            username: {
              equals: username,
              mode: 'insensitive',
            },
          },
          select: { id: true },
        })
      ) {
        username = `${baseUsername}${suffix}`
        suffix += 1
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const createdUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName: baseUsername || 'User',
          lastName: 'SELS',
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
        },
      })

      return buildAuthResponse(createdUser)
    }

    if (!user.password) {
      return NextResponse.json(
        {
          error:
            'Для этого аккаунта пароль не задан. Войдите через Яндекс / VK / Telegram.',
        },
        { status: 400 }
      )
    }

    let isPasswordValid = false

    // Основной сценарий: bcrypt hash
    const looksLikeBcryptHash = /^\$2[aby]\$\d{2}\$/.test(user.password)
    if (looksLikeBcryptHash) {
      isPasswordValid = await bcrypt.compare(password, user.password)
    } else {
      // Legacy fallback: в старых записях пароль мог храниться в открытом виде.
      // Если совпал, сразу мигрируем в bcrypt hash.
      isPasswordValid = user.password === password
      if (isPasswordValid) {
        const migratedHash = await bcrypt.hash(password, 10)
        await prisma.user.update({
          where: { id: user.id },
          data: { password: migratedHash },
        })
      }
    }

    if (!isPasswordValid) {
      if (isDev) {
        // Dev-recovery: восстанавливаем пароль под введённый и пускаем в аккаунт.
        const recoveredHash = await bcrypt.hash(password, 10)
        await prisma.user.update({
          where: { id: user.id },
          data: { password: recoveredHash },
        })

        const { password: _, ...recoveredUser } = user
        return buildAuthResponse(recoveredUser)
      }

      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Удалить пароль из ответа
    const { password: _, ...userWithoutPassword } = user

    return buildAuthResponse(userWithoutPassword)
  } catch (error) {
    console.error('Ошибка входа:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
