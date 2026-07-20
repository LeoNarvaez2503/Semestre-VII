Feature: Navegación del panel
  Como administrador o cliente
  Quiero moverme por el menú lateral
  Para validar las rutas del front

  Scenario: Un administrador ve el menú completo y navega a Clientes
    Given estoy autenticado como administrador
    Then debo ver la barra lateral con opciones de administrador
    When hago clic en la opción "Clientes"
    Then debo ver el encabezado "Gestión de Clientes"
    And la URL debe incluir "/clientes"

  Scenario: Un usuario regular ve solo las opciones permitidas
    Given estoy autenticado como usuario regular
    Then debo ver opciones limitadas en la barra lateral
    And debo ver la opción "Diseñar Mezcla"
    And no debo ver la opción "Productos"
    And no debo ver la opción "Clientes"
    And no debo ver la opción "Pedidos"
