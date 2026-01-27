import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🖼️ Обновление аватарок пользователей...')

  // Обновить аватар для petr@sels.com
  const petr = await prisma.user.update({
    where: { email: 'petr@sels.com' },
    data: {
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces',
    },
  })
  console.log(`✅ Аватар обновлён для: ${petr.email}`)

  // Обновить аватар для sergey@sels.com
  const sergey = await prisma.user.update({
    where: { email: 'sergey@sels.com' },
    data: {
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces',
    },
  })
  console.log(`✅ Аватар обновлён для: ${sergey.email}`)

  console.log('\n🎉 Аватарки успешно обновлены!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
