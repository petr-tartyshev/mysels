# ⚙️ Настройка Git для работы с Vercel

## Проблема

Vercel выдает ошибку: **"A commit author is required"**

Это происходит, когда Git не настроен с глобальными данными пользователя (имя и email).

## Решение

### 1. Настройка глобальных данных Git

Выполните в терминале:

```bash
# Установить имя пользователя
git config --global user.name "petr-tartyshev"

# Установить email (используйте GitHub noreply email)
git config --global user.email "petr-tartyshev@users.noreply.github.com"
```

**Или используйте ваш реальный email:**
```bash
git config --global user.email "ваш-email@example.com"
```

### 2. Проверка настроек

```bash
# Проверить текущие настройки
git config --global --list | grep user

# Должно показать:
# user.name=petr-tartyshev
# user.email=petr-tartyshev@users.noreply.github.com
```

### 3. Исправление последнего коммита (если нужно)

Если последний коммит был создан без правильных данных автора:

```bash
# Исправить автора последнего коммита
git commit --amend --reset-author --no-edit

# Отправить изменения
git push origin main --force-with-lease
```

**⚠️ Внимание:** `--force-with-lease` безопаснее, чем `--force`, но все равно перезаписывает историю. Используйте только если уверены.

### 4. Для будущих коммитов

Все новые коммиты будут автоматически использовать правильные данные автора.

## Альтернатива: Настройка только для текущего репозитория

Если не хотите менять глобальные настройки:

```bash
# Только для текущего репозитория
git config user.name "petr-tartyshev"
git config user.email "petr-tartyshev@users.noreply.github.com"
```

## GitHub noreply email

GitHub предоставляет специальный email для коммитов:
- Формат: `username@users.noreply.github.com`
- Преимущества: скрывает ваш реальный email от публичного доступа
- Для вашего случая: `petr-tartyshev@users.noreply.github.com`

## Проверка в Vercel

После настройки:

1. Создайте новый коммит:
   ```bash
   git commit --allow-empty -m "test: проверка настроек автора"
   git push origin main
   ```

2. Проверьте в Vercel, что деплой проходит без ошибки "A commit author is required"

---

**✅ Настройки уже применены глобально:**
- `user.name=petr-tartyshev`
- `user.email=petr-tartyshev@users.noreply.github.com`

Все будущие коммиты будут использовать эти данные.
