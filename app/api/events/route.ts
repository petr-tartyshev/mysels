import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const maxDuration = 30 // Увеличиваем время выполнения до 30 секунд

// GET all events or events for a location/user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId')
    const userId = searchParams.get('userId')

    const events = await prisma.event.findMany({
      where: {
        ...(locationId && { locationId }),
        ...(userId && { userId }),
      },
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
        location: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Получены данные события:', {
      title: body.title,
      description: body.description,
      imagesCount: Array.isArray(body.images) ? body.images.length : 0,
      locationId: body.locationId,
      userId: body.userId,
      date: body.date,
      timeStart: body.timeStart,
      timeEnd: body.timeEnd,
      capacity: body.capacity,
      level: body.level,
    })

    const {
      title,
      description,
      images,
      locationId,
      userId,
      date,
      timeStart,
      timeEnd,
      capacity,
      level,
    } = body

    // Validation - проверяем наличие всех обязательных полей
    const missingFields: string[] = []
    if (!title || !title.trim()) missingFields.push('title')
    if (!locationId || !locationId.trim()) missingFields.push('locationId')
    if (!userId || !userId.trim()) missingFields.push('userId')
    if (!date || !date.trim()) missingFields.push('date')
    if (!timeStart || !timeStart.trim()) missingFields.push('timeStart')
    if (!timeEnd || !timeEnd.trim()) missingFields.push('timeEnd')
    if (capacity === undefined || capacity === null || capacity === '') missingFields.push('capacity')

    if (missingFields.length > 0) {
      console.error('Отсутствуют обязательные поля:', missingFields, {
        title: !!title,
        locationId: !!locationId,
        userId: !!userId,
        date: !!date,
        timeStart: !!timeStart,
        timeEnd: !!timeEnd,
        capacity: capacity,
        capacityType: typeof capacity,
      })
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          missingFields: missingFields,
          details: {
            title: !!title,
            locationId: !!locationId,
            userId: !!userId,
            date: !!date,
            timeStart: !!timeStart,
            timeEnd: !!timeEnd,
            capacity: capacity,
          }
        },
        { status: 400 }
      )
    }

    // Валидация и очистка данных
    // Проверяем, что images - это массив строк с валидными data URL
    let cleanImages: string[] = []
    if (Array.isArray(images)) {
      cleanImages = images
        .filter((img: any) => {
          if (!img || typeof img !== 'string' || img.length === 0) return false
          // Проверяем, что это валидный data URL для изображения
          const isValidDataUrl = /^data:image\/(jpeg|jpg|png|gif|webp|bmp);base64,/.test(img.trim())
          if (!isValidDataUrl) {
            console.warn('Пропущено невалидное изображение на сервере:', img.substring(0, 50) + '...')
            return false
          }
          return true
        })
        .map((img: string) => img.trim())
    }
    
    // Убеждаемся, что description - это строка или null
    const cleanDescription = description && typeof description === 'string' && description.trim().length > 0 
      ? description.trim() 
      : null

    // Валидация типов данных
    const cleanTitle = String(title).trim()
    const cleanDate = String(date).trim()
    const cleanTimeStart = String(timeStart).trim()
    const cleanTimeEnd = String(timeEnd).trim()
    const cleanLocationId = String(locationId).trim()
    const cleanUserId = String(userId).trim()
    const cleanCapacity = parseInt(String(capacity), 10)

    if (isNaN(cleanCapacity) || cleanCapacity <= 0) {
      return NextResponse.json(
        { error: 'Invalid capacity value' },
        { status: 400 }
      )
    }

    // Убеждаемся, что program - это массив строк
    const cleanProgram: string[] = []

    const eventData = {
      title: cleanTitle,
      description: cleanDescription,
      images: cleanImages, // String[]
      program: cleanProgram, // String[]
      date: cleanDate,
      timeStart: cleanTimeStart,
      timeEnd: cleanTimeEnd,
      locationId: cleanLocationId,
      userId: cleanUserId,
      capacity: cleanCapacity, // Int?
      level: level && ['новичок', 'любитель', 'профи'].includes(level.toLowerCase()) ? level.toLowerCase() : null,
      participants: 0, // Int
    }

    console.log('Данные для создания события в Prisma:', {
      title: eventData.title,
      description: eventData.description,
      imagesCount: eventData.images.length,
      programCount: eventData.program.length,
      date: eventData.date,
      timeStart: eventData.timeStart,
      timeEnd: eventData.timeEnd,
      locationId: eventData.locationId,
      userId: eventData.userId,
      capacity: eventData.capacity,
      level: eventData.level,
      participants: eventData.participants,
    })

    // Проверяем, что locationId и userId существуют в БД
    const locationExists = await prisma.location.findUnique({
      where: { id: cleanLocationId },
    })
    if (!locationExists) {
      console.error(`Локация не найдена: ${cleanLocationId}`)
      // Проверяем, есть ли вообще локации в базе
      const allLocations = await prisma.location.findMany({ take: 5 })
      console.error(`Доступные локации в БД (первые 5):`, allLocations.map(l => ({ id: l.id, name: l.name })))
      return NextResponse.json(
        { error: `Локация не найдена. Пожалуйста, выберите другую локацию или создайте новую.` },
        { status: 400 }
      )
    }

    const userExists = await prisma.user.findUnique({
      where: { id: cleanUserId },
    })
    if (!userExists) {
      return NextResponse.json(
        { error: `User with id ${cleanUserId} not found` },
        { status: 400 }
      )
    }

    // Создаем событие
    const event = await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        images: eventData.images, // Явно указываем поле images
        program: eventData.program,
        date: eventData.date,
        timeStart: eventData.timeStart,
        timeEnd: eventData.timeEnd,
        locationId: eventData.locationId,
        userId: eventData.userId,
        capacity: eventData.capacity,
        level: eventData.level,
        participants: eventData.participants,
      },
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
        location: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error: any) {
    console.error('Error creating event:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    })
    
    // Если это ошибка Prisma, выводим более детальную информацию
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'Нарушение уникальности данных', details: error.meta },
        { status: 400 }
      )
    }
    
    if (error?.code === 'P2003') {
      const field = error?.meta?.field_name || 'неизвестное поле'
      return NextResponse.json(
        { error: `Локация или пользователь не найдены. Поле: ${field}` },
        { status: 400 }
      )
    }

    // Ошибка подключения к базе данных
    if (error?.code === 'P1001' || error?.message?.includes('Can\'t reach database')) {
      return NextResponse.json(
        { error: 'Ошибка подключения к базе данных. Попробуйте позже.' },
        { status: 503 }
      )
    }

    const errorMessage = error?.message || (error instanceof Error ? error.message : 'Не удалось создать событие')
    
    // В production не показываем детали ошибки, но логируем
    return NextResponse.json(
      { 
        error: process.env.NODE_ENV === 'development' ? errorMessage : 'Не удалось создать событие. Проверьте все поля и попробуйте снова.',
        ...(process.env.NODE_ENV === 'development' && {
          details: error?.stack,
          code: error?.code,
        }),
      },
      { status: 500 }
    )
  }
}
