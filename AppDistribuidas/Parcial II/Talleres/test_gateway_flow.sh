#!/bin/bash

# Script de prueba del flujo de integración a través de API Gateway (Puerto 9000)
# Requisitos: curl

GATEWAY_URL="http://localhost:9000"

echo "=== INICIANDO PRUEBA DE INTEGRACIÓN A TRAVÉS DEL API GATEWAY ==="
echo "Host base: $GATEWAY_URL"
echo ""

# 1. Crear Usuario
echo "1. Creando Usuario..."
USER_RESPONSE=$(curl -s -X POST "$GATEWAY_URL/usuario/crear" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "miPasswordSeguro123",
    "person": {
      "dni": "1723456789",
      "email": "test.usuario@example.com",
      "first_name": "Juan",
      "last_name": "Perez",
      "middle_name": "Carlos",
      "nationality": "Ecuatoriana",
      "phone": "0999999999",
      "address": "Av. de los Granados, Quito"
    },
    "roles": ["Cliente"]
  }')

echo "Respuesta Usuario: $USER_RESPONSE"
echo ""

# 2. Crear Vehículo
echo "2. Creando Vehículo..."
VEHICLE_RESPONSE=$(curl -s -X POST "$GATEWAY_URL/vehiculo/crear" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Auto",
    "data": {
      "plate": "PDF9876",
      "brand": "Toyota",
      "model": "Yaris",
      "color": "Gris",
      "year": 2022,
      "classification": "Gasolina",
      "doors": 4,
      "fuelType": "Gasolina",
      "trunkCapacity": 350
    }
  }')

echo "Respuesta Vehículo: $VEHICLE_RESPONSE"
echo ""

# 3. Crear una Zona
echo "3. Creando Zona de Parqueo..."
ZONE_RESPONSE=$(curl -s -X POST "$GATEWAY_URL/zona/crear" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zona A - Planta Baja",
    "description": "Zona principal de de estacionamiento",
    "type": "REGULAR",
    "capacidad": 10
  }')

echo "Respuesta Zona: $ZONE_RESPONSE"
echo ""

# Extraer el ID de la zona para crear el espacio
ZONE_ID=$(echo "$ZONE_RESPONSE" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

if [ -z "$ZONE_ID" ]; then
  echo "Error: No se pudo obtener el ID de la zona creada. Prueba detenida."
  exit 1
fi

echo "ID de Zona obtenido: $ZONE_ID"
echo ""

# 4. Crear un Espacio en esa Zona
echo "4. Creando Espacio..."
SPACE_RESPONSE=$(curl -s -X POST "$GATEWAY_URL/espacio/crear" \
  -H "Content-Type: application/json" \
  -d '{
    "zoneId": "'"$ZONE_ID"'",
    "description": "Espacio E-101",
    "type": "AUTO",
    "estado": "DISPONIBLE"
  }')

echo "Respuesta Espacio: $SPACE_RESPONSE"
echo ""

# Extraer el ID del espacio
SPACE_ID=$(echo "$SPACE_RESPONSE" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

if [ -z "$SPACE_ID" ]; then
  echo "Error: No se pudo obtener el ID del espacio creado. Prueba detenida."
  exit 1
fi

echo "ID de Espacio obtenido: $SPACE_ID"
echo ""

# 5. Ocupar el Espacio (Cambiar estado a OCUPADO)
echo "5. Ocupando el Espacio..."
OCCUPY_RESPONSE=$(curl -s -X PUT "$GATEWAY_URL/espacio/estado/$SPACE_ID/estado/OCUPADO")

echo "Respuesta Cambio de Estado: $OCCUPY_RESPONSE"
echo ""

echo "=== PRUEBA COMPLETADA EXITOSAMENTE ==="
