import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH - Принять или отклонить запрос на участие
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, userId } = body // userId - это ID пользователя, который принимает/отклоняет запрос

    if (!status || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "accepted" or "rejected"' },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      )
    }

    // Получаем запрос с информацией о событии и пользователях
    const eventRequest = await prisma.eventRequest.findUnique({
      where: { id },
      include: {
        event: {
          include: {
            user: true, // Организатор
            location: true,
          },
        },
        requester: true, // Тот, кто отправил запрос
      },
    })

    if (!eventRequest) {
      return NextResponse.json(
        { error: 'Event request not found' },
        { status: 404 }
      )
    }

    // Проверяем, что пользователь является организатором события
    if (eventRequest.event.userId !== userId) {
      return NextResponse.json(
        { error: 'Only event organizer can accept/reject requests' },
        { status: 403 }
      )
    }

    // Обновляем статус запроса
    const updatedRequest = await prisma.eventRequest.update({
      where: { id },
      data: { status },
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

    // Если запрос принят, увеличиваем количество участников
    if (status === 'accepted') {
      await prisma.event.update({
        where: { id: eventRequest.eventId },
        data: {
          participants: {
            increment: 1,
          },
        },
      })

      // ВАЖНО: НЕ создаем беседу между пользователями автоматически!
      // Беседа будет создана ТОЛЬКО при отправке первого сообщения
      // после того, как пользователь нажал "Написать" в чате с SELS Support
      console.log('Запрос принят. Беседа между пользователями НЕ создается автоматически.')
      console.log('Беседа будет создана ТОЛЬКО при отправке первого сообщения после нажатия "Написать"')
      
      // Убеждаемся, что беседа между пользователями НЕ создается
      // Проверяем, что нет беседы между организатором и запросившим
      const existingUserConversation = await prisma.conversation.findFirst({
        where: {
          AND: [
            {
              participants: {
                some: { userId: eventRequest.event.userId },
              },
            },
            {
              participants: {
                some: { userId: eventRequest.requesterId },
              },
            },
          ],
        },
      })
      
      if (existingUserConversation) {
        console.warn('⚠️  ВНИМАНИЕ: Найдена существующая беседа между пользователями! Это не должно происходить автоматически.')
        console.warn('Беседа ID:', existingUserConversation.id)
      } else {
        console.log('✅ Подтверждено: беседа между пользователями не существует (как и должно быть)')
      }
    }

    // Находим или создаем технический аккаунт SELS
    let selsBot = await prisma.user.findUnique({
      where: { email: 'sels@system.com' },
    })

    if (!selsBot) {
      selsBot = await prisma.user.findUnique({
        where: { username: 'sels_support' },
      })
    }

    // Если аккаунт не найден, создаем его
    if (!selsBot) {
      console.log('SELS bot account not found, creating new one...')
      try {
        const bcrypt = require('bcryptjs')
        const hashedPassword = await bcrypt.hash('system_password_' + Date.now(), 10)
        
        selsBot = await prisma.user.create({
          data: {
            email: 'sels@system.com',
            password: hashedPassword,
            firstName: 'SELS',
            lastName: 'Support',
            username: 'sels_support',
            avatar: 'https://ui-avatars.com/api/?name=SELS&background=2F80ED&color=fff',
            bio: 'Технический аккаунт платформы SELS. Отправляет системные уведомления и сообщения.',
          },
        })
        console.log('SELS bot account created:', selsBot.id, selsBot.email)
      } catch (createError: any) {
        console.error('Error creating SELS bot account:', createError)
        // Если не удалось создать, возвращаем успех без сообщения
        return NextResponse.json(updatedRequest, { status: 200 })
      }
    }

    // Создаем или находим беседу между запросившим пользователем и SELS ботом
    // Используем точный поиск с AND условием для обоих участников
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: { userId: eventRequest.requesterId },
            },
          },
          {
            participants: {
              some: { userId: selsBot.id },
            },
          },
        ],
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    })

    if (!conversation) {
      console.log('Создаем новую беседу между запросившим пользователем и SELS ботом', {
        requesterId: eventRequest.requesterId,
        selsBotId: selsBot.id,
      })
      try {
        conversation = await prisma.conversation.create({
          data: {
            participants: {
              create: [
                { userId: eventRequest.requesterId },
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
      } catch (createError: any) {
        console.error('Ошибка создания беседы:', createError)
        // Продолжаем выполнение
      }
    } else {
      console.log('Найдена существующая беседа:', conversation.id)
    }

    // Формируем сообщение от SELS бота запросившему пользователю
    const organizer = eventRequest.event.user
    const emoji = status === 'accepted' ? '✅' : '❌'
    const statusText = status === 'accepted' ? 'принят' : 'отклонен'
    
    const messageContent = `${emoji} Запрос на участие ${statusText}

Пользователь ${organizer.firstName} ${organizer.lastName} (@${organizer.username}) ${status === 'accepted' ? 'принял' : 'отклонил'} ваш запрос на участие в событии:

📅 ${eventRequest.event.title}
📆 Дата: ${eventRequest.event.date}
⏰ Время: ${eventRequest.event.timeStart} - ${eventRequest.event.timeEnd}
📍 Место: ${eventRequest.event.location.name}

${status === 'accepted' ? 'Теперь вы можете написать организатору, нажав кнопку "Написать организатору" ниже.' : ''}`

    // Создаем сообщение от SELS бота запросившему пользователю
    if (!conversation) {
      console.error('Не удалось создать или найти беседу с SELS ботом для запросившего')
      return NextResponse.json(updatedRequest, { status: 200 })
    }

    try {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: selsBot.id,
          receiverId: eventRequest.requesterId,
          content: messageContent,
          images: [],
        },
      })

      // Обновляем время обновления беседы
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      })

      // Создаем уведомление для запросившего пользователя
      try {
        await prisma.notification.create({
          data: {
            userId: eventRequest.requesterId,
            type: 'event',
            title: status === 'accepted' ? 'Запрос принят' : 'Запрос отклонен',
            message: `Ваш запрос на участие в событии "${eventRequest.event.title}" ${status === 'accepted' ? 'принят' : 'отклонен'}`,
            link: `/chats?conversation=${conversation.id}`,
          },
        })
        console.log('Уведомление создано для запросившего пользователя')
      } catch (notifError) {
        console.error('Ошибка создания уведомления (не критично):', notifError)
      }

      console.log('Сообщение от SELS бота создано для запросившего пользователя')
    } catch (messageError: any) {
      console.error('Ошибка создания сообщения от SELS бота:', messageError)
      // Продолжаем выполнение, даже если сообщение не создано
    }

    return NextResponse.json(updatedRequest, { status: 200 })
  } catch (error: any) {
    console.error('Error updating event request:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update event request' },
      { status: 500 }
    )
  }
}
