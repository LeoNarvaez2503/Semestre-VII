#!/bin/bash

# Script de prueba para el microservicio de Tickets y validaciones de negocio
# Requisitos: curl, docker

GATEWAY_URL="http://localhost:9000"

# Colores para la consola
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo -e "${BOLD}=== INICIANDO PRUEBAS DE INTEGRACIÓN DEL MICROSERVICIO DE TICKETS ===${NC}"
echo "Pasarela URL: $GATEWAY_URL"
echo "----------------------------------------------------------------------"

# Limpieza inicial de la base de datos
cleanup_db() {
  echo -e "\n${BOLD}Limpiando datos de prueba previos...${NC}"
  # Limpiar tickets locales
  docker exec -i tickets_db_unificado psql -U postgres -d tickets -c "DELETE FROM tickets;" >/dev/null 2>&1
  # Limpiar asignaciones
  docker exec -i asignaciones_db_unificado psql -U admin -d asignaciones_db -c "DELETE FROM asignaciones;" >/dev/null 2>&1
  # Limpiar vehículos
  docker exec -i vehiculos_db_unificado psql -U admin -d vehiculos_db -c "DELETE FROM vehiculo WHERE placa IN ('TKT9999', 'MT-123A');" >/dev/null 2>&1
  # Limpiar espacios y zonas
  docker exec -i zonas_db_unificado psql -U zonas_user -d zonas_db -c "DELETE FROM espacios WHERE description IN ('Espacio de auto para tickets', 'Espacio de moto para tickets', 'Espacio de auto 2 para tickets'); DELETE FROM zonas WHERE name = 'Zona Tickets';" >/dev/null 2>&1
  # Limpiar usuarios/personas
  docker exec -i usuarios_db_unificado psql -U postgres -d usuarios -c "DELETE FROM persons WHERE email = 'ticket.test@example.com';" >/dev/null 2>&1
  echo -e "${GREEN}Limpieza completada.${NC}"
}

cleanup_db

# Helper para extraer campos JSON usando python
extract_json_field() {
  local json="$1"
  local field="$2"
  python -c "import json, sys; d=json.loads(sys.argv[1]); print(d.get(sys.argv[2], ''))" "$json" "$field"
}

