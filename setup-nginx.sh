#!/bin/bash
# Скрипт для установки и настройки Nginx

set -e

echo "🔧 Установка Nginx и Certbot..."

# Установка
apt update
apt install -y nginx certbot python3-certbot-nginx

echo "📝 Создание конфигурации Nginx..."

# Создание конфигурации
cat > /etc/nginx/sites-available/mysels.ru << 'EOF'
server {
    listen 80;
    server_name mysels.ru www.mysels.ru;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

echo "🔗 Включение сайта..."

# Включение сайта
ln -sf /etc/nginx/sites-available/mysels.ru /etc/nginx/sites-enabled/mysels.ru

# Удаление дефолтного сайта (если есть)
rm -f /etc/nginx/sites-enabled/default

echo "✅ Проверка конфигурации..."

# Проверка конфигурации
nginx -t

echo "🔄 Перезагрузка Nginx..."

# Перезагрузка Nginx
systemctl reload nginx
systemctl enable nginx

echo ""
echo "✅ Nginx установлен и настроен!"
echo ""
echo "📋 Следующий шаг:"
echo "   Выпусти SSL сертификат:"
echo "   certbot --nginx -d mysels.ru -d www.mysels.ru"
echo ""
echo "📋 Затем настрой DNS в REG.RU:"
echo "   - mysels.ru → A → 45.130.8.3"
echo "   - www.mysels.ru → A → 45.130.8.3"
