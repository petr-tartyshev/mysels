# Настройка SSH для GitHub (без пароля)

## Быстрая настройка

1. **Выполни скрипт настройки:**
   ```bash
   chmod +x setup-github-ssh.sh
   ./setup-github-ssh.sh
   ```

2. **Скопируй публичный ключ**, который покажет скрипт

3. **Добавь ключ в GitHub:**
   - Открой https://github.com/settings/keys
   - Нажми "New SSH key"
   - Вставь скопированный ключ
   - Сохрани

4. **Проверь подключение:**
   ```bash
   ssh -T git@github.com
   ```
   Должно появиться: `Hi petr-tartyshev! You've successfully authenticated...`

5. **Теперь git push будет работать без пароля:**
   ```bash
   git push origin main
   ```

## Альтернативный способ (если SSH не работает)

Если SSH не подходит, можно использовать Personal Access Token:

1. **Создай токен:**
   - Открой https://github.com/settings/tokens
   - Нажми "Generate new token (classic)"
   - Выбери права: `repo` (полный доступ к репозиториям)
   - Скопируй токен

2. **Настрой git credential helper:**
   ```bash
   git config --global credential.helper osxkeychain
   ```

3. **При первом push введи:**
   - Username: `petr-tartyshev`
   - Password: `[вставь токен]`
   
   Git сохранит токен в keychain, и больше не будет спрашивать пароль.

## Проверка текущей настройки

```bash
# Проверить remote URL
git remote -v

# Проверить SSH подключение
ssh -T git@github.com

# Проверить сохраненные credentials
git config --global credential.helper
```
