import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

// Пересоздаем Prisma Client, чтобы убедиться, что используется последняя версия
let prismaClient: PrismaClient

if (globalForPrisma.prisma) {
  prismaClient = globalForPrisma.prisma
} else {
  // Не проверяем DATABASE_URL при создании клиента
  // Проверка будет только при реальном использовании (в API routes)
  // Это позволяет Next.js собрать проект без DATABASE_URL
  prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaClient
  }
}

export const prisma = prismaClient
