Feature: Gestión visual de productos
  Como administrador
  Quiero buscar y crear productos desde el front
  Para validar el flujo completo en Cypress

  Scenario: Buscar un producto existente por código
    Given estoy autenticado como administrador
    When busco el producto con código "A01"
    Then debo ver un modal de resultado exitoso
    And debo ver el producto "Almendras Premium"

  Scenario: Crear un nuevo producto
    Given estoy autenticado como administrador
    When abro el formulario de nuevo producto
    And completo el formulario con un producto válido
    And guardo el producto
    Then debo ver el código generado "P01"
    And debo ver el producto "Pecanas Gourmet" en la lista
