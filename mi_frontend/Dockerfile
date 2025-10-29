# Usa una imagen base de Nginx muy ligera
FROM nginx:alpine

# Copia el archivo de configuración de Nginx personalizado
# Este archivo es crucial para el modo history de Vue Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia la carpeta 'dist' que ya has generado en tu máquina local 
# a la ubicación donde Nginx sirve contenido estático.
# (Asegúrate de ejecutar 'npm run build' antes de construir esta imagen)
COPY dist/ /usr/share/nginx/html/

# Exponemos el puerto por defecto de Nginx
EXPOSE 80

# El comando por defecto de Nginx se encarga de iniciar el servidor
CMD ["nginx", "-g", "daemon off;"]