# Obtener token de Root
echo -e "\n${BOLD}Obteniendo token de Root...${NC}"
response=$(curl -s -X POST "$GATEWAY_URL/usuario/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "root", "password": "rootpassword123"}')
ROOT_TOKEN=$(extract_json_field "$response" "access_token")

if [ -z "$ROOT_TOKEN" ]; then
  echo -e "${RED}Error: No se pudo iniciar sesión como Root.${NC}"
  exit 1
fi

ROOT_USER_ID=$(curl -s -X GET "$GATEWAY_URL/usuario/me" -H "Authorization: Bearer $ROOT_TOKEN" | python -c "import json, sys; print(json.load(sys.stdin).get('id_person', ''))")
echo -e "${GREEN}Root Token obtenido. ID Usuario Root: $ROOT_USER_ID${NC}"

# 1. Crear un usuario Cliente de prueba
echo -e "\n${BOLD}Creando usuario Cliente de prueba...${NC}"
user_body='{
  "password": "miPasswordSeguro123",
  "person": {
    "dni": "1723456784",
    "email": "ticket.test@example.com",
    "first_name": "Juan",
    "last_name": "Perez",
    "middle_name": "Carlos",
    "nationality": "Ecuatoriana",
    "phone": "0987654321",
    "address": "Quito"
  },
  "roles": ["Cliente"]
}'
response=$(curl -s -X POST "$GATEWAY_URL/usuario/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d "$user_body")
CLIENT_USER_ID=$(extract_json_field "$response" "id_person")
CLIENT_USERNAME=$(extract_json_field "$response" "username")

if [ -z "$CLIENT_USER_ID" ]; then
  echo -e "${RED}Error: No se pudo crear el usuario Cliente. Respuesta: $response${NC}"
  exit 1
fi
echo -e "${GREEN}Cliente creado exitosamente. ID: $CLIENT_USER_ID, Username: $CLIENT_USERNAME${NC}"

# Obtener token del Cliente
response=$(curl -s -X POST "$GATEWAY_URL/usuario/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$CLIENT_USERNAME\", \"password\": \"miPasswordSeguro123\"}")
CLIENT_TOKEN=$(extract_json_field "$response" "access_token")
if [ -z "$CLIENT_TOKEN" ]; then
  echo -e "${RED}Error: No se pudo iniciar sesión con el cliente $CLIENT_USERNAME.${NC}"
  exit 1
fi
echo -e "${GREEN}Token de Cliente obtenido exitosamente.${NC}"


# 2. Crear vehículos de prueba
echo -e "\n${BOLD}Creando vehículos de prueba (AUTO y MOTO)...${NC}"
auto_body='{
  "type": "Auto",
  "data": {
    "plate": "TKT9999",
    "brand": "Toyota",
    "model": "Yaris",
    "color": "Negro",
    "year": 2022,
    "classification": "Gasolina",
    "doors": 4,
    "trunkCapacity": 350,
    "fuelType": "Gasolina"
  }
}'
response=$(curl -s -X POST "$GATEWAY_URL/vehiculo/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d "$auto_body")
AUTO_ID=$(extract_json_field "$response" "id")

moto_body='{
  "type": "Moto",
  "data": {
    "plate": "MT-123A",
    "brand": "Yamaha",
    "model": "YZF",
    "color": "Azul",
    "year": 2021,
    "classification": "Gasolina",
    "type": "Deportiva"
  }
}'
response=$(curl -s -X POST "$GATEWAY_URL/vehiculo/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d "$moto_body")
MOTO_ID=$(extract_json_field "$response" "id")

echo -e "${GREEN}Vehículos creados. Auto ID: $AUTO_ID, Moto ID: $MOTO_ID${NC}"


# 3. Asignar vehículos al Cliente
echo -e "\n${BOLD}Asignando vehículos al cliente...${NC}"
curl -s -X POST "$GATEWAY_URL/asignacion/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d "{\"userId\": \"$CLIENT_USER_ID\", \"vehicleId\": \"$AUTO_ID\"}" >/dev/null
curl -s -X POST "$GATEWAY_URL/asignacion/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d "{\"userId\": \"$CLIENT_USER_ID\", \"vehicleId\": \"$MOTO_ID\"}" >/dev/null
echo -e "${GREEN}Asignaciones registradas.${NC}"


# 4. Crear Zona y Espacios de Parqueo
echo -e "\n${BOLD}Creando Zona y Espacios (AUTO y MOTO)...${NC}"
zone_body='{
  "name": "Zona Tickets",
  "description": "Zona para pruebas de tickets",
  "type": "REGULAR",
  "capacidad": 10
}'
response=$(curl -s -X POST "$GATEWAY_URL/zona/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d "$zone_body")
ZONE_ID=$(extract_json_field "$response" "zoneId")

space_auto_body="{
  \"zoneId\": \"$ZONE_ID\",
  \"description\": \"Espacio de auto para tickets\",
  \"type\": \"AUTO\",
  \"estado\": \"DISPONIBLE\"
}"
response=$(curl -s -X POST "$GATEWAY_URL/espacio/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d "$space_auto_body")
SPACE_AUTO_ID=$(extract_json_field "$response" "id")

space_moto_body="{
  \"zoneId\": \"$ZONE_ID\",
  \"description\": \"Espacio de moto para tickets\",
  \"type\": \"MOTO\",
  \"estado\": \"DISPONIBLE\"
}"
response=$(curl -s -X POST "$GATEWAY_URL/espacio/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d "$space_moto_body")
SPACE_MOTO_ID=$(extract_json_field "$response" "id")

space_auto_body2="{
  \"zoneId\": \"$ZONE_ID\",
  \"description\": \"Espacio de auto 2 para tickets\",
  \"type\": \"AUTO\",
  \"estado\": \"DISPONIBLE\"
}"
response=$(curl -s -X POST "$GATEWAY_URL/espacio/crear" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ROOT_TOKEN" \
  -d "$space_auto_body2")
SPACE_AUTO_ID2=$(extract_json_field "$response" "id")

echo -e "${GREEN}Zona y Espacios creados. Zone ID: $ZONE_ID, Space Auto: $SPACE_AUTO_ID, Space Moto: $SPACE_MOTO_ID, Space Auto 2: $SPACE_AUTO_ID2${NC}"


# Arrays para almacenar reportes de prueba
declare -a TEST_NAMES
declare -a TEST_RESULTS
declare -a TEST_CODES

test_index=0

run_test() {
  local name="$1"
  local method="$2"
  local url="$3"
  local body="$4"
  local expected_code="$5"
  local token="$6"

  echo -e "\n${BOLD}[Test $((test_index+1))] $name${NC}"
  
  local headers=(-H "Content-Type: application/json")
  if [ -n "$token" ]; then
    headers+=(-H "Authorization: Bearer $token")
  fi

  local code
  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "%{http_code}" -o response_test.json -X GET "$GATEWAY_URL$url" "${headers[@]}")
  else
    response=$(curl -s -w "%{http_code}" -o response_test.json -X "$method" "$GATEWAY_URL$url" "${headers[@]}" -d "$body")
  fi

  local body_out=$(cat response_test.json)
  echo "Response Code: $response"
  echo "Response Body: $body_out"

  TEST_NAMES[$test_index]="$name"
  TEST_CODES[$test_index]="$response"

  if [ "$response" -eq "$expected_code" ]; then
    echo -e "${GREEN}PASSED${NC}"
    TEST_RESULTS[$test_index]="PASSED"
  else
    echo -e "${RED}FAILED (Esperaba $expected_code, obtuvo $response)${NC}"
    TEST_RESULTS[$test_index]="FAILED"
  fi
  
  test_index=$((test_index+1))
}

# --- CASOS DE PRUEBA DE REGLAS DE NEGOCIO ---

# 1. Compra de Ticket Exitoso (Caso Feliz: Auto en Espacio Auto)
ticket_body="{
  \"id_espacio\": \"$SPACE_AUTO_ID\",
  \"id_vehiculo\": \"$AUTO_ID\",
  \"id_usuario\": \"$CLIENT_USER_ID\"
}"
run_test "Crear Ticket Auto en Espacio Auto (Exitoso)" "POST" "/ticket/crear" "$ticket_body" 201 "$CLIENT_TOKEN"
TICKET_AUTO_ID=$(extract_json_field "$(cat response_test.json)" "id_ticket")
CODIGO_TICKET=$(extract_json_field "$(cat response_test.json)" "codigo_ticket")

# Validar formato de codigo_ticket
echo "Código de Ticket generado: $CODIGO_TICKET"
# format is ZONATICKETS_TKT9999_YYYYMMDDHHMMSS
if [[ "$CODIGO_TICKET" =~ ZONATICKETS_TKT9999_[0-9]{14} ]]; then
  echo -e "${GREEN}Formato del identificador único (zona_placa_fechaingreso) es válido.${NC}"
else
  echo -e "${RED}Error: El identificador único no cumple con el formato requerido.${NC}"
fi

# 2. Validar que el espacio cambió de estado a OCUPADO en Zonas
run_test "Verificar estado del Espacio Auto 1 (Debe ser OCUPADO)" "GET" "/espacio/obtener/$SPACE_AUTO_ID" "" 200 "$ROOT_TOKEN"
ESPACE_STATUS=$(extract_json_field "$(cat response_test.json)" "estado")
if [ "$ESPACE_STATUS" = "OCUPADO" ]; then
  echo -e "${GREEN}Estado de espacio actualizado correctamente a OCUPADO.${NC}"
else
  echo -e "${RED}Error: El estado del espacio sigue siendo $ESPACE_STATUS.${NC}"
fi

# 3. Validación: No se debe poder comprar un ticket sobre un espacio ocupado (Mismo Espacio)
ticket_body_dup="{
  \"id_espacio\": \"$SPACE_AUTO_ID\",
  \"id_vehiculo\": \"$MOTO_ID\",
  \"id_usuario\": \"$ROOT_USER_ID\"
}"
run_test "Intentar comprar ticket en espacio ya ocupado (Debe dar 400)" "POST" "/ticket/crear" "$ticket_body_dup" 400 "$CLIENT_TOKEN"

