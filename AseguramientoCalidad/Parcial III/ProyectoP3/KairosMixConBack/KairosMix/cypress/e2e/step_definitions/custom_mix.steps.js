import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('I set mix name {string}', (name) => {
  cy.get('.mix-name-section input').clear().type(name);
});

When('I add component with product code {string} and quantity {string}', (productCode, quantity) => {
  cy.get('.product-selection select').select(productCode);
  cy.get('.product-selection input[type="number"]').clear().type(quantity);
  cy.contains('button', 'Agregar').click();
});

When('I save the mix without creating order', () => {
  cy.intercept('POST', '**/api/v1/custom-mixes').as('createMix');
  cy.contains('button', /Guardar Mezcla/i).click();
  cy.wait('@createMix');
  cy.confirmSwal('Continuar');
  cy.contains('button', 'No, gracias').click();
});

Then('I should see saved mix {string}', (name) => {
  cy.contains('button', 'Mezclas Guardadas').click();
  cy.contains('.saved-mixes-list', name, { timeout: 10000 }).should('exist');
});
