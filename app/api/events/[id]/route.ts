import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Проверяем, существует ли событие и загружаем полную информацию
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        location: {
          select: {
            id: true,
            name: true,
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
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Находим все запросы на участие в этом событии
    const eventRequests = await prisma.eventRequest.findMany({
      where: {
        eventId: eventId,
        status: {
          in: ['pending', 'accepted'], // Только активные запросы
        },
      },
      include: {
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          },
        },
      },
    })

    console.log(`Найдено ${eventRequests.length} запросов на участие для удаляемого события`)

    // Находим технический аккаунт SELS
    const selsBot = await prisma.user.findUnique({
      where: { email: 'sels@system.com' },
    })

    if (selsBot && eventRequests.length > 0) {
      // Отправляем сервисное сообщение каждому пользователю, который отправил запрос
      for (const eventRequest of eventRequests) {
        try {
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

          // Формируем сообщение
          const messageContent = `❌ Событие было отменено или удалено организатором

📅 ${event.title}
📆 Дата: ${event.date}
⏰ Время: ${event.timeStart} - ${event.timeEnd}
📍 Место: ${event.location.name}`

          // Создаем сообщение от SELS бота
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

          console.log(`Отправлено уведомление пользователю ${eventRequest.requester.username} о удалении события`)
        } catch (error) {
          console.error(`Ошибка отправки уведомления пользователю ${eventRequest.requesterId}:`, error)
          // Продолжаем обработку других пользователей даже при ошибке
        }
      }
    }

    // Удаляем событие (бронирования и запросы удалятся автоматически из-за onDelete: Cascade)
    await prisma.event.delete({
      where: { id: eventId },
    })

    console.log(`Событие ${eventId} успешно удалено`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
