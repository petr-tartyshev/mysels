import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

// Пересоздаем Prisma Client, чтобы убедиться, что используется последняя версия
let prismaClient: PrismaClient

if (globalForPrisma.prisma) {
  prismaClient = globalForPrisma.prisma
} else {
  prismaClient = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaClient
  }
}

// Проверяем, что Prisma Client инициализирован
if (!prismaClient) {
  throw new Error('Prisma Client не инициализирован')
}

export const prisma = prismaClient
