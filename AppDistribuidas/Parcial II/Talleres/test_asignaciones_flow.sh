#!/bin/bash

# Script de prueba del flujo de integración del Microservicio de Asignaciones y Trazabilidad a través del API Gateway (Kong)
# Requisitos: curl

GATEWAY_URL="http://localhost:9000"

# Colores para la consola
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo -e "${BOLD}=== INICIANDO PRUEBAS DE INTEGRACIÓN PARA EL MICROSERVICIO DE ASIGNACIONES ===${NC}"
echo "Pasarela URL: $GATEWAY_URL"
echo "--------------------------------------------------------"

cleanup_db() {
  # Limpiar datos de pruebas previas para asegurar la idempotencia del script
  docker exec -i usuarios_db_unificado psql -U postgres -d usuarios -c "DELETE FROM users WHERE username IN ('jcperez', 'mgomez'); DELETE FROM persons WHERE email IN ('test.usuario@example.com', 'test.maria@example.com'); DELETE FROM roles WHERE name IN ('Cliente', 'Administrador');" >/dev/null 2>&1
  docker exec -i vehiculos_db_unificado psql -U admin -d vehiculos_db -c "DELETE FROM vehiculo WHERE placa IN ('PDF9876', 'PDF9999');" >/dev/null 2>&1
  docker exec -i asignaciones_db_unificado psql -U admin -d asignaciones_db -c "DELETE FROM asignaciones;" >/dev/null 2>&1
}

# Ejecutar limpieza inicial
cleanup_db

# Inicializar arrays de reporte
declare -a TEST_NAMES
declare -a TEST_STATUSES
declare -a TEST_CODES
declare -a TEST_DETAILS

test_index=0

# Función extractora de campos JSON simples
extract_json_field() {
  local json="$1"
  local field="$2"
  echo "$json" | sed -n 's/.*"'"$field"'":"\([^"]*\)".*/\1/p'
}

# Función principal para ejecutar casos de prueba
run_test_case() {
  local name="$1"
  local method="$2"
  local path="$3"
  local body="$4"
  local expected_code="$5"

  echo -e "\n${BOLD}[Ejecutando] $name...${NC}"
  
  local curl_cmd=(curl -s -L -w "%{http_code}" -o response.json)
  
  if [ -n "$body" ]; then
    curl_cmd+=(-H "Content-Type: application/json" -d "$body")
  fi

  # Ejecutar petición
  local status_code=$( "${curl_cmd[@]}" -X "$method" "$GATEWAY_URL$path" )
  local response_body=$(cat response.json)

  # Guardar response body a archivo temporal para leerlo sin usar subshells
  echo "$response_body" > last_response.json

  # Registrar en el reporte
  TEST_NAMES[$test_index]="$name"
  TEST_CODES[$test_index]="$status_code"

  local passed=true
  local details=""

  # Validar código HTTP
  if [ "$status_code" -ne "$expected_code" ]; then
    passed=false
    details="Esperaba HTTP $expected_code, pero obtuvo $status_code"
  fi

  # Registrar resultado final del caso de prueba
  if [ "$passed" = "true" ]; then
    TEST_STATUSES[$test_index]="PASSED"
    details="OK"
    echo -e "${GREEN}✔ Caso completado exitosamente (HTTP $status_code)${NC}"
  else
    TEST_STATUSES[$test_index]="FAILED"
    echo -e "${RED}✘ Caso fallido (HTTP $status_code)${NC}"
    echo "Respuesta del servidor: $response_body"
  fi
  
  TEST_DETAILS[$test_index]="$details"
  
  test_index=$((test_index + 1))
}

# ========================================================
# PREPARACIÓN DE DATOS (Usuarios, Vehículos y Roles)
# ========================================================

# 1. Crear Rol Cliente
run_test_case "Crear Rol 'Cliente'" \
  "POST" "/rol/crear" '{"name": "Cliente", "description": "Usuario regular"}' 201

# 2. Crear Usuario A (Juan Perez)
run_test_case "Crear Usuario A (Juan Perez)" \
  "POST" "/usuario/crear" '{"password": "miPasswordSeguro123", "person": {"dni": "1723456784", "email": "test.usuario@example.com", "first_name": "Juan", "last_name": "Perez", "middle_name": "Carlos", "nationality": "Ecuatoriana", "phone": "0999999999", "address": "Av. de los Granados, Quito"}, "roles": ["Cliente"]}' 201
USER_A_RESP=$(cat last_response.json)
USER_A_ID=$(extract_json_field "$USER_A_RESP" "id_person")

