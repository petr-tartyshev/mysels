# 🗄️ База данных SELS - Полное руководство

## 📋 Содержание

1. [Архитектура базы данных](#архитектура)
2. [Установка PostgreSQL](#установка-postgresql)
3. [Настройка проекта](#настройка-проекта)
4. [Запуск миграций](#запуск-миграций)
5. [API эндпоинты](#api-эндпоинты)
6. [Примеры использования](#примеры-использования)

---

## 🏗️ Архитектура базы данных

### Модели:

#### 1. **User (Пользователи)**
- Профиль пользователя
- Аутентификация
- Связь с постами, сообщениями, событиями

#### 2. **Post (Публикации)**
- Посты пользователей
- Фотографии (массив URL)
- Привязка к локациям

#### 3. **Location (Локации)**
- Спортивные площадки
- Координаты на карте
- Связь с постами и событиями

#### 4. **Event (События)**
- Тренировки и мероприятия
- Организатор (User)
- Локация
- Программа тренировки

#### 5. **Booking (Бронирования)**
- Запись на события
- Временные слоты
- Статус бронирования

#### 6. **Conversation (Беседы)**
- Чаты между пользователями
- Участники беседы
- История сообщений

#### 7. **Message (Сообщения)**
- Текст и изображения
- Статус прочтения
- Отправитель/получатель

#### 8. **Notification (Уведомления)**
- Системные уведомления
- Уведомления о событиях
- Уведомления о сообщениях

---

## 🐘 Установка PostgreSQL

### Вариант 1: Homebrew (macOS)

\`\`\`bash
# Установка PostgreSQL
brew install postgresql@15

# Запуск службы
brew services start postgresql@15

# Создание базы данных
createdb sels_db

# Проверка подключения
psql sels_db
\`\`\`

### Вариант 2: Docker (Рекомендуется для разработки)

\`\`\`bash
# Создать docker-compose.yml в корне проекта
docker-compose up -d
\`\`\`

**docker-compose.yml:**
\`\`\`yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: sels_postgres
    environment:
      POSTGRES_USER: sels_user
      POSTGRES_PASSWORD: sels_password
      POSTGRES_DB: sels_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
\`\`\`

### Вариант 3: Cloud Database (Production)

**Рекомендуемые сервисы:**
- **Supabase** (бесплатный план) - https://supabase.com
- **Railway** (бесплатный план) - https://railway.app
- **Neon** (бесплатный план) - https://neon.tech

---

## ⚙️ Настройка проекта

### 1. Установка зависимостей

\`\`\`bash
npm install @prisma/client bcryptjs
npm install -D prisma @types/bcryptjs
\`\`\`

### 2. Создание .env файла

\`\`\`bash
# Создать файл .env в корне проекта
touch .env
\`\`\`

**Содержимое .env:**

\`\`\`env
# Database
DATABASE_URL="postgresql://sels_user:sels_password@localhost:5432/sels_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-secret-with-openssl-rand-base64-32"

# Socket.io (для чата в будущем)
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
\`\`\`

### 3. Генерация секрета для NextAuth

\`\`\`bash
openssl rand -base64 32
\`\`\`

Скопируйте результат в \`NEXTAUTH_SECRET\` в файле \`.env\`

---

## 🚀 Запуск миграций

### 1. Генерация Prisma Client

\`\`\`bash
npx prisma generate
\`\`\`

### 2. Применение миграций (создание таблиц)

\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

### 3. Заполнение начальными данными (seed)

Создайте файл \`prisma/seed.ts\`:

\`\`\`typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Создание тестового пользователя
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.create({
    data: {
      email: 'petr@sels.com',
      password: hashedPassword,
      firstName: 'Petr',
      lastName: 'Tartyshev',
      username: 'petrtar',
      avatar: '/avatars/petr.jpg',
      bio: 'Основатель SELS',
    },
  })

  // Создание локаций
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Футбольное поле в парке Яуза',
        description: 'Отличное футбольное поле...',
        lat: 55.8228,
        lng: 37.6602,
        address: 'Парк Яуза, Храм воздуха',
        cost: 'Бесплатно',
        rating: 4,
        type: 'featured',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Парк Горького',
        description: 'Парк с множеством спортивных зон...',
        lat: 55.7308,
        lng: 37.6014,
        address: 'Крымский Вал, 9',
        cost: 'Бесплатно',
        rating: 5,
      },
    }),
  ])

  console.log('✅ Данные добавлены:', { user, locations })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
\`\`\`

**Запуск seed:**

\`\`\`bash
npx prisma db seed
\`\`\`

Добавьте в \`package.json\`:

\`\`\`json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
\`\`\`

### 4. Открытие Prisma Studio (GUI для БД)

\`\`\`bash
npx prisma studio
\`\`\`

Откроется браузер с интерфейсом для просмотра и редактирования данных.

---

## 🔌 API Эндпоинты

### **Users (Пользователи)**

| Метод | Путь | Описание |
|-------|------|----------|
| GET | \`/api/users\` | Все пользователи |
| GET | \`/api/users?id={userId}\` | Пользователь по ID |
| GET | \`/api/users?username={username}\` | Пользователь по username |
| POST | \`/api/users\` | Создать пользователя |
| PATCH | \`/api/users\` | Обновить профиль |

### **Posts (Публикации)**

| Метод | Путь | Описание |
|-------|------|----------|
| GET | \`/api/posts\` | Все посты |
| GET | \`/api/posts?userId={userId}\` | Посты пользователя |
| POST | \`/api/posts\` | Создать пост |

### **Locations (Локации)**

| Метод | Путь | Описание |
|-------|------|----------|
| GET | \`/api/locations\` | Все локации |
| POST | \`/api/locations\` | Создать локацию |

### **Conversations (Беседы)**

| Метод | Путь | Описание |
|-------|------|----------|
| GET | \`/api/conversations?userId={userId}\` | Беседы пользователя |
| POST | \`/api/conversations\` | Создать беседу |

### **Messages (Сообщения)**

| Метод | Путь | Описание |
|-------|------|----------|
| GET | \`/api/messages?conversationId={id}\` | Сообщения беседы |
| POST | \`/api/messages\` | Отправить сообщение |
| PATCH | \`/api/messages\` | Отметить прочитанным |

### **Notifications (Уведомления)**

| Метод | Путь | Описание |
|-------|------|----------|
| GET | \`/api/notifications?userId={userId}\` | Уведомления пользователя |
| GET | \`/api/notifications?userId={userId}&unreadOnly=true\` | Непрочитанные |
| POST | \`/api/notifications\` | Создать уведомление (системное) |
| PATCH | \`/api/notifications\` | Отметить прочитанным |
| DELETE | \`/api/notifications?id={id}\` | Удалить уведомление |

---

## 💡 Примеры использования

### 1. Создание поста

\`\`\`typescript
// В компоненте Profile
const handleCreatePost = async () => {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: newPostText,
      images: newPostImages,
      locationId: newPostLocation.id,
      userId: 'current-user-id', // Получить из сессии
    }),
  })

  const post = await response.json()
  setPosts([post, ...posts])
}
\`\`\`

### 2. Загрузка постов при монтировании

\`\`\`typescript
useEffect(() => {
  const fetchPosts = async () => {
    const response = await fetch('/api/posts?userId=current-user-id')
    const data = await response.json()
    setPosts(data)
  }

  fetchPosts()
}, [])
\`\`\`

### 3. Отправка сообщения в чат

\`\`\`typescript
const sendMessage = async (content: string) => {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversationId: currentConversation.id,
      senderId: currentUser.id,
      receiverId: otherUser.id,
      content,
      images: [],
    }),
  })

  const message = await response.json()
  setMessages([...messages, message])
}
\`\`\`

### 4. Создание системного уведомления

\`\`\`typescript
// Например, при создании нового события
const notifyUsers = async (userIds: string[], event: Event) => {
  await Promise.all(
    userIds.map((userId) =>
      fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: 'event',
          title: 'Новое событие в вашей локации',
          message: \`\${event.title} - \${event.date}\`,
          link: \`/event/\${event.id}\`,
        }),
      })
    )
  )
}
\`\`\`

---

## 🔧 Полезные команды Prisma

\`\`\`bash
# Генерация клиента после изменения схемы
npx prisma generate

# Создание новой миграции
npx prisma migrate dev --name add_something

# Применение миграций на production
npx prisma migrate deploy

# Сброс базы данных (ОСТОРОЖНО!)
npx prisma migrate reset

# Форматирование schema.prisma
npx prisma format

# Проверка схемы на ошибки
npx prisma validate

# Открыть Prisma Studio
npx prisma studio
\`\`\`

---

## 🎯 Следующие шаги

### 1. Запустите PostgreSQL
\`\`\`bash
# Через Docker
docker-compose up -d

# Или через Homebrew
brew services start postgresql@15
\`\`\`

### 2. Установите зависимости
\`\`\`bash
npm install
\`\`\`

### 3. Настройте .env файл

### 4. Примените миграции
\`\`\`bash
npx prisma migrate dev --name init
\`\`\`

### 5. Заполните начальными данными
\`\`\`bash
npx prisma db seed
\`\`\`

### 6. Запустите приложение
\`\`\`bash
npm run dev
\`\`\`

---

## ❓ Частые проблемы

### Проблема: "Can't reach database server"

**Решение:**
\`\`\`bash
# Проверьте, запущен ли PostgreSQL
brew services list

# Или для Docker
docker ps
\`\`\`

### Проблема: "Error: P1001: Can't reach database server"

**Решение:**
- Проверьте \`DATABASE_URL\` в \`.env\`
- Убедитесь, что PostgreSQL запущен
- Проверьте порт (по умолчанию 5432)

### Проблема: "Invalid \`prisma.table.create()\` invocation"

**Решение:**
\`\`\`bash
# Регенерируйте Prisma Client
npx prisma generate
\`\`\`

---

## 📚 Дополнительные ресурсы

- [Документация Prisma](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**🎉 База данных готова к использованию!**
