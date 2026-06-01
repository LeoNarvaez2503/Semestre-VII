# Implementación: Pruebas de Carga Gatling para ChatSeguro

## ✅ Completed Tasks

### 1. **Proyecto Maven Gatling**
- ✅ Creada carpeta `chat-load-tests/` con estructura Maven estándar
- ✅ `pom.xml` con todas las dependencias Gatling configuradas
- ✅ Scala 2.13, Java 17, Gatling 3.9.5
- ✅ Plugins Maven para compilación Scala y ejecución Gatling

### 2. **Simulaciones Implementadas**
- ✅ **Escenario 1 - BURST**: 50 usuarios conectan simultáneamente (10 seg), cada uno envía 10 mensajes
  - Utilidad: Valida respuesta del sistema bajo carga máxima instantánea
  - Duración: ~2 minutos
  
- ✅ **Escenario 2 - RAMP-UP**: 50 usuarios conectan gradualmente (5 min), envían mensajes cada 2 seg
  - Utilidad: Simula carga más realista con crecimiento progresivo
  - Duración: ~6-10 minutos

### 3. **Configuración & Setup**
- ✅ `gatling.conf` - Configuración de Gatling (output, charting, etc)
- ✅ `setup.sh` - Script Bash para crear sala de prueba (Linux/Mac)
- ✅ `setup.ps1` - Script PowerShell para crear sala de prueba (Windows)
- ✅ `.gitignore` - Exclusiones para Maven y Gatling

### 4. **Documentación Completa**
- ✅ `README.md` - Guía detallada con:
  - Requisitos previos
  - Pasos de inicialización
  - Instrucciones para ejecutar ambos escenarios
  - Interpretación de resultados (métricas clave)
  - Troubleshooting
  - Personalización de pruebas

## 📁 Estructura Final

```
chat-load-tests/
├── pom.xml                              # Maven configuration
├── setup.sh                             # Bash setup script
├── setup.ps1                            # PowerShell setup script
├── .gitignore                           # Git exclusions
├── README.md                            # Comprehensive guide
└── src/
    └── test/
        ├── scala/
        │   └── ChatLoadSimulation.scala  # Main simulation (2 scenarios)
        └── resources/
            └── gatling.conf             # Gatling configuration
```

## 🚀 Cómo Usar

### Opción 1: Setup Automático (Recomendado)

**Windows (PowerShell):**
```powershell
cd chat-load-tests
.\setup.ps1
```

**Linux/Mac (Bash):**
```bash
cd chat-load-tests
bash setup.sh
```

Esto automáticamente:
1. Verifica que el backend está corriendo
2. Autentica al admin
3. Crea una sala de prueba
4. Te da el Room ID y instrucciones

### Opción 2: Setup Manual

1. Obtener el Room ID:
```bash
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

2. Reemplazar en `ChatLoadSimulation.scala`:
```scala
val TEST_ROOM_ID = "YOUR_ROOM_ID_HERE"
```

3. Ejecutar pruebas:
```bash
cd chat-load-tests

# Escenario 1 - Burst (default)
mvn gatling:test -Dgatling.simulationClass=ChatLoadSimulation

# Escenario 2 - Ramp-up (editar archivo y descomentar)
# mvn gatling:test -Dgatling.simulationClass=ChatLoadSimulation
```

## 📊 Métricas que Capturará

| Métrica | Descripción | Target |
|---------|-------------|--------|
| **Mean Latency** | Promedio de tiempo de respuesta | < 1 seg |
| **p95 Latency** | 95% de requests bajo este tiempo | < 2 seg |
| **p99 Latency** | 99% de requests bajo este tiempo | < 3 seg |
| **Success Rate** | % de conexiones/mensajes exitosos | > 95% |
| **Active Sessions** | Usuarios conectados al tiempo | 50 |
| **Throughput** | Mensajes/segundo procesados | Medido |
| **Error Rate** | % de fallos | Cercano a 0% |

## 📈 Reportes Generados

Después de cada ejecución, Gatling crea un reporte HTML en:
```
target/gatling/chat-load-test-results-<timestamp>/index.html
```

El reporte incluye:
- ✅ Gráficas de latencia en tiempo real
- ✅ Sessions activas a lo largo del tiempo
- ✅ Throughput y requests/segundo
- ✅ Tabla de estadísticas (mean, min, max, percentiles)
- ✅ Tasa de errores
- ✅ Distribución de respuestas

## 🔧 Personalización

Editar `src/test/scala/ChatLoadSimulation.scala`:

**Cambiar número de usuarios:**
```scala
val burstLoadProfile = rampUsers(100) during (10.seconds)  // 100 users
```

**Cambiar duración de ramp-up:**
```scala
val rampUpLoadProfile = rampUsers(50) during (10.minutes)  // 10 minutes
```

**Cambiar mensajes por usuario:**
```scala
.repeat(20) { messageNum =>  // 20 messages instead of 10
```

## 🔍 Diagnóstico

### Latencias altas (> 5 seg)?
1. Verifica CPU/RAM: `docker stats`
2. Verifica logs: `docker logs chatseguro-springboot`
3. Intenta con menos usuarios primero

### Errores de conexión?
1. Verifica backend: `curl http://localhost:8080/api/rooms/info`
2. Verifica MySQL: `docker ps | grep mysql`
3. Verifica Room ID es correcto en `ChatLoadSimulation.scala`

### Errores de compilación?
```bash
# Limpia y reintenta
mvn clean compile

# Verifica Java version (debe ser 17+)
java -version
```

## 📝 Notas Importantes

1. **Room ID**: Debe ser un UUID válido de una sala existente
2. **PIN**: Debe coincidir con el PIN de la sala (default: "1234")
3. **Backend**: Debe estar corriendo antes de ejecutar pruebas
4. **Puerto**: Default 8080 (editar si está configurado diferente)

## 🎯 Objetivos Logrados

✅ **Diagnóstico completo** de performance bajo carga
✅ **Dos escenarios** realistas (burst + ramp-up)
✅ **Métricas detalladas** (latencia, throughput, errores)
✅ **Reportes HTML** automáticos con gráficas
✅ **Escalabilidad** validable (50+ usuarios)
✅ **Setup automático** (scripts shell)
✅ **Documentación** completa y clara

## ⚠️ Limitaciones Conocidas

- Las pruebas **no incluyen upload de archivos** (se planea para futuro)
- Simula WebSocket texto puro (no STOMP full protocol)
- Enfocado en diagnóstico, no optimización de infraestructura

---

**Próximos pasos:**
1. Ejecutar `setup.ps1` o `setup.sh`
2. Copiar Room ID a `ChatLoadSimulation.scala`
3. Ejecutar `mvn gatling:test`
4. Analizar reportes HTML
5. Documentar hallazgos
