import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('I create a product:', (dataTable) => {
  const data = dataTable.rowsHash();

  cy.intercept('POST', '**/api/v1/products').as('createProduct');
  cy.get('[data-testid="new-product-button"]').click();
  cy.get('#name').clear().type(data.name);
  cy.get('#countryOfOrigin').clear().type(data.country);
  cy.get('#pricePerPound').clear().type(data.pricePerPound);
  cy.get('#wholesalePrice').clear().type(data.wholesalePrice);
  cy.get('#retailPrice').clear().type(data.retailPrice);
  cy.get('#initialStock').clear().type(data.initialStock);
  cy.contains('Guardar Producto').click();
  cy.wait('@createProduct');
});

Then('I should see product {string}', (name) => {
  cy.scrollTo('bottom');
  cy.findProductCard(name).scrollIntoView().should('be.visible');
});

When('I update product {string} stock to {string}', (name, stock) => {
  cy.intercept('PUT', '**/api/v1/products/*').as('updateProduct');
  cy.findProductCard(name).within(() => {
    cy.get('[data-testid^=edit-product-]').click();
  });
  cy.get('#initialStock').clear().type(stock);
  cy.contains('Actualizar').click();
  cy.wait('@updateProduct');
});

Then('I should see stock {string} for product {string}', (stockText, name) => {
  cy.findProductCard(name).within(() => {
    cy.contains(stockText).should('exist');
  });
});

When('I delete product {string}', (name) => {
  cy.intercept('DELETE', '**/api/v1/products/*').as('deleteProduct');
  cy.findProductCard(name).within(() => {
    cy.get('[data-testid^=delete-product-]').click();
  });
  cy.contains('button', /eliminar/i).click();
  cy.wait('@deleteProduct');
});

Then('I should not see product {string}', (name) => {
  cy.contains(name).should('not.exist');
});

When('I search for product {string}', (name) => {
  cy.get('.search-input').clear().type(name);
  cy.contains('button', 'Buscar').click();
});

Then('I should see a product found message', () => {
  cy.contains('Producto encontrado').should('exist');
  cy.confirmSwal('Entendido');
});
