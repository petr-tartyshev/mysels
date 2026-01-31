#!/bin/bash

# Скрипт для автоматической отправки изменений в GitHub
GITHUB_TOKEN_FILE=".github_token"

if [ ! -f "$GITHUB_TOKEN_FILE" ]; then
    echo "❌ Файл $GITHUB_TOKEN_FILE не найден!"
    exit 1
fi

GITHUB_TOKEN=$(cat "$GITHUB_TOKEN_FILE" | tr -d '\n\r ')

# Сохраняем текущий remote
CURRENT_REMOTE=$(git remote get-url origin)

# Временно меняем на HTTPS с токеном
git remote set-url origin "https://${GITHUB_TOKEN}@github.com/petr-tartyshev/mysels.git"

# Обновляем информацию о remote
git fetch origin 2>&1 | grep -v "Permission denied" || true

# Проверяем статус (только локальные изменения, не сравниваем с remote)
LOCAL_CHANGES=$(git status --porcelain)

if [ -z "$LOCAL_CHANGES" ]; then
    echo "✅ Нет локальных изменений для отправки"
    git remote set-url origin "$CURRENT_REMOTE"
    exit 0
fi

# Добавляем все изменения (включая workflow файлы, так как токен обновлен)
echo "📝 Добавляю все изменения..."
git add -A

# Проверяем, остались ли изменения после исключения workflow
STAGED_CHANGES=$(git diff --cached --name-only)

if [ -z "$STAGED_CHANGES" ]; then
    echo "✅ Нет изменений для отправки (только workflow файлы или нет изменений)"
    git remote set-url origin "$CURRENT_REMOTE"
    exit 0
fi

# Коммитим
echo "💾 Создаю коммит..."
git commit -m "chore: Auto-commit $(date +%Y-%m-%d\ %H:%M:%S)" || {
    echo "⚠️  Нет изменений для коммита"
    git remote set-url origin "$CURRENT_REMOTE"
    exit 0
}

# Пушим (только если нет конфликтов с workflow файлами)
echo "📤 Отправляю в GitHub..."
PUSH_OUTPUT=$(git push origin main 2>&1)
PUSH_STATUS=$?

if [ $PUSH_STATUS -eq 0 ]; then
    echo "✅ Изменения отправлены в GitHub"
    git remote set-url origin "$CURRENT_REMOTE"
    exit 0
else
    # Проверяем, это ошибка workflow или другая
    if echo "$PUSH_OUTPUT" | grep -q "workflow.*scope"; then
        echo "⚠️  Ошибка: токен не имеет права 'workflow'"
        echo "⚠️  Изменения в .github/workflows/ не могут быть отправлены"
        echo "📝 См. UPDATE_TOKEN.md для инструкций по обновлению токена"
        echo "💡 Продолжаю деплой на сервер (workflow файлы уже на сервере)"
    else
        echo "❌ Ошибка при отправке:"
        echo "$PUSH_OUTPUT"
    fi
    git remote set-url origin "$CURRENT_REMOTE"
    # Не выходим с ошибкой, чтобы деплой на сервер мог продолжиться
    exit 0
fi
