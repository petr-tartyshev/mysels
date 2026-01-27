import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all conversations for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
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
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

// POST - Create new conversation
// ВАЖНО: Беседы между пользователями создаются автоматически только после принятия запроса на участие
// Прямое создание бесед между пользователями запрещено
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userIds } = body // Array of user IDs

    if (!userIds || userIds.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 users are required' },
        { status: 400 }
      )
    }

    // Находим технический аккаунт SELS
    const selsBot = await prisma.user.findUnique({
      where: { email: 'sels@system.com' },
    })

    // Проверяем, что это не беседа между обычными пользователями
    // Беседы между пользователями создаются только автоматически после принятия запроса
    const hasSelsBot = selsBot && userIds.includes(selsBot.id)
    
    if (!hasSelsBot && userIds.length === 2) {
      // Это попытка создать беседу между двумя обычными пользователями
      return NextResponse.json(
        { 
          error: 'Беседы между пользователями создаются автоматически только после принятия запроса на участие в событии',
          hint: 'Чтобы начать общение, отправьте запрос на участие в событии пользователя'
        },
        { status: 403 }
      )
    }

    // Check if conversation already exists between these users
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: userIds.map((userId: string) => ({
          participants: {
            some: {
              userId,
            },
          },
        })),
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
      },
    })

    if (existingConversation) {
      return NextResponse.json(existingConversation)
    }

    // Create new conversation (только если это беседа с SELS ботом или системная)
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: userIds.map((userId: string) => ({
            userId,
          })),
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
      },
    })

    return NextResponse.json(conversation, { status: 201 })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}
