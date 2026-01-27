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

      // Создаем беседу между организатором и запросившим пользователем
      // Проверяем, существует ли уже беседа между ними
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
        include: {
          participants: true,
        },
      })

      if (!existingUserConversation) {
        // Создаем новую беседу между пользователями
        const newConversation = await prisma.conversation.create({
          data: {
            participants: {
              create: [
                { userId: eventRequest.event.userId },
                { userId: eventRequest.requesterId },
              ],
            },
          },
          include: {
            participants: {
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
            messages: {
              include: {
                sender: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    username: true,
                    avatar: true,
                  },
                },
                receiver: {
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
                createdAt: 'asc',
              },
            },
          },
        })
        console.log('Создана беседа между пользователями после принятия запроса:', newConversation.id)
      } else {
        console.log('Беседа между пользователями уже существует:', existingUserConversation.id)
      }
    }

    // Находим технический аккаунт SELS
    const selsBot = await prisma.user.findUnique({
      where: { email: 'sels@system.com' },
    })

    if (!selsBot) {
      console.error('SELS bot account not found')
      return NextResponse.json(updatedRequest, { status: 200 })
    }

    // Создаем или находим беседу между запросившим пользователем и SELS ботом
    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          some: { userId: eventRequest.requesterId },
        },
        AND: {
          participants: {
            some: { userId: selsBot.id },
          },
        },
      },
      include: {
        participants: true,
      },
    })

    if (!conversation) {
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
          participants: true,
        },
      })
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
📍 Место: ${eventRequest.event.location.name}`

    // Создаем сообщение от SELS бота запросившему пользователю
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: selsBot.id,
        receiverId: eventRequest.requesterId,
        content: messageContent,
        images: [],
      },
    })

    return NextResponse.json(updatedRequest, { status: 200 })
  } catch (error: any) {
    console.error('Error updating event request:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update event request' },
      { status: 500 }
    )
  }
}
