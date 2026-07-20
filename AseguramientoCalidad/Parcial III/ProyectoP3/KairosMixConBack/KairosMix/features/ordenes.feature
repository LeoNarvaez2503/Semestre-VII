Feature: Gestión de Pedidos
  Como administrador
  Quiero gestionar los pedidos de los clientes
  Para controlar las ventas

  Scenario: Ver lista de pedidos
    Given estoy autenticado como administrador
    When voy a la página de órdenes
    Then debo ver una lista de órdenes
    And cada orden debe mostrar el cliente y total

  Scenario: Crear un nuevo pedido
    Given estoy autenticado como administrador
    And estoy en la página de órdenes
    When hago clic en el botón "Nuevo Pedido"
    And selecciono el primer cliente disponible
    And agrego el primer producto con cantidad 2
    And confirmo el pedido
    Then debo ver la orden creada en la lista

  Scenario: Ver detalles de un pedido
    Given estoy autenticado como administrador
    And estoy en la página de órdenes
    When abro el detalle del primer pedido
    Then debo ver el detalle del pedido

