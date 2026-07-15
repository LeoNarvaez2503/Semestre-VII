#!/bin/bash

# Script de Carga de Datos Semilla (Seed) para UrbanFlow
# Ejecuta curls contra el API Gateway en http://localhost:9000

GATEWAY_URL="http://localhost:9000"

# Colores para consola
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo -e "${BOLD}=== INICIANDO SEMBRADO DE DATOS (SEED) EN URBANFLOW ===${NC}"
echo "Conectando al API Gateway en: $GATEWAY_URL"
echo "--------------------------------------------------------"

# 1. Limpieza de base de datos en cascada para evitar conflictos FK
echo -e "${BLUE}Limpiando registros antiguos para asegurar la idempotencia...${NC}"
docker exec -i usuarios_db psql -U postgres -d usuarios -c "DELETE FROM user_role WHERE id_user IN (SELECT id_person FROM users WHERE username != 'root'); DELETE FROM users WHERE username != 'root'; DELETE FROM persons WHERE email != 'root@parqueadero.com';"
docker exec -i vehiculos_db psql -U admin -d vehiculos_db -c "TRUNCATE TABLE vehiculo CASCADE;"
docker exec -i zonas_db psql -U zonas_user -d zonas_db -c "TRUNCATE TABLE espacios CASCADE; TRUNCATE TABLE zonas CASCADE;"
echo -e "${GREEN}Bases de datos limpias.${NC}"

# Función extractora de JSON simple
extract_json_field() {
  local json="$1"
  local field="$2"
  echo "$json" | sed -n 's/.*"'"$field"'":"\([^"]*\)".*/\1/p'
}

