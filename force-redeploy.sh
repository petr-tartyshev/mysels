#!/bin/bash

# Скрипт для принудительного передеплоя с полной пересборкой

SERVER="root@45.130.8.3"
PROJECT_DIR="/root/sels"

echo "🔄 Принудительный передеплой с полной пересборкой..."
echo ""

ssh $SERVER << 'ENDSSH'
cd /root/sels

echo "📥 1. Получаю последние изменения из GitHub..."
git fetch origin
git reset --hard origin/main
git pull origin main
echo ""

echo "🔍 2. Проверяю последний коммит:"
git log --oneline -1
echo ""

echo "🛑 3. Останавливаю контейнеры..."
docker compose down
echo ""

echo "🗑️  4. Удаляю старые образы..."
docker rmi sels-web:latest 2>/dev/null || true
docker system prune -f
echo ""

echo "🔨 5. Пересобираю Docker образ БЕЗ кеша..."
docker compose build --no-cache --pull
echo ""

echo "🚀 6. Запускаю контейнеры..."
docker compose up -d
echo ""

echo "⏳ 7. Жду 10 секунд для запуска..."
sleep 10
echo ""

echo "🔧 8. Генерирую Prisma Client..."
docker compose exec web npx prisma generate
echo ""

echo "📊 9. Применяю изменения схемы БД..."
docker compose exec web npx prisma db push
echo ""

echo "🔄 10. Перезапускаю веб-сервер..."
docker compose restart web
echo ""

echo "📋 11. Проверяю статус контейнеров:"
docker ps --filter "name=sels"
echo ""

echo "✅ 12. Проверяю, что кнопка 'Создать локацию' есть в коде:"
docker exec sels_web sh -c "grep -n 'Создать локацию' /app/app/profile/page.tsx | head -3" || echo "❌ Кнопка не найдена!"
echo ""

echo "📝 13. Логи веб-контейнера (последние 10 строк):"
docker logs sels_web --tail 10
echo ""

ENDSSH

echo "✅ Передеплой завершен!"
echo "🌐 Проверь сайт: https://mysels.ru"
echo "💡 Если не видишь изменений, очисти кэш браузера (Ctrl+Shift+R или Cmd+Shift+R)"
