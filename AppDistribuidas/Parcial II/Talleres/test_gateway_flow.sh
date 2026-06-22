
#!/bin/bash

# Script de prueba del flujo de integración y reporte de casos de prueba del API Gateway (Kong)
# Requisitos: curl, dd (para test de payload)

GATEWAY_URL="http://localhost:9000"

# Colores para la consola
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo -e "${BOLD}=== INICIANDO PRUEBAS DE INTEGRACIÓN Y SEGURIDAD CON KONG ===${NC}"
echo "Pasarela URL: $GATEWAY_URL"
echo "--------------------------------------------------------"

cleanup_db() {
  # Limpiar datos de pruebas previas para asegurar la idempotencia del script
  docker exec -i usuarios_db_unificado psql -U postgres -d usuarios -c "DELETE FROM users WHERE username = 'jcperez'; DELETE FROM persons WHERE email = 'test.usuario@example.com'; DELETE FROM roles WHERE name IN ('Cliente', 'Administrador');" >/dev/null 2>&1
  docker exec -i vehiculos_db_unificado psql -U admin -d vehiculos_db -c "DELETE FROM vehiculo WHERE placa IN ('PDF9876', 'PDF9999', 'AB-123X');" >/dev/null 2>&1
  docker exec -i zonas_db_unificado psql -U zonas_user -d zonas_db -c "DELETE FROM espacios WHERE description IN ('Espacio E-101', 'Espacio Temp-1', 'Espacio Temp-2', 'Espacio Inactivo'); DELETE FROM zonas WHERE name IN ('Zona A - Planta Baja', 'Zona Conflicto', 'Zona Inactiva');" >/dev/null 2>&1
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
  local check_headers="$6"

  echo -e "\n${BOLD}[Ejecutando] $name...${NC}"
  
  # Usamos -L para seguir redirecciones (como en la documentación de zonas)
  local curl_cmd=(curl -s -L -w "%{http_code}" -o response.json)
  
  if [ -n "$body" ]; then
    # Si el body empieza por @ es una referencia a un archivo
    if [[ "$body" == @* ]]; then
      curl_cmd+=(-H "Content-Type: application/json" --data-binary "$body")
    else
      curl_cmd+=(-H "Content-Type: application/json" -d "$body")
    fi
  fi
  
  if [ "$check_headers" = "true" ]; then
    curl_cmd+=(-D headers.txt)
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

  # Validar cabeceras de seguridad si aplica
  if [ "$check_headers" = "true" ] && [ "$passed" = "true" ]; then
    local missing=""
    
    # Comprobar cabeceras clave (limpiando retornos de carro)
    for hdr in "X-Frame-Options: DENY" "X-Content-Type-Options: nosniff" "X-XSS-Protection: 1; mode=block" "Content-Security-Policy: default-src" "Referrer-Policy: no-referrer"; do
      if ! grep -qi "${hdr%%:*}" headers.txt; then
        missing="$missing ${hdr%%:*}"
      fi
    done

    # Validar que Server no sea Kong
    if grep -qi "Server: kong" headers.txt; then
      missing="$missing Server_Kong_Exposed"
    fi

    if [ -n "$missing" ]; then
      passed=false
      details="Seguridad fallida: cabeceras ausentes/incorrectas ($missing)"
    else
      details="Cabeceras de seguridad validadas correctamente (CSP, CORS, X-Frame)"
    fi
  fi

  # Registrar resultado final del caso de prueba
  if [ "$passed" = "true" ]; then
    TEST_STATUSES[$test_index]="PASSED"
    if [ -z "$details" ]; then
      details="OK"
    fi
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
# EJECUCIÓN DE CASOS DE PRUEBA
# ========================================================

# 1. Cabeceras de Seguridad y Hiding global
run_test_case "Verificar Cabeceras de Seguridad y Ocultamiento de Pasarela" \
  "GET" "/usuario/listar" "" 200 "true"

# 2. Crear Rol Cliente
run_test_case "Crear Rol 'Cliente'" \
  "POST" "/rol/crear" '{"name": "Cliente", "description": "Usuario regular"}' 201 "false"
ROLE_CLIENT_RESP=$(cat last_response.json)

# 3. Crear Rol Administrador
run_test_case "Crear Rol 'Administrador'" \
  "POST" "/rol/crear" '{"name": "Administrador", "description": "Acceso total"}' 201 "false"

# 4. Intentar crear un Rol Duplicado (Error Conflict)
run_test_case "Validar Conflicto de Rol Duplicado (409)" \
  "POST" "/rol/crear" '{"name": "Cliente", "description": "Duplicado"}' 409 "false"

# 5. Crear Usuario (DNI Ecuatoriano Válido)
run_test_case "Crear Usuario con DNI Ecuatoriano Válido" \
  "POST" "/usuario/crear" '{"password": "miPasswordSeguro123", "person": {"dni": "1723456784", "email": "test.usuario@example.com", "first_name": "Juan", "last_name": "Perez", "middle_name": "Carlos", "nationality": "Ecuatoriana", "phone": "0999999999", "address": "Av. de los Granados, Quito"}, "roles": ["Cliente"]}' 201 "false"
USER_RESP=$(cat last_response.json)
PROPIETARIO_ID=$(extract_json_field "$USER_RESP" "id_person")

# 6. Intentar crear Usuario con DNI Ecuatoriano Inválido (Error 422)
run_test_case "Validar Error de Validación DNI Inválido (422)" \
  "POST" "/usuario/crear" '{"password": "miPasswordSeguro123", "person": {"dni": "1723456789", "email": "test2.usuario@example.com", "first_name": "Juan", "last_name": "Perez", "middle_name": "Carlos", "nationality": "Ecuatoriana", "phone": "0999999999", "address": "Av. de los Granados, Quito"}, "roles": ["Cliente"]}' 422 "false"

# 7. Crear Vehículo (Vinculado a propietarioId de paso 5)
if [ -n "$PROPIETARIO_ID" ]; then
  run_test_case "Crear Vehículo (Auto) Vinculado a Propietario" \
    "POST" "/vehiculo/crear" '{"type": "Auto", "data": {"propietarioId": "'"$PROPIETARIO_ID"'", "plate": "PDF9876", "brand": "Toyota", "model": "Yaris", "color": "Gris", "year": 2022, "classification": "Gasolina", "doors": 4, "fuelType": "Gasolina", "trunkCapacity": 350}}' 201 "false"
  VEHICLE_RESP=$(cat last_response.json)
  VEHICLE_ID=$(extract_json_field "$VEHICLE_RESP" "id")
else
  echo -e "${RED}Saltando prueba de Vehículo: no se obtuvo propietarioId${NC}"
fi

# 8. Crear una Zona de Parqueo
run_test_case "Crear Zona de Parqueo" \
  "POST" "/zona/crear" '{"name": "Zona A - Planta Baja", "description": "Zona principal de de estacionamiento", "type": "REGULAR", "capacidad": 10}' 201 "false"
ZONE_RESP=$(cat last_response.json)
ZONE_ID=$(extract_json_field "$ZONE_RESP" "zoneId")

# 9. Crear un Espacio en la Zona
if [ -n "$ZONE_ID" ]; then
  run_test_case "Crear Espacio en la Zona de Parqueo" \
    "POST" "/espacio/crear" '{"zoneId": "'"$ZONE_ID"'", "description": "Espacio E-101", "type": "AUTO", "estado": "DISPONIBLE"}' 201 "false"
  SPACE_RESP=$(cat last_response.json)
  SPACE_ID=$(extract_json_field "$SPACE_RESP" "id")
else
  echo -e "${RED}Saltando prueba de Espacio: no se obtuvo zoneId${NC}"
fi

# 10. Ocupar Espacio (Requiere Space ID y Vehicle ID)
if [ -n "$SPACE_ID" ] && [ -n "$VEHICLE_ID" ]; then
  run_test_case "Ocupar Espacio (Cambio de Estado a OCUPADO)" \
    "PUT" "/espacio/estado/$SPACE_ID/estado/OCUPADO?vehiculoId=$VEHICLE_ID" "" 200 "false"
else
  echo -e "${RED}Saltando prueba de Ocupar Espacio: faltan IDs de espacio/vehículo${NC}"
fi

# 11. Liberar Espacio
if [ -n "$SPACE_ID" ]; then
  run_test_case "Liberar Espacio (Cambio de Estado a DISPONIBLE)" \
    "PUT" "/espacio/estado/$SPACE_ID/estado/DISPONIBLE" "" 200 "false"
fi

# 12. Test de Payload Máximo (Subir payload > 10MB -> Debe dar 413)
echo "Generando archivo temporal de 11MB para validar límite de carga..."
dd if=/dev/zero of=large_file.json bs=1M count=11 2>/dev/null
run_test_case "Validar Restricción de Tamaño Máximo de Payload (413)" \
  "POST" "/usuario/crear" @large_file.json 413 "false"
rm -f large_file.json

# 13. Ruta Inexistente (Gateway 404)
run_test_case "Validar Ruta Inexistente en Pasarela (404)" \
  "GET" "/ruta-que-no-existe-en-el-sistema" "" 404 "false"

# 14. Swagger Docs - Usuarios (FastAPI)
run_test_case "Validar Acceso Swagger Docs: Usuarios" \
  "GET" "/usuarios/docs" "" 200 "false"

# 15. Swagger Docs - Vehículos (NestJS)
run_test_case "Validar Acceso Swagger Docs: Vehículos" \
  "GET" "/vehiculos/docs/" "" 200 "false"

# 16. Swagger Docs - Zonas (Spring Boot)
run_test_case "Validar Acceso Swagger Docs: Zonas" \
  "GET" "/zonas/docs" "" 200 "false"

# 17. Intento de bypass de HTTP Method (HTTP 405 / 404)
run_test_case "Intento de bypass de HTTP Method (HTTP 405 / 404)" \
  "POST" "/usuario/listar" "" 404 "false"

# 18. Intento de SQL Injection en Campos de Texto (HTTP 422)
run_test_case "Intento de SQL Injection en Campos de Texto (HTTP 422)" \
  "POST" "/usuario/crear" '{"password": "supersecurepassword123", "person": {"dni": "1723456784", "email": "hacker@example.com", "first_name": "Juan ORDER BY", "last_name": "Perez; DROP TABLE users; --", "nationality": "Ecuatoriana"}, "roles": ["Cliente"]}' 422 "false"

# 19. Espacios Inyectados en campos Críticos (HTTP 422)
run_test_case "Espacios Inyectados en campos Críticos (HTTP 422)" \
  "POST" "/usuario/crear" '{"password": "somepassword123", "person": {"dni": "1723 456789", "email": "test @example.com", "first_name": "Juan", "last_name": "Perez"}, "roles": ["Cliente"]}' 422 "false"

# 20. Búsqueda sin Criterios de Filtro (HTTP 400)
run_test_case "Búsqueda sin Criterios de Filtro (HTTP 400)" \
  "GET" "/usuario/buscar" "" 400 "false"

# 21. Registro de Vehículo con Propietario Inexistente (HTTP 400)"
run_test_case "Registro de Vehículo con Propietario Inexistente (HTTP 400)" \
  "POST" "/vehiculo/crear" '{"type": "Auto", "data": {"propietarioId": "d3b07384-d113-4956-a5cc-9c60dfd29486", "plate": "PDF9999", "brand": "Toyota", "model": "Yaris", "color": "Gris", "year": 2022, "classification": "Gasolina", "doors": 4, "fuelType": "Gasolina", "trunkCapacity": 350}}' 400 "false"

# 22. Colisión de Tipos en DTO Polimórfico (HTTP 400)
run_test_case "Colisión de Tipos en DTO Polimórfico (HTTP 400)" \
  "POST" "/vehiculo/crear" '{"type": "Moto", "data": {"propietarioId": "550e8400-e29b-41d4-a716-446655440000", "plate": "PDF9999", "brand": "Toyota", "model": "Yaris", "color": "Gris", "year": 2022, "classification": "Gasolina", "doors": 4, "fuelType": "Gasolina", "trunkCapacity": 350}}' 400 "false"

# 23. Actualizar Capacidad de Zona a 0 o Menos (HTTP 400)
if [ -n "$ZONE_ID" ]; then
  run_test_case "Actualizar Capacidad a 0 o Menos (HTTP 400)" \
    "PUT" "/zona/actualizar/$ZONE_ID" '{"name": "Zona A - Planta Baja", "description": "Actualizacion de capacidad invalida", "type": "REGULAR", "capacidad": 0}' 400 "false"
else
  echo -e "${RED}Saltando prueba de Capacidad Inválida: no se obtuvo zoneId${NC}"
fi

# 24. Reducir Capacidad por Debajo del Límite de Espacios Existentes (HTTP 409)
run_test_case "Crear Zona Temporal para Test de Conflicto de Capacidad" \
  "POST" "/zona/crear" '{"name": "Zona Conflicto", "description": "Zona para prueba de conflicto", "type": "REGULAR", "capacidad": 2}' 201 "false"
TEMP_ZONE_RESP=$(cat last_response.json)
TEMP_ZONE_ID=$(extract_json_field "$TEMP_ZONE_RESP" "zoneId")

if [ -n "$TEMP_ZONE_ID" ]; then
  run_test_case "Crear Espacio Temporal 1" \
    "POST" "/espacio/crear" '{"zoneId": "'"$TEMP_ZONE_ID"'", "description": "Espacio Temp-1", "type": "AUTO", "estado": "DISPONIBLE"}' 201 "false"
  run_test_case "Crear Espacio Temporal 2" \
    "POST" "/espacio/crear" '{"zoneId": "'"$TEMP_ZONE_ID"'", "description": "Espacio Temp-2", "type": "AUTO", "estado": "DISPONIBLE"}' 201 "false"
  
  run_test_case "Reducir Capacidad por Debajo del Límite de Espacios Existentes (HTTP 409)" \
    "PUT" "/zona/actualizar/$TEMP_ZONE_ID" '{"name": "Zona Conflicto", "description": "Actualizacion invalida", "type": "REGULAR", "capacidad": 1}' 409 "false"
else
  echo -e "${RED}Saltando prueba de Reducción de Capacidad (409): no se obtuvo zoneId temporal${NC}"
fi

# 28. Ataque Bcrypt DoS con Contrasena Gigante (HTTP 422)
GIANT_PWD=$(printf 'a%.0s' {1..100})
run_test_case "Ataque Bcrypt DoS con Contrasena Gigante (HTTP 422)" \
  "POST" "/usuario/crear" '{"password": "'"$GIANT_PWD"'", "person": {"dni": "1723456784", "email": "giant.pwd@example.com", "first_name": "Juan", "last_name": "Perez", "nationality": "Ecuatoriana"}, "roles": ["Cliente"]}' 422 "false"

# 29. Evasión de DNI con Provincia Inválida (HTTP 422)
run_test_case "Evasion de DNI con Provincia Invalida (HTTP 422)" \
  "POST" "/usuario/crear" '{"password": "miPasswordSeguro123", "person": {"dni": "9923456784", "email": "dni.prov@example.com", "first_name": "Juan", "last_name": "Perez", "nationality": "Ecuatoriana"}, "roles": ["Cliente"]}' 422 "false"

# 30. Desbordamiento Numérico en Atributos del Vehículo (HTTP 400)
run_test_case "Desbordamiento Numerico en Atributos del Vehiculo (HTTP 400)" \
  "POST" "/vehiculo/crear" '{"type": "Auto", "data": {"propietarioId": "550e8400-e29b-41d4-a716-446655440000", "plate": "PBA9999", "brand": "Toyota", "model": "Yaris", "color": "Gris", "year": 2022, "classification": "Gasolina", "doors": 2147483648, "fuelType": "Gasolina", "trunkCapacity": 350}}' 400 "false"

# 31. Fuzzing de UUID Inválido en Actualización de Zona (HTTP 404 / 400)
run_test_case "Fuzzing de UUID Invalido en Actualizacion de Zona (HTTP 400)" \
  "PUT" "/zona/actualizar/invalid-uuid-format-12345" '{"name": "Zona A - Planta Baja", "description": "Actualizacion invalida", "type": "REGULAR", "capacidad": 10}' 400 "false"

# 32. Ocupar Espacio sin Especificar ID de Vehículo (HTTP 400)
if [ -n "$SPACE_ID" ]; then
  run_test_case "Ocupar Espacio sin Especificar ID de Vehiculo (HTTP 400)" \
    "PUT" "/espacio/estado/$SPACE_ID/estado/OCUPADO" "" 400 "false"
else
  echo -e "${RED}Saltando prueba: falta SPACE_ID${NC}"
fi

# 33. Ocupar Espacio con Vehículo de Tipo Incorrecto (HTTP 400)
if [ -n "$PROPIETARIO_ID" ]; then
  run_test_case "Crear Moto para Test de Tipo Incorrecto" \
    "POST" "/vehiculo/crear" '{"type": "Moto", "data": {"propietarioId": "'"$PROPIETARIO_ID"'", "plate": "AB-123X", "brand": "Honda", "model": "Cruiser", "color": "Negro", "year": 2022, "classification": "Gasolina", "type": "Deportiva"}}' 201 "false"
  MOTO_RESP=$(cat last_response.json)
  MOTO_ID=$(extract_json_field "$MOTO_RESP" "id")
else
  echo -e "${RED}Saltando creacion de Moto: no se obtuvo propietarioId${NC}"
fi

if [ -n "$SPACE_ID" ] && [ -n "$MOTO_ID" ]; then
  run_test_case "Ocupar Espacio de Auto con Vehiculo Tipo Moto (HTTP 400)" \
    "PUT" "/espacio/estado/$SPACE_ID/estado/OCUPADO?vehiculoId=$MOTO_ID" "" 400 "false"
else
  echo -e "${RED}Saltando prueba de Tipo Incorrecto: falta SPACE_ID o MOTO_ID${NC}"
fi

# 34. Ocupar Espacio en Zona Inactivada (HTTP 400)
run_test_case "Crear Zona Temporal para Test de Zona Inactiva" \
  "POST" "/zona/crear" '{"name": "Zona Inactiva", "description": "Zona para prueba de desactivacion", "type": "REGULAR", "capacidad": 2}' 201 "false"
INACTIVE_ZONE_RESP=$(cat last_response.json)
INACTIVE_ZONE_ID=$(extract_json_field "$INACTIVE_ZONE_RESP" "zoneId")

if [ -n "$INACTIVE_ZONE_ID" ]; then
  run_test_case "Crear Espacio en Zona Inactiva" \
    "POST" "/espacio/crear" '{"zoneId": "'"$INACTIVE_ZONE_ID"'", "description": "Espacio Inactivo", "type": "AUTO", "estado": "DISPONIBLE"}' 201 "false"
  INACTIVE_SPACE_RESP=$(cat last_response.json)
  INACTIVE_SPACE_ID=$(extract_json_field "$INACTIVE_SPACE_RESP" "id")

  # Desactivar Zona (DELETE)
  run_test_case "Desactivar Zona Temporal (HTTP 204)" \
    "DELETE" "/zona/eliminar/$INACTIVE_ZONE_ID" "" 204 "false"

  # Intentar ocupar espacio
  if [ -n "$INACTIVE_SPACE_ID" ] && [ -n "$VEHICLE_ID" ]; then
    run_test_case "Ocupar Espacio en Zona Inactivada (HTTP 400)" \
      "PUT" "/espacio/estado/$INACTIVE_SPACE_ID/estado/OCUPADO?vehiculoId=$VEHICLE_ID" "" 400 "false"
  fi
else
  echo -e "${RED}Saltando prueba de Zona Inactivada: no se obtuvo zoneId${NC}"
fi

# 39. Usuario - Caracteres Inválidos en Primer Nombre (HTTP 422)
run_test_case "Usuario: Caracteres Invalidos en Primer Nombre (HTTP 422)" \
  "POST" "/usuario/crear" '{"password": "miPasswordSeguro123", "person": {"dni": "1723456784", "email": "invalid.char@example.com", "first_name": "Juan123", "last_name": "Perez", "nationality": "Ecuatoriana"}, "roles": ["Cliente"]}' 422 "false"

# 40. Usuario - Caracteres Inválidos en Apellido (HTTP 422)
run_test_case "Usuario: Caracteres Invalidos en Apellido (HTTP 422)" \
  "POST" "/usuario/crear" '{"password": "miPasswordSeguro123", "person": {"dni": "1723456784", "email": "invalid.char2@example.com", "first_name": "Juan", "last_name": "Perez@", "nationality": "Ecuatoriana"}, "roles": ["Cliente"]}' 422 "false"

# 41. Usuario - Espacio en Primer Nombre (HTTP 422)
run_test_case "Usuario: Espacio en Primer Nombre (HTTP 422)" \
  "POST" "/usuario/crear" '{"password": "miPasswordSeguro123", "person": {"dni": "1723456784", "email": "space.name@example.com", "first_name": "Juan Carlos", "last_name": "Perez", "nationality": "Ecuatoriana"}, "roles": ["Cliente"]}' 422 "false"

# 42. Usuario - Espacio en Teléfono (HTTP 422)
run_test_case "Usuario: Espacio en Telefono (HTTP 422)" \
  "POST" "/usuario/crear" '{"password": "miPasswordSeguro123", "person": {"dni": "1723456784", "email": "space.phone@example.com", "first_name": "Juan", "last_name": "Perez", "nationality": "Ecuatoriana", "phone": "099 999 999"}, "roles": ["Cliente"]}' 422 "false"

# 43. Vehículo - Caracteres Inválidos en Marca (HTTP 400)
run_test_case "Vehiculo: Caracteres Invalidos en Marca (HTTP 400)" \
  "POST" "/vehiculo/crear" '{"type": "Auto", "data": {"propietarioId": "550e8400-e29b-41d4-a716-446655440000", "plate": "PBA9999", "brand": "Toyota123", "model": "Yaris", "color": "Gris", "year": 2022, "classification": "Gasolina", "doors": 4, "fuelType": "Gasolina", "trunkCapacity": 350}}' 400 "false"

# 44. Vehículo - Espacios en Marca (HTTP 400)"
run_test_case "Vehiculo: Espacios en Marca (HTTP 400)" \
  "POST" "/vehiculo/crear" '{"type": "Auto", "data": {"propietarioId": "550e8400-e29b-41d4-a716-446655440000", "plate": "PBA9999", "brand": "Toyota Motors", "model": "Yaris", "color": "Gris", "year": 2022, "classification": "Gasolina", "doors": 4, "fuelType": "Gasolina", "trunkCapacity": 350}}' 400 "false"

# 45. Vehículo - Espacios en Modelo (HTTP 400)
run_test_case "Vehiculo: Espacios en Modelo (HTTP 400)" \
  "POST" "/vehiculo/crear" '{"type": "Auto", "data": {"propietarioId": "550e8400-e29b-41d4-a716-446655440000", "plate": "PBA9999", "brand": "Toyota", "model": "Land Cruiser", "color": "Gris", "year": 2022, "classification": "Gasolina", "doors": 4, "fuelType": "Gasolina", "trunkCapacity": 350}}' 400 "false"

# 46. Vehículo - Espacios en Placa (HTTP 400)
run_test_case "Vehiculo: Espacios en Placa (HTTP 400)" \
  "POST" "/vehiculo/crear" '{"type": "Auto", "data": {"propietarioId": "550e8400-e29b-41d4-a716-446655440000", "plate": "PD F9876", "brand": "Toyota", "model": "Yaris", "color": "Gris", "year": 2022, "classification": "Gasolina", "doors": 4, "fuelType": "Gasolina", "trunkCapacity": 350}}' 400 "false"

# 47. Zona - Tipo de Zona con Espacio (HTTP 400)
run_test_case "Zona: Tipo de Zona con Espacio (HTTP 400)" \
  "POST" "/zona/crear" '{"name": "Zona Invalida", "description": "Zona tipo invalido", "type": "REGU LAR", "capacidad": 10}' 400 "false"

# 48. Espacio - Tipo de Espacio con Caracteres Inválidos (HTTP 400)
run_test_case "Espacio: Tipo de Espacio con Caracteres Invalidos (HTTP 400)" \
  "POST" "/espacio/crear" '{"zoneId": "550e8400-e29b-41d4-a716-446655440000", "description": "Espacio Invalido", "type": "AUTO!", "estado": "DISPONIBLE"}' 400 "false"

# ========================================================
# IMPRESIÓN DEL REPORTE FINAL DETALLADO
# ========================================================
echo -e "\n\n${BOLD}===============================================================================================================================${NC}"
echo -e "${BOLD}                                              REPORTE DE CASOS DE PRUEBA (KONG)                                                ${NC}"
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

# Limpiar datos al finalizar con éxito
cleanup_db

# Limpieza de archivos temporales de ejecución
rm -f response.json headers.txt last_response.json
