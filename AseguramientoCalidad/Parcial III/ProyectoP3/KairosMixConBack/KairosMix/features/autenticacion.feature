Feature: Sistema de Autenticación
  Como usuario
  Quiero poder iniciar sesión en KairosMix
  Para acceder a las funciones del sistema

  Scenario: Login exitoso como administrador
    Given estoy en la página de inicio de sesión
    When ingreso las credenciales de administrador
    And hago clic en el botón Ingresar
    Then debo ver el panel de administrador
    And debo ver la barra lateral con opciones de administrador

  Scenario: Login exitoso como usuario regular
    Given estoy en la página de inicio de sesión
    When ingreso las credenciales de usuario regular
    And hago clic en el botón Ingresar
    Then debo ver el panel de usuario
    And debo ver opciones limitadas en la barra lateral

  Scenario: Fallo al ingresar credenciales inválidas
    Given estoy en la página de inicio de sesión
    When ingreso un email incorrecto "test@test.com"
    And ingreso una contraseña incorrecta "wrong123"
    And hago clic en el botón Ingresar
    Then debo ver un mensaje de error "Email o contraseña inválidos"

  Scenario: Cargar credenciales de prueba de administrador
    Given estoy en la página de inicio de sesión
    When hago clic en "Cargar Credenciales" del administrador
    Then el campo email debe contener "admin@kairosmix.com"
    And el campo contraseña debe contener "admin123"

  Scenario: Logout del sistema
    Given estoy autenticado como administrador
    When hago clic en el botón Salir
    Then debo ser redirigido a la página de inicio de sesión
    And no debe haber datos de sesión guardados
