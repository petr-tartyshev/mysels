# 🔧 Настройка GitHub Actions для автоматического деплоя

## Шаг 1: Создай SSH ключ (если ещё не создан)

На Mac в терминале:

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""
```

---

## Шаг 2: Скопируй публичный ключ на сервер

```bash
ssh-copy-id -i ~/.ssh/github_actions.pub root@45.130.8.3
```

Если не работает, выполни вручную:

```bash
cat ~/.ssh/github_actions.pub | ssh root@45.130.8.3 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

## Шаг 3: Добавь секреты в GitHub

1. Открой: https://github.com/petr-tartyshev/mysels/settings/secrets/actions

2. Нажми **"New repository secret"** и добавь три секрета:

   **Секрет 1:**
   - Name: `SERVER_HOST`
   - Value: `45.130.8.3`
   - Нажми **"Add secret"**

   **Секрет 2:**
   - Name: `SERVER_USER`
   - Value: `root`
   - Нажми **"Add secret"**

   **Секрет 3:**
   - Name: `SERVER_SSH_KEY`
   - Value: скопируй содержимое приватного ключа:
     ```bash
     cat ~/.ssh/github_actions
     ```
     Скопируй **всё содержимое** (включая `-----BEGIN OPENSSH PRIVATE KEY-----` и `-----END OPENSSH PRIVATE KEY-----`)
   - Нажми **"Add secret"**

---

## Шаг 4: Проверь, что всё работает

1. Сделай небольшое изменение в коде (например, добавь комментарий)
2. Закоммить и запушь:
   ```bash
   git add .
   git commit -m "test: проверка автоматического деплоя"
   git push origin main
   ```
3. Проверь GitHub Actions:
   - GitHub → твой репозиторий → вкладка **"Actions"**
   - Должен появиться workflow **"Deploy to Selectel"**
   - Нажми на него и смотри логи

---

## ✅ Готово!

Теперь при каждом `git push` проект автоматически обновится на сервере Selectel.

---

## 🐛 Если что-то не работает

### Ошибка: "Permission denied (publickey)"

**Решение:**
- Проверь, что публичный ключ скопирован на сервер:
  ```bash
  ssh -i ~/.ssh/github_actions root@45.130.8.3 "cat ~/.ssh/authorized_keys | grep github-actions"
  ```
- Если ключа нет, скопируй снова (шаг 2)

### Ошибка: "Host key verification failed"

**Решение:**
- В GitHub Actions workflow добавь:
  ```yaml
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    key: ${{ secrets.SERVER_SSH_KEY }}
    script_stop: true
    script: |
      ssh-keyscan -H ${{ secrets.SERVER_HOST }} >> ~/.ssh/known_hosts
      cd /root/sels
      git pull origin main
      docker compose build
      docker compose up -d
  ```

### Ошибка: "docker compose: command not found"

**Решение:**
- На сервере проверь:
  ```bash
  docker compose version
  ```
- Если не установлен:
  ```bash
  apt install -y docker-compose-plugin
  ```

---

**Готово!** После настройки всё будет работать автоматически 🚀
