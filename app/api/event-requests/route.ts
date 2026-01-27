import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Проверяем, что prisma инициализирован при загрузке модуля
console.log('Загрузка модуля event-requests, prisma:', typeof prisma, !!prisma, prisma ? 'OK' : 'UNDEFINED')
if (!prisma) {
  console.error('CRITICAL: Prisma client не инициализирован при загрузке модуля!')
  throw new Error('Prisma Client не инициализирован')
}

// GET - Получить запросы на участие в событии
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const userId = searchParams.get('userId')

    if (!eventId && !userId) {
      return NextResponse.json(
        { error: 'Missing eventId or userId' },
        { status: 400 }
      )
    }

    // Если userId указан, загружаем запросы где пользователь либо запросивший, либо организатор события
    const whereClause: any = {}
    
    if (eventId) {
      whereClause.eventId = eventId
    } else if (userId) {
      // Загружаем запросы, где пользователь либо запросивший, либо организатор события
      whereClause.OR = [
        { requesterId: userId },
        {
          event: {
            userId: userId,
          },
        },
      ]
    }

    const requests = await prisma.eventRequest.findMany({
      where: whereClause,
      include: {
        event: {
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
              },
            },
          },
        },
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching event requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event requests' },
      { status: 500 }
    )
  }
}

// POST - Создать запрос на участие
export async function POST(request: NextRequest) {
  try {
    console.log('=== Создание запроса на участие ===')
    
    // Проверяем, что prisma инициализирован
    if (!prisma) {
      console.error('Prisma client не инициализирован')
      return NextResponse.json(
        { error: 'Database error: Prisma not initialized' },
        { status: 500 }
      )
    }
    
    const body = await request.json()
    console.log('Получены данные:', { 
      eventId: body.eventId, 
      requesterId: body.requesterId,
      eventIdType: typeof body.eventId,
      requesterIdType: typeof body.requesterId,
      bodyKeys: Object.keys(body)
    })
    const { eventId, requesterId } = body

    if (!eventId || !requesterId) {
      console.error('Отсутствуют обязательные поля:', {
        hasEventId: !!eventId,
        hasRequesterId: !!requesterId,
        eventIdValue: eventId,
        requesterIdValue: requesterId
      })
      return NextResponse.json(
        { error: 'Missing required fields', details: { hasEventId: !!eventId, hasRequesterId: !!requesterId } },
        { status: 400 }
      )
    }

    // Проверяем, что событие существует
    console.log('Проверяем prisma перед запросом события:', typeof prisma, !!prisma?.event)
    if (!prisma || !prisma.event) {
      console.error('Prisma или prisma.event не определен')
      return NextResponse.json(
        { error: 'Database error: Prisma not initialized' },
        { status: 500 }
      )
    }
    
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        user: true, // Организатор события
        location: true,
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Проверяем, что пользователь не является организатором
    if (event.userId === requesterId) {
      return NextResponse.json(
        { error: 'You cannot request to join your own event' },
        { status: 400 }
      )
    }

    // Проверяем, что запрос еще не существует
    const existingRequest = await prisma.eventRequest.findUnique({
      where: {
        eventId_requesterId: {
          eventId,
          requesterId,
        },
      },
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Request already exists' },
        { status: 400 }
      )
    }

    // Создаем запрос
    const eventRequest = await prisma.eventRequest.create({
      data: {
        eventId,
        requesterId,
        status: 'pending',
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            avatar: true,
          },
        },
        event: {
          include: {
            user: true,
            location: true,
          },
        },
      },
    })

    // Находим технический аккаунт SELS
    if (!prisma) {
      console.error('Prisma client не инициализирован')
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }
    
    let selsBot = await prisma.user.findUnique({
      where: { email: 'sels@system.com' },
    })

    if (!selsBot) {
      console.error('SELS bot account not found by email, trying username')
      selsBot = await prisma.user.findUnique({
        where: { username: 'sels_support' },
      })
    }

    if (!selsBot) {
      console.error('SELS bot account not found')
      // Все равно возвращаем успех, но без сообщения
      return NextResponse.json(eventRequest, { status: 201 })
    }

    console.log('SELS bot found:', selsBot.id, selsBot.email)

    // Создаем или находим беседу между организатором и SELS ботом
    // Проверяем, есть ли уже беседа с обоими участниками
    const existingConversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { userId: event.userId },
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    })

    let conversation = existingConversations.find((conv) => {
      const participantIds = conv.participants.map((p) => p.userId)
      return participantIds.includes(event.userId) && participantIds.includes(selsBot.id)
    })

    if (!conversation) {
      console.log('Создаем новую беседу между организатором и SELS ботом')
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [
              { userId: event.userId },
              { userId: selsBot.id },
            ],
          },
        },
        include: {
          participants: {
            include: {
              user: true,
            },
          },
        },
      })
      console.log('Беседа создана:', conversation.id)
    } else {
      console.log('Найдена существующая беседа:', conversation.id)
    }

    // Формируем сообщение от SELS бота
    const requester = eventRequest.requester
    const messageContent = `Пользователь ${requester.firstName} ${requester.lastName} (@${requester.username}) хочет присоединиться к вашему событию:

📅 ${event.title}
📆 Дата: ${event.date}
⏰ Время: ${event.timeStart} - ${event.timeEnd}
📍 Место: ${event.location.name}

Запрос ID: ${eventRequest.id}`

    console.log('Отправляем сообщение от SELS бота:', {
      conversationId: conversation.id,
      senderId: selsBot.id,
      receiverId: event.userId,
      content: messageContent.substring(0, 100) + '...',
    })

    // Создаем сообщение от SELS бота организатору
    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: selsBot.id,
        receiverId: event.userId,
        content: messageContent,
        images: [],
      },
    })

    console.log('Сообщение создано:', message.id)

    // Обновляем время обновления беседы
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    })

    console.log('Беседа обновлена')

    return NextResponse.json(eventRequest, { status: 201 })
  } catch (error: any) {
    console.error('Error creating event request:', error)
    console.error('Error stack:', error?.stack)
    console.error('Error details:', {
      message: error?.message,
      name: error?.name,
      code: error?.code,
    })
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create event request',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      },
      { status: 500 }
    )
  }
}
