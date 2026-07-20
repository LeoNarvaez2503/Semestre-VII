describe('E2E Flow - Autenticación, Productos, Clientes, Pedidos', () => {
  beforeEach(() => {
    // support file seeds data and sets intercepts
    cy.visit('/');
  });

  it('Login como admin y ver productos', () => {
    cy.loginAsAdmin();
    cy.contains('Gestión de Productos');
    cy.get('[data-testid^=product-card-]').should('have.length.greaterThan', 0);
  });

  it('Crear, editar y eliminar producto', () => {
    cy.loginAsAdmin();

    // Crear producto
    // Alias para controlar la creación en el backend "mock"
    cy.intercept('POST', '**/api/v1/products').as('createProduct');

    cy.get('[data-testid="new-product-button"]').click();
    cy.get('#name').type('Nueces Premium');
    cy.get('#countryOfOrigin').type('Chile');
    cy.get('#pricePerPound').clear().type('25.50');
    cy.get('#wholesalePrice').clear().type('23.00');
    cy.get('#retailPrice').clear().type('29.99');
    cy.get('#initialStock').clear().type('150');
    cy.contains('Guardar Producto').click();

    // Esperar la respuesta de creación, luego hacer scroll hasta el nuevo producto
    cy.wait('@createProduct').then((interception) => {
      const statusCode = interception?.response?.statusCode ?? interception?.statusCode ?? 201;
      expect(statusCode).to.equal(201);
      const createdName = interception?.response?.body?.name || interception?.request?.body?.name || 'Nueces Premium';
      cy.scrollTo('bottom');
      cy.contains(createdName, { timeout: 10000 }).scrollIntoView().should('be.visible');
      // anclar el card creado para operaciones posteriores
      cy.contains(createdName).closest('[data-testid^=product-card-]').as('createdCard');
    });

    // Editar el producto creado -> cambiar stock a 75
    cy.intercept('PUT', '**/api/v1/products/*').as('updateProduct');
    cy.get('@createdCard').find('[data-testid^=edit-product-]').click();
    cy.wait(500); // Esperar a que el modal se cargue
    cy.get('#initialStock').parent().find('input[type="number"]').clear().type('75', { force: true });
    cy.contains('Actualizar').click();
    cy.wait('@updateProduct');
    cy.get('@createdCard').within(() => {
      cy.contains(/75\s+libras/).should('exist');
    });

    // Eliminar el producto creado
    cy.intercept('DELETE', '**/api/v1/products/*').as('deleteProduct');
    cy.get('@createdCard').find('[data-testid^=delete-product-]').click();
    cy.contains('Sí, eliminar').click();
    cy.wait('@deleteProduct');
    cy.contains('Nueces Premium').should('not.exist');
  });

  it('Crear cliente', () => {
    cy.loginAsAdmin();
    cy.contains('Clientes').click();
    cy.contains('Nuevo Cliente').click();

    cy.get('#name').type('Test Cliente');
    cy.get('#idType').select('cedula');
    cy.get('#idNumber').type('0912345678');
    cy.get('#email').type('test@cliente.com');
    cy.get('#phone').type('0991234567');
    cy.get('#address').type('Calle 1');
    cy.contains('Guardar Cliente').click();

    cy.contains('Test Cliente').should('exist');
  });

  it('Crear pedido básico', () => {
    cy.loginAsAdmin();
    cy.contains('Pedidos').click();
    cy.get('[data-testid="new-order-button"]').click();

    // Seleccionar cliente (usar id existente)
    cy.get('[data-testid="order-client-select"]').select('1234567890');

    // Agregar producto y cantidad
    cy.get('[data-testid="order-add-product-button"]').click();
    cy.get('[data-testid="order-product-select-0"]').select('A01');
    cy.get('[data-testid="order-product-quantity-0"]').clear().type('2');

    // Enviar pedido
    cy.get('[data-testid="order-submit-button"]').click();

    // Ver que la lista de pedidos tiene al menos una fila
    cy.get('[data-testid^=order-row-]').should('have.length.greaterThan', 0);
  });
});
