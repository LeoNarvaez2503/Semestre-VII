FROM kong:3.4

# Copiar la configuración declarativa
COPY kong.yml /etc/kong/kong.yml

# Exponer el puerto del proxy HTTP de Kong
EXPOSE 8000

# Variables de entorno por defecto para modo DB-less y seguridad
ENV KONG_DATABASE=off
ENV KONG_DECLARATIVE_CONFIG=/etc/kong/kong.yml
ENV KONG_PROXY_LISTEN="0.0.0.0:8000"
ENV KONG_HEADERS=off
ENV KONG_NGINX_HTTP_CLIENT_MAX_BODY_SIZE=10m
