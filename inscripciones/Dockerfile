# Dockerfile
FROM node:23.9.0-alpine

# Usar el mismo WORKDIR que `docker-compose.yml` para evitar confusiones con volúmenes
WORKDIR /usr/src/app

# Instalar netcat para el script de espera
RUN apk add --no-cache netcat-openbsd

# Copiar archivos de dependencias primero
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Hacer ejecutable el script de entrada
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Usar el script como punto de entrada
ENTRYPOINT ["docker-entrypoint.sh"]