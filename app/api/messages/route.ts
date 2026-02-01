import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET messages for a conversation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
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
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST - Send new message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, senderId, receiverId, content, images } = body

    // Validation
    if (!conversationId || !senderId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Проверяем, что беседа существует
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: true,
      },
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Проверяем, что sender является участником беседы
    const isParticipant = conversation.participants.some((p) => p.userId === senderId)
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'User is not a participant of this conversation' },
        { status: 403 }
      )
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        receiverId,
        content,
        images: images || [],
      },
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
      },
    })

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    })

    // Create notification for receiver
    if (receiverId) {
      try {
        await prisma.notification.create({
          data: {
            userId: receiverId,
            type: 'message',
            title: 'Новое сообщение',
            message: `${message.sender.firstName} ${message.sender.lastName} отправил вам сообщение`,
            link: `/chats?conversation=${conversationId}`,
          },
        })
      } catch (notifError) {
        console.error('Ошибка создания уведомления (не критично):', notifError)
        // Продолжаем выполнение, даже если уведомление не создано
      }
    }

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// PATCH - Mark message as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { messageId, conversationId, userId } = body

    if (messageId) {
      // Mark single message as read
      const message = await prisma.message.update({
        where: { id: messageId },
        data: { isRead: true },
      })

      return NextResponse.json(message)
    }

    if (conversationId && userId) {
      // Mark all messages in conversation as read for user
      await prisma.message.updateMany({
        where: {
          conversationId,
          receiverId: userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      })

      // Update lastReadAt for participant
      await prisma.conversationParticipant.updateMany({
        where: {
          conversationId,
          userId,
        },
        data: {
          lastReadAt: new Date(),
        },
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}