# 3. Crear Usuario B (Maria Gomez)
run_test_case "Crear Usuario B (Maria Gomez)" \
  "POST" "/usuario/crear" '{"password": "passwordGomez456", "person": {"dni": "1710034065", "email": "test.maria@example.com", "first_name": "Maria", "last_name": "Gomez", "middle_name": "Eugenia", "nationality": "Ecuatoriana", "phone": "0988888888", "address": "Guayaquil Centro"}, "roles": ["Cliente"]}' 201
USER_B_RESP=$(cat last_response.json)
USER_B_ID=$(extract_json_field "$USER_B_RESP" "id_person")

# 4. Crear Vehículo A (Auto PDF9876)
if [ -n "$USER_A_ID" ]; then
  run_test_case "Crear Vehículo A (Auto PDF9876)" \
    "POST" "/vehiculo/crear" '{"type": "Auto", "data": {"plate": "PDF9876", "brand": "Toyota", "model": "Yaris", "color": "Gris", "year": 2022, "classification": "Gasolina", "doors": 4, "fuelType": "Gasolina", "trunkCapacity": 350}}' 201
  VEHICLE_A_RESP=$(cat last_response.json)
  VEHICLE_A_ID=$(extract_json_field "$VEHICLE_A_RESP" "id")
fi

# 5. Crear Vehículo B (Auto PDF9999)
if [ -n "$USER_A_ID" ]; then
  run_test_case "Crear Vehículo B (Auto PDF9999)" \
    "POST" "/vehiculo/crear" '{"type": "Auto", "data": {"plate": "PDF9999", "brand": "Toyota", "model": "Corolla", "color": "Negro", "year": 2023, "classification": "Gasolina", "doors": 4, "fuelType": "Gasolina", "trunkCapacity": 400}}' 201
  VEHICLE_B_RESP=$(cat last_response.json)
  VEHICLE_B_ID=$(extract_json_field "$VEHICLE_B_RESP" "id")
fi

# Validar que tengamos los IDs necesarios para continuar
if [ -z "$USER_A_ID" ] || [ -z "$USER_B_ID" ] || [ -z "$VEHICLE_A_ID" ] || [ -z "$VEHICLE_B_ID" ]; then
  echo -e "${RED}ERROR: No se pudieron inicializar los registros previos de Usuarios o Vehículos.${NC}"
  cleanup_db
  rm -f response.json last_response.json
  exit 1
fi

# ========================================================
# PRUEBAS DEL MICROSERVICIO DE ASIGNACIONES
# ========================================================

# Caso 6: Crear Asignación Válida (Vehículo A a Usuario A)
run_test_case "Asignar Vehículo A a Usuario A (201)" \
  "POST" "/asignacion/crear" '{"userId": "'"$USER_A_ID"'", "vehicleId": "'"$VEHICLE_A_ID"'"}' 201

# Caso 7: Crear Asignación Duplicada Activa (Conflicto 409)
run_test_case "Intentar Re-asignar Vehículo A a Usuario A estando Activa (409)" \
  "POST" "/asignacion/crear" '{"userId": "'"$USER_A_ID"'", "vehicleId": "'"$VEHICLE_A_ID"'"}' 409

# Caso 8: Asignar el mismo vehículo a otro usuario (Conflicto 409)
run_test_case "Intentar Asignar Vehículo A a Usuario B (Conflicto 409)" \
  "POST" "/asignacion/crear" '{"userId": "'"$USER_B_ID"'", "vehicleId": "'"$VEHICLE_A_ID"'"}' 409

# Caso 9: Consultar la Flota Asignada a un Propietario (200)
run_test_case "Consultar Flota de Usuario A (200)" \
  "GET" "/asignacion/propietario/$USER_A_ID" "" 200

# Caso 10: Desactivar Asignación (Modificar a active=false - 200)
run_test_case "Desactivar Asignación de Vehículo A a Usuario A (200)" \
  "PUT" "/asignacion/actualizar/$USER_A_ID/$VEHICLE_A_ID" '{"active": false}' 200

# Caso 11: Asignar Vehículo A a Usuario B tras desactivar la asignación anterior (201)
run_test_case "Asignar Vehículo A (ahora inactivo) a Usuario B (201)" \
  "POST" "/asignacion/crear" '{"userId": "'"$USER_B_ID"'", "vehicleId": "'"$VEHICLE_A_ID"'"}' 201

# Caso 12: Intentar reactivar asignación de Usuario A cuando el vehículo ya está con B (409)
run_test_case "Intentar activar asignación de Usuario A con Vehículo A ocupado por B (409)" \
  "PUT" "/asignacion/actualizar/$USER_A_ID/$VEHICLE_A_ID" '{"active": true}' 409

