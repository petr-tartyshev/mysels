import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🖼️ Обновление аватарки Petr...')

  // URL для аватарки Petr (замените на реальный URL изображения из вложения)
  // Если у вас есть URL изображения, замените его здесь
  const petrAvatarUrl = process.argv[2] || 'https://i.imgur.com/placeholder.png'

  if (process.argv[2]) {
    console.log(`Используется URL: ${petrAvatarUrl}`)
  } else {
    console.log('⚠️  URL не указан, используется placeholder')
    console.log('Использование: npx ts-node scripts/update-petr-avatar.ts <URL_ИЗОБРАЖЕНИЯ>')
  }

  // Обновить аватар для petr@sels.com
  const petr = await prisma.user.update({
    where: { email: 'petr@sels.com' },
    data: {
      avatar: petrAvatarUrl,
    },
  })
  console.log(`✅ Аватар обновлён для: ${petr.email} (${petr.username})`)
  console.log(`   URL: ${petr.avatar}`)
  console.log('\n🎉 Аватарка успешно обновлена!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
