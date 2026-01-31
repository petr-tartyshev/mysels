import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET all locations (с фильтрацией по isPublic)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicOnly = searchParams.get('public') === 'true' // Только публичные локации для карты

    const locations = await prisma.location.findMany({
      where: {
        ...(publicOnly ? { isPublic: true } : {}), // Если public=true, показываем только публичные
      },
      include: {
        events: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
        _count: {
          select: {
            posts: true,
            events: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(locations)
  } catch (error) {
    console.error('Error fetching locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}

// POST - Create new location (только для авторизованных пользователей)
export async function POST(request: NextRequest) {
  try {
    // Получаем userId из cookies
    const userId = request.cookies.get('userId')?.value

    if (!userId) {
      return NextResponse.json(
        { error: 'Необходима авторизация для создания локации' },
        { status: 401 }
      )
    }

    // Проверяем, что пользователь существует
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, lat, lng, address, cost, type, isPublic } = body

    // Validation
    if (!name || lat === undefined || lng === undefined) {
      return NextResponse.json(
        { error: 'Название, широта и долгота обязательны' },
        { status: 400 }
      )
    }

    // Валидация типа
    const validTypes = ['outdoor', 'bike', 'water', 'gym', 'regular']
    const locationType = validTypes.includes(type) ? type : 'outdoor'

    // Валидация координат
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      return NextResponse.json(
        { error: 'Координаты должны быть числами' },
        { status: 400 }
      )
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Некорректные координаты' },
        { status: 400 }
      )
    }

    const location = await prisma.location.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        lat,
        lng,
        address: address?.trim() || null,
        cost: cost || 'Бесплатно',
        rating: 0,
        image: null,
        type: locationType,
        isPublic: isPublic === true, // По умолчанию false
        userId: userId, // Кто создал локацию
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json(location, { status: 201 })
  } catch (error) {
    console.error('Error creating location:', error)
    return NextResponse.json(
      { 
        error: 'Не удалось создать локацию',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
      },
      { status: 500 }
    )
  }
}
