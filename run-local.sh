#!/bin/bash

# Скрипт для запуска локального сервера разработки

echo "🚀 Запуск локального сервера разработки..."
echo ""

# Проверяем наличие .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  Файл .env.local не найден!"
    echo "📝 Создаю .env.local из .env.production..."
    if [ -f ".env.production" ]; then
        cp .env.production .env.local
        echo "✅ Файл .env.local создан"
    else
        echo "❌ Файл .env.production не найден!"
        echo "💡 Создай .env.local вручную с переменной DATABASE_URL"
        exit 1
    fi
fi

# Проверяем наличие node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаю зависимости..."
    npm install
fi

# Генерируем Prisma Client
echo "🔧 Генерирую Prisma Client..."
npx prisma generate

echo ""
echo "✅ Готово! Запускаю сервер разработки..."
echo "🌐 Открой в браузере: http://localhost:3000"
echo ""
echo "💡 Для остановки нажми Ctrl+C"
echo ""

# Запускаем dev сервер
npm run dev
