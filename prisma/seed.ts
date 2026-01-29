import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Создание тестовых пользователей
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user1 = await prisma.user.upsert({
    where: { email: 'petr@sels.com' },
    update: {},
    create: {
      email: 'petr@sels.com',
      password: hashedPassword,
      firstName: 'Petr',
      lastName: 'Tartyshev',
      username: 'petrtar',
      avatar: '/avatars/petr.jpg',
      bio: 'Основатель SELS. Люблю футбол и активный образ жизни!',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'sergey@sels.com' },
    update: {},
    create: {
      email: 'sergey@sels.com',
      password: hashedPassword,
      firstName: 'Сергей',
      lastName: 'Иванов',
      username: 'sergeyiv',
      avatar: '/avatars/sergey.jpg',
      bio: 'Тренер по футболу. Организую тренировки для всех уровней.',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'anna@sels.com' },
    update: {},
    create: {
      email: 'anna@sels.com',
      password: hashedPassword,
      firstName: 'Анна',
      lastName: 'Петрова',
      username: 'annapet',
      avatar: '/avatars/anna.jpg',
      bio: 'Люблю бег и йогу. Организую утренние пробежки в парках Москвы.',
    },
  })

  // Создание технического аккаунта SELS
  const selsBot = await prisma.user.upsert({
    where: { email: 'sels@system.com' },
    update: {},
    create: {
      email: 'sels@system.com',
      password: hashedPassword, // Технический аккаунт, пароль не используется
      firstName: 'SELS',
      lastName: 'Support',
      username: 'sels_support',
      avatar: 'https://ui-avatars.com/api/?name=SELS&background=2F80ED&color=fff',
      bio: 'Технический аккаунт платформы SELS. Отправляет системные уведомления и сообщения.',
    },
  })

  console.log('✅ Пользователи созданы:', { 
    user1: user1.username, 
    user2: user2.username,
    user3: user3.username,
    selsBot: selsBot.username,
  })
  
  console.log('📋 Данные для входа:')
  console.log('1. petr@sels.com / password123')
  console.log('2. sergey@sels.com / password123')
  console.log('3. anna@sels.com / password123')

  // Создание локаций
  const location1 = await prisma.location.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'Футбольное поле в парке Яуза',
      description: 'Отличное футбольное поле в парке Яуза, рядом с Храмом воздуха. Общественное городское пространство. Есть возможность поделить поле на два. Раздевалки отсутствуют. Искусственная трава - ровное покрытие без дыр. Играют в основном команды из соседних районов.',
      lat: 55.8228,
      lng: 37.6602,
      address: 'Парк Яуза, Храм воздуха',
      cost: 'Бесплатно',
      rating: 4,
      image: '/images/yauza-field.jpg',
      type: 'outdoor',
    },
  })

  const location2 = await prisma.location.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      name: 'Спортплощадка Сокольники',
      description: 'Современная спортплощадка в парке Сокольники. Идеально для воркаута и легкой атлетики.',
      lat: 55.7967,
      lng: 37.6700,
      address: 'Парк Сокольники',
      cost: 'Бесплатно',
      rating: 5,
      image: '/images/sokolniki-field.jpg',
      type: 'outdoor',
    },
  })

  const location3 = await prisma.location.upsert({
    where: { id: '3' },
    update: {},
    create: {
      id: '3',
      name: 'Стадион Лужники',
      description: 'Главный стадион страны. Доступны беговые дорожки и несколько полей.',
      lat: 55.7150,
      lng: 37.5550,
      address: 'Лужнецкая наб., 24',
      cost: 'Платно',
      rating: 4,
      image: '/images/luzhniki-stadium.jpg',
      type: 'outdoor',
    },
  })

  const location4 = await prisma.location.upsert({
    where: { id: '4' },
    update: {},
    create: {
      id: '4',
      name: 'Парк Горького',
      description: 'Парк с множеством спортивных зон, включая площадки для воркаута, йоги и беговые дорожки.',
      lat: 55.7308,
      lng: 37.6014,
      address: 'Крымский Вал, 9',
      cost: 'Бесплатно',
      rating: 5,
      image: '/images/gorky-park.jpg',
      type: 'outdoor',
    },
  })

  const location5 = await prisma.location.upsert({
    where: { id: '5' },
    update: {},
    create: {
      id: '5',
      name: 'Воробьевы горы',
      description: 'Открытые площадки на Воробьевых горах с видом на Москву-реку. Воркаут, йога, бег.',
      lat: 55.7105,
      lng: 37.5420,
      address: 'Воробьевы горы',
      cost: 'Бесплатно',
      rating: 4,
      image: '/images/vorobyovy-gory.jpg',
      type: 'outdoor',
    },
  })

  console.log('✅ Локации созданы:', {
    location1: location1.name,
    location2: location2.name,
    location3: location3.name,
    location4: location4.name,
    location5: location5.name,
  })

  // Создание событий
  const event1 = await prisma.event.create({
    data: {
      title: 'Вечерняя игра в футбол',
      description: 'Вечерняя игра в футбол. Ищу игроков!',
      program: [
        'Разминка на все группы мышц. Беговые упражнения.',
        'Силовые упражнения.',
        'Тренировка с мячом. Обучение дриблингу. Ускорения с мячом.',
      ],
      date: '21.01.2026',
      timeStart: '18:00',
      timeEnd: '19:00',
      locationId: location1.id,
      userId: user1.id,
      capacity: 12,
      participants: 3,
    },
  })

  const event2 = await prisma.event.create({
    data: {
      title: 'Тренировка по футболу',
      description: 'Тренировка по футболу для всех желающих. Приходите, будем работать над техникой и выносливостью. Подходит для любого уровня подготовки!',
      program: [
        'Разминка и растяжка.',
        'Отработка пасов и ударов.',
        'Тактические упражнения.',
        'Двусторонняя игра.',
      ],
      date: '21.01.2026',
      timeStart: '16:00',
      timeEnd: '17:30',
      locationId: location1.id,
      userId: user2.id,
      capacity: 20,
      participants: 5,
    },
  })

  console.log('✅ События созданы:', {
    event1: event1.title,
    event2: event2.title,
  })

  // Создание постов
  const post1 = await prisma.post.create({
    data: {
      text: 'Сегодня была отличная игра! Собралась команда из 8 человек. Погода была супер, несмотря на январь. Играли 2 часа, все остались довольны. В следующий раз планируем собраться в субботу.',
      images: [],
      locationId: location1.id,
      userId: user1.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      text: 'Отличная тренировка сегодня утром. Пробежал 5 км, сделал упражнения. Чувствую себя отлично!',
      images: [],
      locationId: location4.id,
      userId: user1.id,
    },
  })

  console.log('✅ Посты созданы:', {
    post1: post1.id,
    post2: post2.id,
  })

  // Создание беседы между пользователями
  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [
          { userId: user1.id },
          { userId: user2.id },
        ],
      },
    },
  })

  console.log('✅ Беседа создана:', conversation.id)

  // Создание сообщений
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: user1.id,
      receiverId: user2.id,
      content: 'Привет! Видел твою тренировку на поле в Яузе. Можно присоединиться?',
      images: [],
    },
  })

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: user2.id,
      receiverId: user1.id,
      content: 'Конечно! Буду рад. В субботу в 16:00, приходи!',
      images: [],
    },
  })

  console.log('✅ Сообщения созданы')

  // Создание уведомлений
  await prisma.notification.create({
    data: {
      userId: user1.id,
      type: 'system',
      title: 'Добро пожаловать в SELS!',
      message: 'Спасибо за регистрацию. Начните с создания вашего первого поста или найдите события на карте.',
      link: '/map',
    },
  })

  await prisma.notification.create({
    data: {
      userId: user1.id,
      type: 'event',
      title: 'Новое событие поблизости',
      message: 'Сергей Иванов создал тренировку по футболу 21.01.2026',
      link: `/event/${event2.id}`,
    },
  })

  console.log('✅ Уведомления созданы')

  console.log('🎉 База данных успешно заполнена!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
