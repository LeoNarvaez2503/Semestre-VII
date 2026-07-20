Feature: Navegación por el sistema
  Para usar KairosMix
  Como usuario autenticado
  Quiero poder navegar según mi rol

  Scenario: Administrador navega a todas las secciones
    Given estoy autenticado como administrador
    When voy a la página de productos
    Then debo ver la página de productos
    When voy a la página de clientes
    Then debo ver la página de clientes
    When voy a la página de órdenes
    Then debo ver la página de órdenes
    When voy a la página de mezcla personalizada
    Then debo ver la página de mezcla personalizada

  Scenario: Usuario regular solo ve la mezcla personalizada
    Given estoy autenticado como usuario regular
    When voy a la página de mezcla personalizada
    Then debo ver la página de mezcla personalizada
    And no debo ver opciones de administrador en la barra lateral

