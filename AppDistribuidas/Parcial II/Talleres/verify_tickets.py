import urllib.request
import json
import sys
import os

def clean_db():
    print("Limpiando base de datos...")
    os.system('docker exec -i tickets_db_unificado psql -U postgres -d tickets -c "DELETE FROM tickets;"')
    os.system('docker exec -i asignaciones_db_unificado psql -U admin -d asignaciones_db -c "DELETE FROM asignaciones;"')
    os.system('docker exec -i vehiculos_db_unificado psql -U admin -d vehiculos_db -c "DELETE FROM vehiculo WHERE placa IN (\'TKT9999\', \'MT-123A\');"')
    os.system('docker exec -i zonas_db_unificado psql -U zonas_user -d zonas_db -c "DELETE FROM espacios WHERE description IN (\'Espacio de auto para tickets\', \'Espacio de moto para tickets\', \'Espacio de auto 2 para tickets\'); DELETE FROM zonas WHERE name = \'Zona Tickets\';"')
    os.system('docker exec -i usuarios_db_unificado psql -U postgres -d usuarios -c "DELETE FROM persons WHERE email = \'ticket.test@example.com\';"')
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
    print("--- INICIANDO VERIFICACIÓN DE INFRAESTRUCTURA DE TICKETS ---")
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
    
    # 2. Get Root Profile
    status_code, root_profile = request("http://localhost:9000/usuario/me", "GET", token=root_token)
    root_user_id = root_profile.get("id_person")
    print(f"Perfil Root: ID={root_user_id}")
    
    # 3. Crear Cliente de Prueba (con DNI válido único)
    client_body = {
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
    }
    status_code, client_create = request("http://localhost:9000/usuario/crear", "POST", client_body, token=root_token)
    print(f"Crear Cliente: status={status_code}")
    client_user_id = client_create.get("id_person")
    client_username = client_create.get("username")
    
    if not client_user_id:
        print("Fallo al crear cliente de prueba:", client_create)
        sys.exit(1)
        
    # 4. Login Cliente
    status_code, client_login = request("http://localhost:9000/usuario/login", "POST", {
        "username": client_username,
        "password": "miPasswordSeguro123"
    })
    print(f"Login Cliente: status={status_code}")
    client_token = client_login.get("access_token")
    
    # 5. Crear Vehículo Auto
    auto_body = {
      "type": "Auto",
      "data": {
        "plate": "TKT9999", # AAA1234 format
        "brand": "Toyota",
        "model": "Yaris",
        "color": "Negro",
        "year": 2022,
        "classification": "Gasolina",
        "doors": 4,
        "trunkCapacity": 350,
        "fuelType": "Gasolina"
      }
    }
    status_code, auto_create = request("http://localhost:9000/vehiculo/crear", "POST", auto_body, token=root_token)
    print(f"Crear Auto: status={status_code}")
    auto_id = auto_create.get("id")
    if not auto_id:
        print("Error auto:", auto_create)
        sys.exit(1)
    
    # 6. Crear Vehículo Moto
    moto_body = {
      "type": "Moto",
      "data": {
        "plate": "MT-123A", # AA-123A format
        "brand": "Yamaha",
        "model": "YZF", # Only letters and hyphens!
        "color": "Azul",
        "year": 2021,
        "classification": "Gasolina",
        "type": "Deportiva" # type instead of motorcycleType
      }
    }
    status_code, moto_create = request("http://localhost:9000/vehiculo/crear", "POST", moto_body, token=root_token)
    print(f"Crear Moto: status={status_code}")
    moto_id = moto_create.get("id")
    if not moto_id:
        print("Error moto:", moto_create)
        sys.exit(1)
    
    # 7. Asignar Auto a Cliente
    status_code, assign_auto = request("http://localhost:9000/asignacion/crear", "POST", {
        "userId": client_user_id,
        "vehicleId": auto_id
    }, token=root_token)
    print(f"Asignar Auto: status={status_code}")
    
    # 8. Asignar Moto a Cliente
    status_code, assign_moto = request("http://localhost:9000/asignacion/crear", "POST", {
        "userId": client_user_id,
        "vehicleId": moto_id
    }, token=root_token)
    print(f"Asignar Moto: status={status_code}")
    
    # 9. Crear Zona de Parqueo
    status_code, zone_create = request("http://localhost:9000/zona/crear", "POST", {
      "name": "Zona Tickets",
      "description": "Zona para pruebas de tickets",
      "type": "REGULAR",
      "capacidad": 10
    }, token=root_token)
    print(f"Crear Zona: status={status_code}")
    zone_id = zone_create.get("zoneId")
    
    # 10. Crear Espacios de Parqueo
    status_code, space_auto_1 = request("http://localhost:9000/espacio/crear", "POST", {
      "zoneId": zone_id,
      "description": "Espacio de auto para tickets",
      "type": "AUTO",
      "estado": "DISPONIBLE"
    }, token=root_token)
    print(f"Crear Espacio Auto 1: status={status_code}")
    space_auto_id_1 = space_auto_1.get("id")
    
    status_code, space_moto_1 = request("http://localhost:9000/espacio/crear", "POST", {
      "zoneId": zone_id,
      "description": "Espacio de moto para tickets",
      "type": "MOTO",
      "estado": "DISPONIBLE"
    }, token=root_token)
    print(f"Crear Espacio Moto 1: status={status_code}")
    space_moto_id_1 = space_moto_1.get("id")
    
    status_code, space_auto_2 = request("http://localhost:9000/espacio/crear", "POST", {
      "zoneId": zone_id,
      "description": "Espacio de auto 2 para tickets",
      "type": "AUTO",
      "estado": "DISPONIBLE"
    }, token=root_token)
    print(f"Crear Espacio Auto 2: status={status_code}")
    space_auto_id_2 = space_auto_2.get("id")
    
    # 11. Crear Ticket Exitoso (Caso Feliz: Auto en Espacio Auto)
    ticket_body = {
      "id_espacio": space_auto_id_1,
      "id_vehiculo": auto_id,
      "id_usuario": client_user_id
    }
    status_code, ticket_create = request("http://localhost:9000/ticket/crear", "POST", ticket_body, token=client_token)
    print(f"Crear Ticket Auto (Esperado: 201): status={status_code}")
    active_ticket_id = ticket_create.get("id_ticket")
    codigo_ticket = ticket_create.get("codigo_ticket")
    print(f"   - Código Ticket generado: {codigo_ticket}")
    
    # 12. Verificar Espacio Estado
    status_code, space_verify = request(f"http://localhost:9000/espacio/obtener/{space_auto_id_1}", "GET", token=root_token)
    print(f"Verificar Estado Espacio Auto 1 (Esperado: OCUPADO): status={status_code}, estado={space_verify.get('estado')}")
    
    # 13. Validación: Comprar sobre espacio ocupado
    ticket_body_dup = {
      "id_espacio": space_auto_id_1,
      "id_vehiculo": moto_id,
      "id_usuario": root_user_id
    }
    status_code, ticket_dup = request("http://localhost:9000/ticket/crear", "POST", ticket_body_dup, token=client_token)
    print(f"Crear Ticket en Espacio Ocupado (Esperado: 400): status={status_code}, response={ticket_dup}")
    
    # 14. Validación: Persona con ticket activo duplicado
    ticket_body_user_dup = {
      "id_espacio": space_auto_id_2,
      "id_vehiculo": moto_id,
      "id_usuario": client_user_id
    }
    status_code, ticket_user_dup = request("http://localhost:9000/ticket/crear", "POST", ticket_body_user_dup, token=client_token)
    print(f"Crear Segundo Ticket para Usuario (Esperado: 400): status={status_code}, response={ticket_user_dup}")
    
    # 15. Validación: Incompatibilidad Moto en Espacio Auto
    ticket_body_incompat = {
      "id_espacio": space_auto_id_2,
      "id_vehiculo": moto_id,
      "id_usuario": root_user_id
    }
    status_code, ticket_incompat = request("http://localhost:9000/ticket/crear", "POST", ticket_body_incompat, token=root_token)
    print(f"Crear Ticket Moto en Espacio Auto (Esperado: 400): status={status_code}, response={ticket_incompat}")
    
    # 16. Buscar ticket
    status_code, ticket_search = request(f"http://localhost:9000/ticket/buscar?id_usuario={client_user_id}&id_vehiculo={auto_id}", "GET", token=client_token)
    print(f"Buscar Ticket (Esperado: 200 y lista con 1 ticket): status={status_code}, length={len(ticket_search)}")
    
    # 17. Pagar Ticket
    status_code, ticket_pay = request(f"http://localhost:9000/ticket/pagar/{active_ticket_id}", "POST", token=client_token)
    print(f"Pagar Ticket (Esperado: 200, pagado, valor_recaudado=2.0): status={status_code}, estado={ticket_pay.get('estado_ticket')}, valor={ticket_pay.get('valor_recaudado')}")
    
    # 18. Verificar Espacio Estado Post Pago
    status_code, space_verify_post = request(f"http://localhost:9000/espacio/obtener/{space_auto_id_1}", "GET", token=root_token)
    print(f"Verificar Estado Espacio Auto 1 Post-Pago (Esperado: DISPONIBLE): status={status_code}, estado={space_verify_post.get('estado')}")
    
if __name__ == "__main__":
    run_tests()
