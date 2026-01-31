# Обновление GitHub токена

## Проблема

Текущий токен не имеет права `workflow` для изменения файлов в `.github/workflows/`.

## Решение

### Вариант 1: Создать новый токен с правами `workflow` (рекомендуется)

1. Открой: https://github.com/settings/tokens
2. Нажми "Generate new token (classic)"
3. Название: `mysels-deploy`
4. Выбери права:
   - ✅ `repo` (полный доступ к репозиториям)
   - ✅ `workflow` (обновление GitHub Actions workflows)
5. Нажми "Generate token"
6. Скопируй новый токен
7. Обнови файл `.github_token`:
   ```bash
   echo "ghp_НОВЫЙ_ТОКЕН" > .github_token
   chmod 600 .github_token
   ```

### Вариант 2: Использовать текущий токен (без workflow файлов)

Скрипт `push-to-github.sh` автоматически пропустит изменения в `.github/workflows/`.

Для изменения workflow файлов нужно будет делать push вручную с SSH или обновленным токеном.

## Проверка

После обновления токена проверь:
```bash
./push-to-github.sh
```
