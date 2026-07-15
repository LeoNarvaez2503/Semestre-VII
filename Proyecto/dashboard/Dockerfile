FROM nginx:alpine

# Copiar archivos estáticos al directorio de Nginx
COPY . /usr/share/nginx/html

# Exponer puerto 80 interno
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
