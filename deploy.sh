#!/bin/bash

# Параметры
PROJECT_DIR="$(pwd)"
JAR_NAME="SpeakUpEngBot-0.0.1.jar"
LOG_FILE="$PROJECT_DIR/output.log"
BACKUP_FILE="$PROJECT_DIR/backup.sql"

# Проверка зависимостей
if ! command -v docker &> /dev/null; then
    echo "Docker не установлен. Установите Docker и Docker Compose."
    exit 1
fi

# Проверка наличия .env файла
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo "Файл .env не найден. Создайте его с переменными DB_PASSWORD, TELEGRAM_BOT_TOKEN, DEEPL_API_KEY, MYMEMORY_API_KEY."
    exit 1
fi

# Обновить код
echo "Pulling the latest code from the repository..."
git pull origin develop || { echo "Git pull failed"; exit 1; }

# Собрать проект
echo "Building the project with Maven..."
mvn clean package -Dmaven.test.skip=true || { echo "Maven build failed"; exit 1; }

# Остановить существующие контейнеры
echo "Stopping existing containers..."
docker-compose down

# Запустить контейнеры
echo "Starting bot and database with Docker Compose..."
docker-compose up --build -d || { echo "Docker Compose failed"; exit 1; }

# Ждать, пока база данных запустится
echo "Waiting for database to be ready..."
sleep 10

# Проверка статуса
echo "Checking container status..."
docker-compose ps

# Вывести логи
echo "Bot started. Following logs:"
docker-compose logs -f