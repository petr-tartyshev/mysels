import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🗑️  Удаление всех бесед между пользователями (без SELS бота)...')

  // Находим технический аккаунт SELS
  const selsBot = await prisma.user.findUnique({
    where: { email: 'sels@system.com' },
  })

  if (!selsBot) {
    console.log('⚠️  Технический аккаунт SELS не найден')
  } else {
    console.log('✅ Технический аккаунт SELS найден:', selsBot.id)
  }

  // Получаем все беседы
  const allConversations = await prisma.conversation.findMany({
    include: {
      participants: {
        include: {
          user: true,
        },
      },
    },
  })

  console.log(`📊 Найдено бесед: ${allConversations.length}`)

  let deletedCount = 0
  let keptCount = 0

  for (const conversation of allConversations) {
    const participantIds = conversation.participants.map((p) => p.userId)
    const participantEmails = conversation.participants.map((p) => p.user.email)

    // Проверяем, является ли это беседой с SELS ботом
    const hasSelsBot = selsBot && participantIds.includes(selsBot.id)

    if (hasSelsBot) {
      console.log(`✅ Сохраняем беседу ${conversation.id} (с SELS ботом)`)
      keptCount++
      continue
    }

    // Удаляем беседу между обычными пользователями
    console.log(`🗑️  Удаляем беседу ${conversation.id} между пользователями: ${participantEmails.join(', ')}`)
    
    // Удаляем все сообщения в беседе
    await prisma.message.deleteMany({
      where: { conversationId: conversation.id },
    })

    // Удаляем участников
    await prisma.conversationParticipant.deleteMany({
      where: { conversationId: conversation.id },
    })

    // Удаляем беседу
    await prisma.conversation.delete({
      where: { id: conversation.id },
    })

    deletedCount++
  }

  console.log(`\n✅ Готово!`)
  console.log(`   Удалено бесед: ${deletedCount}`)
  console.log(`   Сохранено бесед (с SELS ботом): ${keptCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
