/** @type {import('next').NextConfig} */
const nextConfig = {
  // Оптимизация производительности
  compress: true, // Включить gzip сжатие
  poweredByHeader: false, // Убрать заголовок X-Powered-By
  reactStrictMode: true, // Строгий режим React
  
  // Оптимизация изображений
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Оптимизация сборки
  swcMinify: true, // Использовать SWC для минификации
  
  // Экспериментальные функции
  experimental: {
    optimizeCss: true, // Оптимизация CSS
  },
}

module.exports = nextConfig
