# Diagramas de Flujo del Sistema (Mushuc Runa)

Esta guía documenta los flujos principales del sistema (Arquitectura, Autenticación y Transacciones) mediante diagramas en formato **Mermaid**. Puedes visualizar estos diagramas directamente en lectores de Markdown compatibles (como GitHub, VS Code, etc.).

---

## 1. Arquitectura General y Flujo de Componentes

Este diagrama describe cómo interactúan los activos de red desde el navegador del cliente hasta la base de datos a través de los microservicios:

```mermaid
graph TD
    subgraph Cliente (Navegador/Host)
        FE[Frontend React SPA - Puerto 3000]
    end

    subgraph Red Interna de Docker (Hardened)
        DB[(Base de Datos PostgreSQL - Puerto 5432)]
        
        MS_CLI[Microservicio Clientes - Puerto 4001]
        MS_CTA[Microservicio Cuentas - Puerto 4002]
        MS_TX[Microservicio Transacciones - Puerto 4003]
    end

    FE -->|API Call /clientes| MS_CLI
    FE -->|API Call /cuentas| MS_CTA
    FE -->|API Call /transacciones| MS_TX

    MS_CLI -->|TypeORM / TCP| DB
    MS_CTA -->|TypeORM / TCP| DB
    MS_TX -->|TypeORM / TCP| DB

    style DB fill:#f9f,stroke:#333,stroke-width:2px
    style FE fill:#bbf,stroke:#333,stroke-width:2px
```

---

## 2. Flujo de Autenticación (Login)

Flujo detallado desde que el usuario ingresa sus credenciales en la interfaz hasta que se valida e inicia la auditoría:

```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant FE as Frontend (React)
    participant CLI as MS Clientes (NestJS)
    participant DB as PostgreSQL (DB)

    Usuario->>FE: Ingresa Credenciales (Cédula/Email + Clave)
    FE->>CLI: POST /clientes/login { identifier, password, ipAddress }
    Note over CLI: Valida credenciales contra base de datos
    CLI->>DB: Busca usuario por Email o Cédula
    DB-->>CLI: Retorna datos de usuario (UserEntity)
    
    alt Credenciales Incorrectas o Usuario Suspendido
        CLI->>DB: Guarda registro de auditoría (LOGIN_FAILED)
        CLI-->>FE: HTTP 401 Unauthorized (Error de credenciales)
        FE-->>Usuario: Muestra error "Credenciales inválidas"
    else Credenciales Correctas
        CLI->>DB: Guarda registro de auditoría (LOGIN_SUCCESS)
        CLI-->>FE: HTTP 201 Created { Token/Datos de sesión }
        FE->>FE: Guarda sesión en LocalStorage / Contexto
        FE-->>Usuario: Redirecciona al Dashboard (Según Rol)
    end
```

---

## 3. Flujo Transaccional (Transferencia entre Cuentas)

Este diagrama muestra cómo viaja una transferencia de dinero y cómo interactúan las APIs de Transacciones y Base de Datos garantizando los registros contables y la bitácora de auditoría:

```mermaid
sequenceDiagram
    autonumber
    actor Cliente
    participant FE as Frontend (React)
    participant TX as MS Transacciones (NestJS)
    participant DB as PostgreSQL (DB)

    Cliente->>FE: Solicita Transferencia (Cuenta Destino + Monto)
    FE->>TX: POST /transacciones { sourceAccountId, destinationAccountId, type: 'TRANSFER', amount, ipAddress }
    
    Note over TX: Inicia Transacción SQL (Database Transaction)
    TX->>DB: Valida cuenta de origen (Existe y tiene fondos suficientes)
    DB-->>TX: Detalles de Cuenta Origen
    
    alt Fondos Insuficientes o Cuenta Bloqueada
        TX->>DB: Guarda log de auditoría (TRANSFER_FAILED)
        TX-->>FE: HTTP 400 Bad Request (Error)
        FE-->>Cliente: Muestra error "Fondos insuficientes"
    else Datos Válidos
        TX->>DB: Resta 'amount' de Cuenta Origen (Balance)
        TX->>DB: Suma 'amount' a Cuenta Destino (Balance)
        TX->>DB: Registra movimiento en tabla 'transactions'
        TX->>DB: Registra evento en tabla 'audit_logs' (TRANSFER_SUCCESS)
        Note over TX: Confirma Transacción SQL (Commit)
        DB-->>TX: Éxito
        TX-->>FE: HTTP 201 Created { Detalles de Transacción, refCode }
        FE-->>Cliente: Muestra comprobante de transferencia exitosa
    end
```

---

## 4. Flujo de Roles y Acciones en el Sistema

Este mapa conceptual detalla las actividades que cada rol de usuario puede desencadenar dentro de la plataforma:

```mermaid
mindmap
  root((Mushuc Runa App))
    Administrador
      Crear empleados
      Suspender / Activar empleados
      Modificar límites de transferencia diarios
      Ajustar comisiones e intereses
    Cajero
      Realizar depósitos a clientes
      Realizar retiros a clientes
      Realizar transferencias
    Auditor
      Visualizar la Bitácora de Auditoría general (Audit Logs)
    Cliente
      Consultar saldos y movimientos (Ahorros / Corriente)
      Realizar transferencias a terceros
      Ver bitácora personal
```