# Caso 13: Intentar asignar con Usuario Inexistente (400)
run_test_case "Asignar a Usuario Inexistente (400)" \
  "POST" "/asignacion/crear" '{"userId": "00000000-0000-0000-0000-000000000000", "vehicleId": "'"$VEHICLE_B_ID"'"}' 400

# Caso 14: Intentar asignar con Vehículo Inexistente (400)
run_test_case "Asignar Vehículo Inexistente (400)" \
  "POST" "/asignacion/crear" '{"userId": "'"$USER_A_ID"'", "vehicleId": "00000000-0000-0000-0000-000000000000"}' 400

# Caso 15: Intentar asignar con UUID Inválido en el DTO (400)
run_test_case "Enviar UUID Inválido en la Creación (400)" \
  "POST" "/asignacion/crear" '{"userId": "no-es-uuid", "vehicleId": "'"$VEHICLE_B_ID"'"}' 400

# Caso 16: Actualizar asignación inexistente (404)
run_test_case "Actualizar Asignación Inexistente (404)" \
  "PUT" "/asignacion/actualizar/$USER_A_ID/$VEHICLE_B_ID" '{"active": false}' 404

# Caso 17: Eliminar lógicamente asignación existente (204)
run_test_case "Eliminar Lógicamente Asignación de Vehículo A con Usuario B (204)" \
  "DELETE" "/asignacion/eliminar/$USER_B_ID/$VEHICLE_A_ID" "" 204

# Caso 17b: Verificar directamente en la BD que la asignación sigue existiendo pero inactiva (eliminación lógica)
echo -e "\n${BOLD}[Verificación BD] Comprobando eliminación lógica...${NC}"
DB_ACTIVE_STATUS=$(docker exec -i asignaciones_db_unificado psql -U admin -d asignaciones_db -t -A -c "SELECT active FROM asignaciones WHERE user_id = '$USER_B_ID' AND vehicle_id = '$VEHICLE_A_ID';")
if [ "$DB_ACTIVE_STATUS" = "f" ]; then
  echo -e "${GREEN}✔ Confirmado en BD: La asignación persiste y su estado es active = false (eliminada lógicamente).${NC}"
else
  echo -e "${RED}✘ Error en BD: La asignación no existe o sigue activa (${DB_ACTIVE_STATUS}).${NC}"
fi

# Caso 18: Eliminar asignación ya inactiva / inexistente (404)
run_test_case "Eliminar Asignación ya Inactiva (404)" \
  "DELETE" "/asignacion/eliminar/$USER_B_ID/$VEHICLE_A_ID" "" 404

# Caso 19: Crear asignación enviando UUIDs con espacios (debe recortarlos en DTO/Servicio y crearse - 201)
run_test_case "Crear Asignación con espacios a los extremos del UUID (201)" \
  "POST" "/asignacion/crear" '{"userId": "   '"$USER_A_ID"'   ", "vehicleId": "   '"$VEHICLE_B_ID"'   "}' 201

# Caso 20: Consultar la flota de un propietario enviando el ID con espacios en la ruta (200)
run_test_case "Consultar Flota con espacios en el UUID de la ruta (200)" \
  "GET" "/asignacion/propietario/%20%20%20$USER_A_ID%20%20%20" "" 200



# ========================================================
# IMPRESIÓN DEL REPORTE FINAL DETALLADO
# ========================================================
echo -e "\n\n${BOLD}===============================================================================================================================${NC}"
echo -e "${BOLD}                                         REPORTE DE CASOS DE PRUEBA (ASIGNACIONES)                                             ${NC}"
echo -e "${BOLD}===============================================================================================================================${NC}"
printf "%-3s | %-65s | %-8s | %-6s | %-45s\n" "ID" "Caso de Prueba" "Estado" "HTTP" "Detalles"
echo "------------------------------------------------------------------------------------------------------------------------------------------------"

for ((i=0; i<test_index; i++)); do
  status="${TEST_STATUSES[$i]}"
  if [ "$status" = "PASSED" ]; then
    colored_status="${GREEN}${status}${NC}"
  else
    colored_status="${RED}${status}${NC}"
  fi
  printf "%-3s | %-65s | %-17s | %-6s | %-45s\n" \
    "$((i+1))" \
    "${TEST_NAMES[$i]}" \
    "$colored_status" \
    "${TEST_CODES[$i]}" \
    "${TEST_DETAILS[$i]}"
done
echo "================================================================================================================================================"

# Limpiar datos al finalizar
cleanup_db

# Limpieza de archivos temporales
rm -f response.json last_response.json