# 2. Login como Root para obtener token administrativo
echo -e "\n${BLUE}Autenticando como Root...${NC}"
LOGIN_RESP=$(curl -s -X POST "$GATEWAY_URL/usuario/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "root", "password": "rootpassword123"}')

ROOT_TOKEN=$(extract_json_field "$LOGIN_RESP" "access_token")

if [ -z "$ROOT_TOKEN" ]; then
  echo -e "${RED}Error: No se pudo obtener el token de Root. Respuesta: $LOGIN_RESP${NC}"
  exit 1
fi
echo -e "${GREEN}Token Root obtenido exitosamente.${NC}"

# 3. Crear Usuarios Semilla
echo -e "\n${BLUE}Creando usuarios de prueba para cada rol...${NC}"

# A. Crear Administrador (DNI Ecuatoriano: 1723456784)
echo "Creando Usuario Administrador (admin_jordan)..."
ADMIN_RESP=$(curl -s -X POST "$GATEWAY_URL/usuario/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d '{"password": "adminpassword123", "person": {"dni": "1723456784", "email": "admin.jordan@parqueadero.com", "first_name": "Jordan", "last_name": "Narvaez", "middle_name": "Alexander", "nationality": "Ecuatoriana", "phone": "0987654321", "address": "Quito ESPE"}, "roles": ["Administrador"]}')
echo "Respuesta: $ADMIN_RESP"

# B. Crear Cliente 1 (DNI Ecuatoriano: 1718227653)
echo "Creando Usuario Cliente 1 (cliente_juan)..."
CLIENT1_RESP=$(curl -s -X POST "$GATEWAY_URL/usuario/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d '{"password": "clientepassword123", "person": {"dni": "1718227653", "email": "cliente.juan@parqueadero.com", "first_name": "Juan", "last_name": "Perez", "middle_name": "Carlos", "nationality": "Ecuatoriana", "phone": "0999999999", "address": "Av de los Granados Quito"}, "roles": ["Cliente"]}')
echo "Respuesta: $CLIENT1_RESP"
CLIENT1_ID=$(extract_json_field "$CLIENT1_RESP" "id_person")

# C. Crear Cliente 2 (DNI Ecuatoriano: 1722834015)
echo "Creando Usuario Cliente 2 (cliente_maria)..."
CLIENT2_RESP=$(curl -s -X POST "$GATEWAY_URL/usuario/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d '{"password": "clientepassword123", "person": {"dni": "1722834015", "email": "cliente.maria@parqueadero.com", "first_name": "Maria", "last_name": "Lopez", "middle_name": "Elena", "nationality": "Ecuatoriana", "phone": "0988888888", "address": "Cumbaya Quito"}, "roles": ["Cliente"]}')
echo "Respuesta: $CLIENT2_RESP"
CLIENT2_ID=$(extract_json_field "$CLIENT2_RESP" "id_person")

# 4. Crear Vehículos
echo -e "\n${BLUE}Creando vehículos de prueba asociados...${NC}"

# Vehículo 1: Auto Toyota
echo "Creando Vehículo 1 (Auto Toyota Yaris - PDF9876)..."
VEH1_RESP=$(curl -s -X POST "$GATEWAY_URL/vehiculo/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d '{"type": "Auto", "data": {"plate": "PDF9876", "brand": "Toyota", "model": "Yaris", "color": "Gris", "year": 2022, "classification": "Gasolina", "doors": 4, "fuelType": "Gasolina", "trunkCapacity": 350}}')
echo "Respuesta: $VEH1_RESP"
VEH1_ID=$(extract_json_field "$VEH1_RESP" "id")

# Vehículo 2: Auto Chevrolet
echo "Creando Vehículo 2 (Auto Chevrolet Sail - ABC1234)..."
VEH2_RESP=$(curl -s -X POST "$GATEWAY_URL/vehiculo/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d '{"type": "Auto", "data": {"plate": "ABC1234", "brand": "Chevrolet", "model": "Sail", "color": "Azul", "year": 2021, "classification": "Gasolina", "doors": 4, "fuelType": "Gasolina", "trunkCapacity": 370}}')
echo "Respuesta: $VEH2_RESP"
VEH2_ID=$(extract_json_field "$VEH2_RESP" "id")

# 5. Crear Zonas
echo -e "\n${BLUE}Creando zonas de parqueadero...${NC}"

# Zona A
ZONE_A_RESP=$(curl -s -X POST "$GATEWAY_URL/zona/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d '{"name": "Zona A - Planta Baja", "description": "Zona principal de estacionamiento regular", "type": "REGULAR", "capacidad": 10}')
ZONE_A_ID=$(extract_json_field "$ZONE_A_RESP" "zoneId")
echo "Zona A Creada (ID: $ZONE_A_ID)"

# Zona B
ZONE_B_RESP=$(curl -s -X POST "$GATEWAY_URL/zona/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d '{"name": "Zona B - Planta Alta", "description": "Zona de estacionamiento superior", "type": "REGULAR", "capacidad": 5}')
ZONE_B_ID=$(extract_json_field "$ZONE_B_RESP" "zoneId")
echo "Zona B Creada (ID: $ZONE_B_ID)"

# 6. Crear Espacios en las Zonas
echo -e "\n${BLUE}Creando y configurando plazas (espacios)...${NC}"

# Plazas en Zona A
# Plaza 101 - Disponible
SPACE101_RESP=$(curl -s -X POST "$GATEWAY_URL/espacio/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d '{"zoneId": "'"$ZONE_A_ID"'", "description": "Espacio E-101", "type": "AUTO", "estado": "DISPONIBLE"}')
SPACE101_ID=$(extract_json_field "$SPACE101_RESP" "id")
echo "Plaza E-101 Creada (ID: $SPACE101_ID) -> DISPONIBLE"

# Plaza 102 - Ocupada (por Vehículo 1)
SPACE102_RESP=$(curl -s -X POST "$GATEWAY_URL/espacio/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d '{"zoneId": "'"$ZONE_A_ID"'", "description": "Espacio E-102", "type": "AUTO", "estado": "DISPONIBLE"}')
SPACE102_ID=$(extract_json_field "$SPACE102_RESP" "id")
echo "Plaza E-102 Creada (ID: $SPACE102_ID) -> Ocupando con Vehículo 1..."
curl -s -X PUT "$GATEWAY_URL/espacio/estado/$SPACE102_ID/estado/OCUPADO?vehiculoId=$VEH1_ID" \
  -H "Authorization: Bearer $ROOT_TOKEN" >/dev/null
echo "Plaza E-102 -> OCUPADO"

# Plaza 103 - Reservada
SPACE103_RESP=$(curl -s -X POST "$GATEWAY_URL/espacio/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d '{"zoneId": "'"$ZONE_A_ID"'", "description": "Espacio E-103", "type": "AUTO", "estado": "DISPONIBLE"}')
SPACE103_ID=$(extract_json_field "$SPACE103_RESP" "id")
echo "Plaza E-103 Creada (ID: $SPACE103_ID) -> Reservando..."
curl -s -X PUT "$GATEWAY_URL/espacio/estado/$SPACE103_ID/estado/RESERVADO" \
  -H "Authorization: Bearer $ROOT_TOKEN" >/dev/null
echo "Plaza E-103 -> RESERVADO"

# Plazas en Zona B
# Plaza 201 - Disponible
SPACE201_RESP=$(curl -s -X POST "$GATEWAY_URL/espacio/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d '{"zoneId": "'"$ZONE_B_ID"'", "description": "Espacio E-201", "type": "AUTO", "estado": "DISPONIBLE"}')
SPACE201_ID=$(extract_json_field "$SPACE201_RESP" "id")
echo "Plaza E-201 Creada (ID: $SPACE201_ID) -> DISPONIBLE"

# Plaza 202 - Ocupada (por Vehículo 2)
SPACE202_RESP=$(curl -s -X POST "$GATEWAY_URL/espacio/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d '{"zoneId": "'"$ZONE_B_ID"'", "description": "Espacio E-202", "type": "AUTO", "estado": "DISPONIBLE"}')
SPACE202_ID=$(extract_json_field "$SPACE202_RESP" "id")
echo "Plaza E-202 Creada (ID: $SPACE202_ID) -> Ocupando con Vehículo 2..."
curl -s -X PUT "$GATEWAY_URL/espacio/estado/$SPACE202_ID/estado/OCUPADO?vehiculoId=$VEH2_ID" \
  -H "Authorization: Bearer $ROOT_TOKEN" >/dev/null
echo "Plaza E-202 -> OCUPADO"

echo -e "\n${BOLD}${GREEN}=== SEMBRADO DE DATOS COMPLETADO CON ÉXITO ===${NC}"
