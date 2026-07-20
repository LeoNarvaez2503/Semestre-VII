import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('I create a client:', (dataTable) => {
  const data = dataTable.rowsHash();

  cy.contains('Nuevo Cliente').click();
  cy.get('#name').clear().type(data.name);
  cy.get('#idType').select(data.idType);
  cy.get('#idNumber').clear().type(data.idNumber);
  cy.get('#email').clear().type(data.email);
  cy.get('#phone').clear().type(data.phone);
  cy.get('#address').clear().type(data.address);
  cy.contains('Guardar Cliente').click();
});

Then('I should see client {string}', (name) => {
  cy.contains('.client-card', name, { timeout: 10000 }).should('exist');
});

When('I search for client id {string}', (idNumber) => {
  cy.get('.search-input').clear().type(idNumber);
  cy.contains('button', 'Buscar').click();
});

Then('I should see a client found message', () => {
  cy.contains('Cliente encontrado').should('exist');
  cy.confirmSwal('Entendido');
});

When('I delete client {string}', (name) => {
  cy.contains('.client-card', name).within(() => {
    cy.get('button[title="Eliminar cliente"]').click();
  });
  cy.contains('button', /eliminar/i).click();
});

Then('I should not see client {string}', (name) => {
  cy.contains('.client-card', name).should('not.exist');
});
