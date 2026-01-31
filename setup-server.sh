#!/bin/bash
# Скрипт для настройки сервера Selectel

set -e

echo "🚀 Настройка сервера Selectel для SELS..."

# Переходим в /root
cd /root

# Проверяем, есть ли папка проекта
if [ ! -d "sels" ]; then
    echo "📦 Клонирую проект из GitHub..."
    git clone https://github.com/petr-tartyshev/mysels.git sels
else
    echo "✅ Папка sels уже существует, обновляю..."
    cd sels
    git pull origin main || true
    cd /root
fi

cd sels

# Создаём .env.production если его нет
if [ ! -f ".env.production" ]; then
    echo "📝 Создаю .env.production из примера..."
    cp env.production.example .env.production
    echo "⚠️  ВАЖНО: Нужно отредактировать .env.production и добавить DATABASE_URL из Supabase!"
    echo "   Выполни: nano .env.production"
    echo "   Найди строку DATABASE_URL=... и замени на реальный из Supabase"
    exit 1
fi

# Проверяем, что DATABASE_URL не пустой
if grep -q "DATABASE_URL=postgresql://postgres:\[PASSWORD\]" .env.production; then
    echo "⚠️  DATABASE_URL не настроен! Отредактируй .env.production:"
    echo "   nano .env.production"
    exit 1
fi

echo "🔨 Собираю Docker образ..."
docker compose build

echo "🚀 Запускаю контейнеры..."
docker compose up -d

echo "⏳ Жду 5 секунд..."
sleep 5

echo "📊 Статус контейнеров:"
docker ps

echo "🧪 Проверяю сайт..."
curl -s http://localhost:3000 | head -20 || echo "❌ Сайт не отвечает"

echo ""
echo "✅ Готово! Если контейнер sels_web запущен - всё работает!"
echo "   Проверь: docker ps"
echo "   Проверь сайт: curl http://localhost:3000"