# 4. Validación: Si una persona ya tiene un ticket activo, no puede ocupar otro espacio
ticket_body_user_dup="{
  \"id_espacio\": \"$SPACE_AUTO_ID2\",
  \"id_vehiculo\": \"$MOTO_ID\",
  \"id_usuario\": \"$CLIENT_USER_ID\"
}"
run_test "Intentar comprar segundo ticket para el mismo usuario (Debe dar 400)" "POST" "/ticket/crear" "$ticket_body_user_dup" 400 "$CLIENT_TOKEN"

# 5. Validación: Tipos de vehículo y espacio incompatibles (Moto en Espacio Auto)
ticket_body_incompat="{
  \"id_espacio\": \"$SPACE_AUTO_ID2\",
  \"id_vehiculo\": \"$MOTO_ID\",
  \"id_usuario\": \"$ROOT_USER_ID\"
}"
run_test "Intentar asignar Moto a Espacio Auto (Debe dar 400)" "POST" "/ticket/crear" "$ticket_body_incompat" 400 "$ROOT_TOKEN"

# 6. Búsqueda de tickets usando id_usuario e id_vehiculo
run_test "Buscar ticket por id_usuario e id_vehiculo (Debe dar 200)" "GET" "/ticket/buscar?id_usuario=$CLIENT_USER_ID&id_vehiculo=$AUTO_ID" "" 200 "$CLIENT_TOKEN"

