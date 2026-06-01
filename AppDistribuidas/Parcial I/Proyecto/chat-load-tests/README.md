# Chat Seguro - Load Tests

Pruebas de carga para validar que el sistema ChatSeguroSpring soporta 50+ usuarios simultáneos en comunicación en tiempo real via WebSocket.

## 📋 Requisitos

- **Maven 3.8+** instalado
- **Java 17+** instalado
- **Backend ChatSeguroSpring** corriendo en `http://localhost:8080`
- **MySQL** corriendo (via `docker-compose up` desde `ChatSeguroSpring/`)
- **Node.js + npm** (opcional, para frontend)

## 🚀 Inicio Rápido

### 1. Iniciar Infraestructura

```bash
cd ChatSeguroSpring
docker-compose up -d
mvn spring-boot:run
```

Verifica que el backend está disponible:
```bash
curl http://localhost:8080/api/rooms/info
```

### 2. Pre-crear Sala de Prueba

Las pruebas necesitan una sala de chat existente. Crea una via API:

```bash
curl -X POST http://localhost:8080/api/rooms/create \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_token=<ADMIN_TOKEN>" \
  -d '{
    "roomName": "LoadTest-Room",
    "roomType": "TEXT",
    "pin": "1234",
    "maxUsers": 100
  }'
```

**Nota:** Primero necesitas obtener `ADMIN_TOKEN` haciendo login:
```bash
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

El ID de la sala se devolverá en la respuesta. **Guárdalo** (ej: `550e8400-e29b-41d4-a716-446655440000`).

### 3. Configurar Room ID en la Simulación

Edita `src/test/scala/ChatLoadSimulation.scala` y reemplaza:
```scala
val testRoomId = "YOUR_ROOM_ID_HERE"
```

con el ID que obtuviste en el paso anterior.

### 4. Ejecutar Prueba de Carga - Escenario 1 (Burst)

```bash
cd chat-load-tests
mvn gatling:test -Dgatling.simulationClass=ChatLoadSimulation
```

Este escenario:
- ✅ Conecta 50 usuarios **simultáneamente** en 10 segundos
- ✅ Cada usuario envía 10 mensajes rápidamente
- ✅ Mide latencia, throughput, errores
- ⏱️ Duración total: ~30 segundos

### 5. Ejecutar Prueba de Carga - Escenario 2 (Ramp-up)

Edita `src/test/scala/ChatLoadSimulation.scala` y comenta/descomenta:

```scala
setUp(
  // Comenta esto:
  // burstScenario.inject(burstLoadProfile)
  
  // Descomenta esto:
  rampUpScenario.inject(rampUpLoadProfile)
)
```

Luego ejecuta:
```bash
mvn gatling:test -Dgatling.simulationClass=ChatLoadSimulation
```

Este escenario:
- ✅ Conecta 50 usuarios **gradualmente** a lo largo de 5 minutos
- ✅ Cada usuario envía mensajes cada 2 segundos durante 1 minuto
- ✅ Simula carga más realista
- ⏱️ Duración total: ~6 minutos

## 📊 Interpretar Resultados

Después de cada ejecución, Gatling genera un reporte HTML en:
```
target/gatling/chat-load-test-results-<timestamp>/index.html
```

Abre este archivo en el navegador para ver:

### 📈 Gráficas Principales

1. **Response Times Over Time** - Latencia a lo largo de la ejecución
2. **Active Sessions Over Time** - Número de usuarios conectados
3. **Response Time Percentiles** - p50, p95, p99 (debes ver < 1 segundo)
4. **Requests per Second** - Throughput del sistema
5. **Errors** - Tasa de fallos (debería ser ~0%)

### 🎯 Métricas Clave

| Métrica | Target | Observación |
|---------|--------|-------------|
| **Mean Latency** | < 1 segundo | Requisito del proyecto |
| **p95 Latency** | < 2 segundos | 95% de requests bajo este tiempo |
| **p99 Latency** | < 3 segundos | 99% de requests bajo este tiempo |
| **Success Rate** | > 95% | % de conexiones exitosas |
| **Max Users Sustained** | ≥ 50 | Sistema soporta carga |

## 🔍 Diagnóstico de Problemas

### Problema: "Connection refused" en WebSocket

**Causa:** Backend no está corriendo o puerto incorrecto

**Solución:**
```bash
# Verifica que Spring Boot está corriendo
curl http://localhost:8080/api/rooms/info

# Si no responde, reinicia:
cd ChatSeguroSpring
docker-compose down
docker-compose up -d
mvn spring-boot:run
```

### Problema: "Pin inválido" o "Room not found"

**Causa:** Room ID incorrecto o sala no existe

**Solución:**
1. Verifica el Room ID en la simulación
2. Recrea la sala via API (paso 2 arriba)
3. Actualiza la simulación con el nuevo ID

### Problema: Altos tiempos de latencia (> 5 seg)

**Causa:** Posible bottleneck en BD, servidor, o red

**Investigación:**
- Verifica CPU/RAM del servidor: `docker stats`
- Verifica logs de MySQL: `docker logs chatseguro-mysql`
- Reduce usuarios inicialmente (ej: 10 → 20 → 50) para identificar punto de quiebre

### Problema: Errores de compilación de Scala

**Causa:** Versión de Java/Maven incompatible

**Solución:**
```bash
# Verifica Java version
java -version  # debe ser 17+

# Limpia y reintenta
mvn clean compile
```

## 📝 Estructura del Proyecto

```
chat-load-tests/
├── pom.xml                          # Configuración Maven + Gatling
├── src/
│   └── test/
│       ├── scala/
│       │   └── ChatLoadSimulation.scala   # Simulación principal
│       └── resources/
│           └── gatling.conf               # Configuración de Gatling
└── README.md                        # Este archivo
```

## 🛠️ Personalizar Pruebas

### Cambiar número de usuarios

En `ChatLoadSimulation.scala`:
```scala
// Para 100 usuarios en lugar de 50:
val burstLoadProfile = rampUsers(100) during (10.seconds)
```

### Cambiar número de mensajes

En `ChatLoadSimulation.scala`:
```scala
// Para enviar 20 mensajes en lugar de 10:
.repeat(20) { i =>
  // ...
}
```

### Cambiar duración de ramp-up

En `ChatLoadSimulation.scala`:
```scala
// Para 10 minutos de ramp-up:
val rampUpLoadProfile = rampUsers(50) during (10.minutes)
```

## 📚 Referencias

- [Gatling Documentation](https://gatling.io/docs/)
- [WebSocket Testing in Gatling](https://gatling.io/docs/gatling/reference/current/extensions/websocket/)
- [Spring WebSocket STOMP](https://spring.io/guides/gs/messaging-stomp-websocket/)

## ✅ Checklist Pre-ejecución

Antes de ejecutar las pruebas, verifica:

- [ ] Backend corriendo en `http://localhost:8080`
- [ ] MySQL corriendo via Docker (`docker ps` muestra `chatseguro-mysql`)
- [ ] Sala de prueba creada y su ID guardado
- [ ] `ChatLoadSimulation.scala` actualizado con el Room ID correcto
- [ ] Java 17+ instalado (`java -version`)
- [ ] Maven 3.8+ instalado (`mvn -version`)
- [ ] Puerto 8080 no bloqueado por firewall

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs del backend: `docker logs chatseguro-springboot`
2. Verifica errores de compilación: `mvn clean compile -X`
3. Consulta el reporte HTML generado por Gatling
