/** @type {import('next').NextConfig} */
const nextConfig = {
  // Отключаем статическую оптимизацию для всех страниц, которые используют динамические данные
  experimental: {
    // Убеждаемся, что Prisma работает корректно
  },
}

module.exports = nextConfig
