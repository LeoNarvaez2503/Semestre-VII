import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('I create an order for client id {string} with product code {string} quantity {string}', (clientId, productCode, quantity) => {
  cy.intercept('POST', '**/api/v1/orders').as('createOrder');
  cy.get('[data-testid="new-order-button"]').click();
  cy.get('[data-testid="order-client-select"]').select(clientId);
  cy.get('[data-testid="order-add-product-button"]').click();
  cy.get('[data-testid="order-product-select-0"]').select(productCode);
  cy.get('[data-testid="order-product-quantity-0"]').clear().type(quantity);
  cy.get('[data-testid="order-submit-button"]').click();
  cy.wait('@createOrder');
});

Then('I should see at least one order', () => {
  cy.get('[data-testid^=order-row-]').should('have.length.greaterThan', 0);
});

When('I change status for order id {string} to {string}', (orderId, status) => {
  cy.intercept('PATCH', '**/api/v1/orders/*/status*').as('updateStatus');
  cy.get(`[data-testid="order-status-${orderId}"]`).click();
  cy.get('.swal2-select').select(status);
  cy.contains('button', 'Cambiar Estado').click();
  cy.wait('@updateStatus');
});

Then('I should see order id {string} with status {string}', (orderId, status) => {
  cy.get(`[data-testid="order-row-${orderId}"]`).within(() => {
    cy.get(`[data-testid="order-status-${orderId}"]`).should('contain', status);
  });
});

When('I delete order id {string}', (orderId) => {
  cy.intercept('DELETE', '**/api/v1/orders/*').as('deleteOrder');
  cy.get(`[data-testid="delete-order-${orderId}"]`).click();
  cy.contains('button', /eliminar/i).click();
  cy.wait('@deleteOrder');
});

Then('I should not see order id {string}', (orderId) => {
  cy.get(`[data-testid="order-row-${orderId}"]`).should('not.exist');
});
