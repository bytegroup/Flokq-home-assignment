# Docker Commands Cheat Sheet

## Start Application
```bash
docker-compose up
```

## Start with rebuild
```bash
docker-compose up --build
```

## Start in background (detached mode)
```bash
docker-compose up -d
```

## Stop Application
```bash
docker-compose down
```

## Stop and remove volumes (clean slate)
```bash
docker-compose down -v
```

## View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

## Restart Services
```bash
# All services
docker-compose restart

# Specific service
docker-compose restart backend
```

## Access Container Shell
```bash
# Backend
docker exec -it autoparts-backend sh

# Frontend
docker exec -it autoparts-frontend sh

# MySQL
docker exec -it autoparts-mysql mysql -u root -p
```

## Check Service Status
```bash
docker-compose ps
```

## View Resource Usage
```bash
docker stats
```

## Clean Up Everything
```bash
# Remove all containers, networks, and volumes
docker-compose down -v
docker system prune -a
```
```

## Step 14: Final Project Structure

Your final structure:
```
project-root/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.local.example
│   ├── next.config.js
│   └── package.json
├── docker-compose.yml
├── README.md
├── DOCKER_COMMANDS.md
└── .gitignore