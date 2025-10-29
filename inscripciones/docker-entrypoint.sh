#!/bin/sh
set -e

echo "Esperando que Postgres esté listo..."
while ! nc -z $DB_HOST $DB_PORT; do
  echo "Postgres no está disponible aún - esperando..."
  sleep 2
done

echo "Esperando que Redis esté listo..."
while ! nc -z $REDIS_HOST $REDIS_PORT; do
  echo "Redis no está disponible aún - esperando..."
  sleep 2
done

echo "Postgres y Redis están listos! Ejecutando migraciones..."

# Ejecutar migraciones y seeders
npm run db:migrate
npm run db:seed

echo "Iniciando aplicación..."
exec npm start