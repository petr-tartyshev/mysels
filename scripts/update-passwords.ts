import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔐 Обновление паролей для существующих пользователей...')

  const password = 'password123'
  const hashedPassword = await bcrypt.hash(password, 10)

  // Обновить пароль для petr@sels.com
  const petr = await prisma.user.update({
    where: { email: 'petr@sels.com' },
    data: { password: hashedPassword },
  })
  console.log(`✅ Пароль обновлён для: ${petr.email} (${petr.username})`)

  // Обновить пароль для sergey@sels.com
  const sergey = await prisma.user.update({
    where: { email: 'sergey@sels.com' },
    data: { password: hashedPassword },
  })
  console.log(`✅ Пароль обновлён для: ${sergey.email} (${sergey.username})`)

  console.log('\n📝 Данные для входа:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Email: petr@sels.com')
  console.log('Пароль: password123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Email: sergey@sels.com')
  console.log('Пароль: password123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
