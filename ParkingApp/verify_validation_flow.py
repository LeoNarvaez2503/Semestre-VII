import urllib.request
import json
import sys
import os
import time

def clean_db():
    print("Limpiando base de datos...")
    os.system('docker exec -i tickets_db_unificado psql -U admin -d tickets_db -c "DELETE FROM tickets;"')
    os.system('docker exec -i asignaciones_db_unificado psql -U admin -d asignaciones_db -c "DELETE FROM asignaciones;"')
    os.system('docker exec -i vehiculos_db_unificado psql -U admin -d vehiculos_db -c "DELETE FROM vehiculo WHERE placa IN (\'EMP1234\', \'EXT9999\', \'EXP1234\');"')
    os.system('docker exec -i zonas_db_unificado psql -U zonas_user -d zonas_db -c "DELETE FROM espacios; DELETE FROM zonas;"')
    os.system('docker exec -i usuarios_db_unificado psql -U postgres -d usuarios -c "DELETE FROM persons WHERE email IN (\'empleado.test@example.com\', \'invitado_1710034065@parking.com\');"')
    print("Limpieza completada.")

def request(url, method="GET", body=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    data = None
    if body:
        data = json.dumps(body).encode("utf-8")
        
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        res_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(res_body)
        except Exception:
            return e.code, {"error": res_body}
    except Exception as e:
        return 500, {"error": str(e)}

def run_tests():
    print("--- INICIANDO VERIFICACIÓN DE VALIDACIÓN Y EMPLEADOS ---")
    clean_db()
    
    # 1. Login Root
    status_code, root_login = request("http://localhost:9000/usuario/login", "POST", {
        "username": "root",
        "password": "rootpassword123"
    })
    print(f"Login Root: status={status_code}")
    if status_code != 200:
        print("Fallo en login de root.")
        sys.exit(1)
    root_token = root_login.get("access_token")
    
    # 1.5. Crear Rol Empleado (si no existe)
    status_code, role_create = request("http://localhost:9000/rol/crear", "POST", {
        "name": "Empleado",
        "description": "Rol de empleado para pruebas"
    }, token=root_token)
    print(f"Crear Rol Empleado: status={status_code}")
    
    # 2. Crear Empleado (Señor Llumigusin)
    dni_empleado = "1723456784"
    emp_body = {
      "password": "miPasswordSeguro123",
      "person": {
        "dni": dni_empleado,
        "email": "empleado.test@example.com",
        "first_name": "Juan",
        "last_name": "Llumigusin",
        "middle_name": "Carlos",
        "nationality": "Ecuatoriana",
        "phone": "0987654321",
        "address": "Quito"
      },
      "roles": ["Empleado"]
    }
    status_code, emp_create = request("http://localhost:9000/usuario/crear", "POST", emp_body, token=root_token)
    print(f"Crear Empleado: status={status_code}")
    emp_user_id = emp_create.get("id_person")
    emp_username = emp_create.get("username")
    
    if not emp_user_id:
        print("Fallo al crear empleado:", emp_create)
        sys.exit(1)
        
    # 3. Login Empleado
    status_code, emp_login = request("http://localhost:9000/usuario/login", "POST", {
        "username": emp_username,
        "password": "miPasswordSeguro123"
    })
    print(f"Login Empleado: status={status_code}")
    emp_token = emp_login.get("access_token")
    
    # 4. Crear Vehículo (Placa EMP1234)
    placa_vehiculo = "EMP1234"
    auto_body = {
      "type": "Auto",
      "data": {
        "plate": placa_vehiculo,
        "brand": "Chevrolet",
        "model": "Aveo",
        "color": "Blanco",
        "year": 2019,
        "classification": "Gasolina",
        "doors": 4,
        "trunkCapacity": 300,
        "fuelType": "Gasolina"
      }
    }
    status_code, auto_create = request("http://localhost:9000/vehiculo/crear", "POST", auto_body, token=root_token)
    print(f"Crear Auto: status={status_code}")
    auto_id = auto_create.get("id")
    if not auto_id:
        print("Error auto:", auto_create)
        sys.exit(1)
    
    # 5. Asignar Vehículo a Empleado
    status_code, assign_auto = request("http://localhost:9000/asignacion/crear", "POST", {
        "userId": emp_user_id,
        "vehicleId": auto_id
    }, token=root_token)
    print(f"Asignar Auto a Empleado: status={status_code}")

    # --- VALIDACIONES ESPECIALES ---
    
    print("\n--- VALIDACIÓN CÉDULA -> VEHÍCULO ---")
    # A) Buscar usuario por cédula
    status_code, users_search = request(f"http://localhost:9000/usuario/buscar?dni={dni_empleado}", "GET", token=root_token)
    print(f"Buscar Usuario por DNI real: status={status_code}")
    if len(users_search) > 0:
        found_user_id = users_search[0].get("id_person")
        # B) Buscar vehículos de ese usuario
        status_code, fleet = request(f"http://localhost:9000/asignacion/propietario/{found_user_id}", "GET", token=emp_token)
        print(f"Obtener Flota del Usuario: status={status_code}, Vehículos encontrados={len(fleet)}")
        if len(fleet) > 0:
            print("EXITO: Se validó que al ingresar por cédula, se obtiene la lista de vehículos.")
        else:
            print("ERROR: No se obtuvo la lista de vehículos.")
            
    # B.2) Buscar cédula inexistente
    status_code, fake_user_search = request(f"http://localhost:9000/usuario/buscar?dni=9999999999", "GET", token=root_token)
    print(f"Buscar Usuario por DNI inexistente (Esperado vacío): status={status_code}, data={fake_user_search}")
    if isinstance(fake_user_search, list) and len(fake_user_search) == 0:
        print("EXITO: Se manejó correctamente la búsqueda de un DNI inexistente.")
    
    print("\n--- VALIDACIÓN PLACA -> CÉDULA ---")
    # A) Buscar vehículo por placa
    status_code, veh_search = request(f"http://localhost:9000/vehiculo/buscar?placa={placa_vehiculo}", "GET", token=root_token)
    print(f"Buscar Vehículo por Placa real: status={status_code}")
    if isinstance(veh_search, list) and len(veh_search) > 0:
        found_veh_id = veh_search[0].get("id")
        # B) Buscar trazabilidad/owner del vehículo
        status_code, trace = request(f"http://localhost:9000/asignacion/trazabilidad/vehiculo/{found_veh_id}", "GET", token=root_token)
        print(f"Obtener Trazabilidad del Vehículo: status={status_code}, Registros={len(trace)}")
        if len(trace) > 0:
            owner_id = trace[0].get("userId")
            # C) Obtener datos del usuario (Cédula)
            status_code, owner_data = request(f"http://localhost:9000/usuario/obtener/{owner_id}", "GET", token=root_token)
            print(f"Cédula obtenida a partir de la placa: {owner_data.get('person', {}).get('dni')}")
            print("EXITO: Se validó que al ingresar por placa, se puede llenar la cédula.")

    # A.2) Buscar placa inexistente
    status_code, fake_veh_search = request(f"http://localhost:9000/vehiculo/buscar?placa=FAKE999", "GET", token=root_token)
    print(f"Buscar Vehículo por Placa inexistente (Esperado vacío): status={status_code}, data={fake_veh_search}")
    if isinstance(fake_veh_search, list) and len(fake_veh_search) == 0:
        print("EXITO: Se manejó correctamente la búsqueda de una placa inexistente.")

    # --- EMITIR TICKET ---
    print("\n--- PRUEBA TICKET EMPLEADO & DUPLICADOS ---")
    
    # 6. Crear Zona y Espacio
    status_code, zone_create = request("http://localhost:9000/zona/crear", "POST", {
      "name": "Zona Empleados",
      "description": "Zona para pruebas de empleado",
      "type": "REGULAR",
      "capacidad": 5
    }, token=root_token)
    zone_id = zone_create.get("zoneId")
    
    status_code, space_auto = request("http://localhost:9000/espacio/crear", "POST", {
      "zoneId": str(zone_id),
      "description": "Espacio de prueba EMP1234",
      "type": "AUTO",
      "estado": "DISPONIBLE"
    }, token=root_token)
    print(f"Crear Espacio Auto: status={status_code}, response={space_auto}")
    space_id = space_auto.get("id")
    
    # Crear espacio de moto para probar incompatibilidad
    status_code, space_moto = request("http://localhost:9000/espacio/crear", "POST", {
      "zoneId": str(zone_id),
      "description": "Espacio de moto EMP1234",
      "type": "MOTO",
      "estado": "DISPONIBLE"
    }, token=root_token)
    space_moto_id = space_moto.get("id")
    
    # Crear vehículo extra (NO asignado al empleado)
    extra_body = {
      "type": "Auto",
      "data": {
        "plate": "EXT9999",
        "brand": "Ford",
        "model": "Fiesta",
        "color": "Rojo",
        "year": 2020,
        "classification": "Gasolina",
        "doors": 4,
        "trunkCapacity": 300,
        "fuelType": "Gasolina"
      }
    }
    _, ext_create = request("http://localhost:9000/vehiculo/crear", "POST", extra_body, token=root_token)
    extra_auto_id = ext_create.get("id")

    # 7. Ticket Exitoso
    ticket_body = {
      "id_espacio": space_id,
      "id_vehiculo": auto_id,
      "id_usuario": emp_user_id
    }
    status_code, ticket_create = request("http://localhost:9000/ticket/crear", "POST", ticket_body, token=emp_token)
    print(f"\nCrear Ticket Empleado Valido (Esperado: 201): status={status_code}")
    if status_code == 201:
        print(f"   - Ticket generado correctamente: {ticket_create.get('codigo_ticket')}")
    
    # 8. Validar Ticket Duplicado
    print("\nIntentando emitir EL MISMO TICKET (mismo espacio, mismo vehículo)...")
    status_code, ticket_dup = request("http://localhost:9000/ticket/crear", "POST", ticket_body, token=emp_token)
    print(f"Crear Ticket Duplicado (Esperado: 400 Bad Request): status={status_code}, response={ticket_dup}")
    if status_code == 400:
        print("EXITO: El sistema validó correctamente que no se puede emitir el ticket duplicado.")
    else:
        print("ERROR: El sistema no bloqueó el ticket duplicado.")
        
    # 9. Validar Incompatibilidad (Auto en Moto)
    print("\nIntentando aparcar Auto en espacio de Moto...")
    incompat_body = {
      "id_espacio": space_moto_id,
      "id_vehiculo": auto_id,
      "id_usuario": emp_user_id
    }
    status_code, ticket_incompat = request("http://localhost:9000/ticket/crear", "POST", incompat_body, token=emp_token)
    print(f"Crear Ticket Incompatible (Esperado: 400 Bad Request): status={status_code}, response={ticket_incompat}")
    
    # 10. Validar Vehículo No Asignado
    print("\nIntentando emitir ticket para un vehículo que NO es del empleado...")
    unassigned_body = {
      "id_espacio": space_moto_id,
      "id_vehiculo": extra_auto_id,
      "id_usuario": emp_user_id
    }
    status_code, ticket_unassigned = request("http://localhost:9000/ticket/crear", "POST", unassigned_body, token=emp_token)
    print(f"Crear Ticket Vehículo No Asignado (Esperado: 400/403): status={status_code}, response={ticket_unassigned}")
    
    # 11. Pagar Ticket
    if ticket_create and ticket_create.get('id'):
        ticket_id = ticket_create.get('id')
        print(f"\nIntentando pagar el ticket activo (ID: {ticket_id})...")
        status_code, ticket_pay = request(f"http://localhost:9000/ticket/pagar/{ticket_id}", "POST", token=emp_token)
        print(f"Pagar Ticket (Esperado: 200/201): status={status_code}")
        
        # 12. Pagar Doble
        print("\nIntentando pagar el mismo ticket por segunda vez...")
        status_code, ticket_double_pay = request(f"http://localhost:9000/ticket/pagar/{ticket_id}", "POST", token=emp_token)
        print(f"Doble Pago (Esperado: 400 Bad Request): status={status_code}, response={ticket_double_pay}")
    
    # 13. Emitir con Usuario Inexistente
    print("\nIntentando emitir ticket con Usuario Falso...")
    fake_user_body = {
      "id_espacio": space_id,
      "id_vehiculo": auto_id,
      "id_usuario": "00000000-0000-0000-0000-000000000000"
    }
    status_code, ticket_fake_user = request("http://localhost:9000/ticket/crear", "POST", fake_user_body, token=emp_token)
    print(f"Crear Ticket Usuario Falso (Esperado: 400/404): status={status_code}, response={ticket_fake_user}")

    # 14. Emitir con Espacio Inexistente
    print("\nIntentando emitir ticket con Espacio Falso...")
    fake_space_body = {
      "id_espacio": "00000000-0000-0000-0000-000000000000",
      "id_vehiculo": auto_id,
      "id_usuario": emp_user_id
    }
    status_code, ticket_fake_space = request("http://localhost:9000/ticket/crear", "POST", fake_space_body, token=emp_token)
    print(f"Crear Ticket Espacio Falso (Esperado: 400/404): status={status_code}, response={ticket_fake_space}")

    # 15. Emitir con Vehículo Inexistente
    print("\nIntentando emitir ticket con Vehiculo Falso...")
    fake_veh_body = {
      "id_espacio": space_id,
      "id_vehiculo": "00000000-0000-0000-0000-000000000000",
      "id_usuario": emp_user_id
    }
    status_code, ticket_fake_veh = request("http://localhost:9000/ticket/crear", "POST", fake_veh_body, token=emp_token)
    print(f"Crear Ticket Vehiculo Falso (Esperado: 400/404): status={status_code}, response={ticket_fake_veh}")

    # 16. Espacio en Mantenimiento
    print("\nCambiando estado de espacio a MANTENIMIENTO...")
    status_code, update_state = request(f"http://localhost:9000/espacio/estado/{space_id}/estado/MANTENIMIENTO", "PUT", token=root_token)
    print(f"Actualizar estado a MANTENIMIENTO: status={status_code}")
    
    print("Intentando aparcar en espacio en MANTENIMIENTO...")
    maint_body = {
      "id_espacio": space_id,
      "id_vehiculo": auto_id,
      "id_usuario": emp_user_id
    }
    status_code, ticket_maint = request("http://localhost:9000/ticket/crear", "POST", maint_body, token=emp_token)
    print(f"Crear Ticket en Mantenimiento (Esperado: 400): status={status_code}, response={ticket_maint}")
    
    # 17. Registro Express
    print("\n--- PRUEBA TICKET EXPRESS ---")
    status_code, revert_maint = request(f"http://localhost:9000/espacio/estado/{space_id}/estado/DISPONIBLE", "PUT", token=root_token)
    # Pagar el ticket anterior para liberar el espacio
    if ticket_create and ticket_create.get('id_ticket'):
        status_code, response = request(f"http://localhost:9000/ticket/pagar/{ticket_create['id_ticket']}", "POST", token=emp_token)
        print(f"Liberando espacio (Pagando ticket activo)... status={status_code}")

    print("Usando el espacio principal que ya esta disponible...")
    
    express_body = {
        "dni": "1710034065",
        "placa": "EXP1234",
        "id_espacio": space_id
    }
    status_code, ticket_express = request("http://localhost:9000/ticket/express", "POST", express_body, token=emp_token)
    print(f"Crear Ticket Express (Esperado: 201): status={status_code}")
    if status_code == 201:
        print(f"   - Ticket Express generado correctamente: {ticket_express.get('codigo_ticket')}")
    else:
        print(f"   - Error: {ticket_express}")
    
    print("\n--- FIN DE LAS PRUEBAS ---")

if __name__ == "__main__":
    run_tests()
