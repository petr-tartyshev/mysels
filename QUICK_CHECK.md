# ⚡ Быстрая проверка GitHub Actions

## Что проверить прямо сейчас:

### 1. SSH ключ создан?
```bash
ls -la ~/.ssh/github_actions*
```
**Должны быть 2 файла.** Если нет — создай:
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions -N ""
```

---

### 2. Ключ скопирован на сервер?
```bash
ssh -i ~/.ssh/github_actions root@45.130.8.3 "echo 'OK'"
```
**Должно вывести "OK"** без запроса пароля.

Если не работает:
```bash
cat ~/.ssh/github_actions.pub | ssh root@45.130.8.3 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

---

### 3. Секреты в GitHub?
Открой: https://github.com/petr-tartyshev/mysels/settings/secrets/actions

**Должны быть 3 секрета:**
- `SERVER_HOST` = `45.130.8.3`
- `SERVER_USER` = `root`  
- `SERVER_SSH_KEY` = (содержимое `~/.ssh/github_actions`)

**Если нет — добавь их!**

---

### 4. Workflow файл в GitHub?
Открой: https://github.com/petr-tartyshev/mysels/tree/main/.github/workflows

**Должен быть файл `deploy.yml`**

Если нет — запушь:
```bash
cd /Users/petr/sels
git add .github/workflows/deploy.yml
git commit -m "feat: добавлен GitHub Actions"
git push origin main
```

---

### 5. Тест
```bash
cd /Users/petr/sels
echo "test" >> test.txt
git add test.txt
git commit -m "test: проверка деплоя"
git push origin main
```

Потом проверь: https://github.com/petr-tartyshev/mysels/actions

**Должен запуститься workflow "Deploy to Selectel"** ✅

---

**Выполни эти 5 шагов и напиши, что получилось!**
