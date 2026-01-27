import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Обновление типов локаций на "outdoor"...')

  const locationNames = [
    'Футбольное поле в парке Яуза',
    'Спортплощадка Сокольники',
    'Стадион Лужники',
    'Парк Горького',
    'Воробьевы горы',
  ]

  for (const name of locationNames) {
    const location = await prisma.location.findFirst({
      where: { name },
    })

    if (location) {
      await prisma.location.update({
        where: { id: location.id },
        data: { type: 'outdoor' },
      })
      console.log(`✅ Обновлена локация: ${name}`)
    } else {
      console.log(`⚠️  Локация не найдена: ${name}`)
    }
  }

  console.log('✅ Готово!')
}

main()
  .catch((e) => {
    console.error('Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
