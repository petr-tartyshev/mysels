# 🔨 Ручная пересборка на сервере

Если нужно пересобрать проект вручную на сервере:

## Команды для выполнения на сервере:

```bash
ssh root@45.130.8.3
cd /root/sels
git pull origin main
docker compose build
docker compose up -d
docker ps
curl http://localhost:3000
```

## Или используй GitHub Actions:

Просто сделай любой коммит и запушь:

```bash
cd /Users/petr/sels
echo "rebuild" >> .rebuild.txt
git add .rebuild.txt
git commit -m "chore: пересборка"
git push origin main
```

GitHub Actions автоматически обновит проект на сервере.
