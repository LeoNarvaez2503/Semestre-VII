Feature: Gestión de Productos
  Como administrador
  Quiero gestionar los productos de frutos secos
  Para mantener el catálogo actualizado

  Scenario: Ver lista de productos
    Given estoy autenticado como administrador
    When voy a la página de productos
    Then debo ver una lista de productos
    And debo ver al menos un producto

  Scenario: Crear un nuevo producto
    Given estoy autenticado como administrador
    And estoy en la página de productos
    When hago clic en el botón "Nuevo Producto"
    And completo el formulario de producto con:
      | Campo            | Valor          |
      | Nombre           | Nueces Premium |
      | País de Origen   | Chile          |
      | Precio Base      | 25.50          |
      | Precio Mayorista | 23.00          |
      | Precio Minorista | 29.99          |
      | Stock Inicial    | 150            |
    And hago clic en el botón "Guardar Producto"
    Then debo ver el producto "Nueces Premium" en la lista

  Scenario: Actualizar stock de producto
    Given estoy autenticado como administrador
    And estoy en la página de productos
    When hago clic en el botón de editar del primer producto
    And cambio el stock a 75
    And hago clic en el botón "Actualizar Producto"
    Then el stock debe actualizar a 75

  Scenario: Eliminar un producto
    Given estoy autenticado como administrador
    And estoy en la página de productos
    When hago clic en el botón de eliminar del primer producto
    Then debo ver un diálogo de confirmación
    When hago clic en "Confirmar"
    Then el producto debe ser eliminado
    And la lista debe actualizarse
