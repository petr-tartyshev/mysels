# ✅ Чеклист проверки GitHub Actions

## Что нужно проверить:

### 1. ✅ Файл workflow создан
- [x] Файл `.github/workflows/deploy.yml` существует
- [x] Workflow настроен на запуск при `push` в `main`

### 2. ⚠️ SSH ключ для GitHub Actions

**Проверь на Mac:**
```bash
ls -la ~/.ssh/github_actions*
```

**Должны быть 2 файла:**
- `~/.ssh/github_actions` (приватный ключ)
- `~/.ssh/github_actions.pub` (публичный ключ)

**Если файлов нет:**
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""
```

---

### 3. ⚠️ Публичный ключ скопирован на сервер

**Проверь подключение:**
```bash
ssh -i ~/.ssh/github_actions root@45.130.8.3 "echo 'Подключение работает'"
```

**Если не работает, скопируй ключ:**
```bash
cat ~/.ssh/github_actions.pub | ssh root@45.130.8.3 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

### 4. ⚠️ Секреты добавлены в GitHub

**Проверь в браузере:**
1. Открой: https://github.com/petr-tartyshev/mysels/settings/secrets/actions
2. Должны быть 3 секрета:
   - [ ] `SERVER_HOST` = `45.130.8.3`
   - [ ] `SERVER_USER` = `root`
   - [ ] `SERVER_SSH_KEY` = содержимое `~/.ssh/github_actions`

**Если секретов нет, добавь их:**
- Нажми **"New repository secret"**
- Добавь каждый секрет по очереди

---

### 5. ✅ Workflow файл в репозитории

**Проверь на GitHub:**
1. Открой: https://github.com/petr-tartyshev/mysels/tree/main/.github/workflows
2. Должен быть файл `deploy.yml`

**Если файла нет, запушь:**
```bash
cd /Users/petr/sels
git add .github/workflows/deploy.yml
git commit -m "feat: добавлен GitHub Actions workflow"
git push origin main
```

---

### 6. 🧪 Тест автоматического деплоя

**Сделай тестовый коммит:**
```bash
cd /Users/petr/sels
echo "# Test" >> TEST.md
git add TEST.md
git commit -m "test: проверка GitHub Actions"
git push origin main
```

**Проверь GitHub Actions:**
1. Открой: https://github.com/petr-tartyshev/mysels/actions
2. Должен появиться workflow **"Deploy to Selectel"**
3. Нажми на него и смотри логи

**Если workflow запустился и выполнился успешно (зелёная галочка) — всё работает! ✅**

---

## 🐛 Если что-то не работает

### Ошибка: "Permission denied (publickey)"
- Проверь, что публичный ключ скопирован на сервер (шаг 3)
- Проверь, что секрет `SERVER_SSH_KEY` содержит правильный приватный ключ

### Ошибка: "Host key verification failed"
- В workflow добавь `ssh-keyscan` перед основными командами

### Ошибка: "docker compose: command not found"
- На сервере установи: `apt install -y docker-compose-plugin`

---

**Выполни все шаги и отметь галочками, что готово!** ✅