# 7. Pagar el ticket (Caso Feliz: Finalizar y calcular tarifa)
# Para forzar un tiempo, el script calculará al menos 1 hora de tarifa (mínimo)
# Tasa de Auto en Espacio Auto: $2.00 por hora. Esperado = $2.00
run_test "Pagar ticket de Auto (Debe calcular tarifa e inhabilitar ticket)" "POST" "/ticket/pagar/$TICKET_AUTO_ID" "" 200 "$CLIENT_TOKEN"
VALOR_RECAUDADO=$(extract_json_field "$(cat response_test.json)" "valor_recaudado")
ESTADO_TICKET=$(extract_json_field "$(cat response_test.json)" "estado_ticket")

echo "Valor Recaudado: $VALOR_RECAUDADO"
echo "Estado Ticket: $ESTADO_TICKET"

# Python comparison to avoid float format differences (e.g. 2.0 vs 2)
is_correct_rate=$(python -c "print(abs(float('$VALOR_RECAUDADO') - 2.0) < 1e-5)")

if [ "$ESTADO_TICKET" = "pagado" ] && [ "$is_correct_rate" = "True" ]; then
  echo -e "${GREEN}Ticket pagado y tarifa de $2.00 liquidada correctamente.${NC}"
else
  echo -e "${RED}Error: Tarifa o estado del ticket incorrecto.${NC}"
fi

# 8. Validar que el espacio cambió de estado a DISPONIBLE tras el pago
run_test "Verificar estado del Espacio Auto 1 post-pago (Debe ser DISPONIBLE)" "GET" "/espacio/obtener/$SPACE_AUTO_ID" "" 200 "$ROOT_TOKEN"
ESPACE_STATUS_POST=$(extract_json_field "$(cat response_test.json)" "estado")
if [ "$ESPACE_STATUS_POST" = "DISPONIBLE" ]; then
  echo -e "${GREEN}El espacio fue liberado y se encuentra DISPONIBLE.${NC}"
else
  echo -e "${RED}Error: El estado del espacio es $ESPACE_STATUS_POST y debería ser DISPONIBLE.${NC}"
fi


# --- IMPRIMIR TABLA DE RESULTADOS DE PRUEBA ---
echo -e "\n========================================= REPORT DE PRUEBAS DE TICKETS ========================================="
printf "%-3s | %-60s | %-10s | %-6s\n" "Nº" "Caso de Prueba" "Resultado" "Código"
echo "----------------------------------------------------------------------------------------------------------------"
for ((i=0; i<test_index; i++)); do
  color=$GREEN
  if [ "${TEST_RESULTS[$i]}" = "FAILED" ]; then
    color=$RED
  fi
  printf "%-3s | %-60s | %b%-10s%b | %-6s\n" "$((i+1))" "${TEST_NAMES[$i]}" "$color" "${TEST_RESULTS[$i]}" "$NC" "${TEST_CODES[$i]}"
done
echo "================================================================================================================"

rm -f response_test.json
