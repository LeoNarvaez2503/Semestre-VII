/* global cy */

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('estoy autenticado como usuario regular', () => {
  cy.visitWithAuth('/mezcla-personalizada', 'user');
  cy.location('pathname').should('eq', '/mezcla-personalizada');
});

When('hago clic en la opción {string}', (label) => {
  cy.contains('[data-testid^="nav-"]', label).click();
});

Then('debo ver el encabezado {string}', (heading) => {
  cy.contains('h1, h2', heading).should('be.visible');
});

Then('la URL debe incluir {string}', (pathFragment) => {
  cy.location('pathname').should('include', pathFragment);
});

Then('debo ver la opción {string}', (label) => {
  cy.contains('[data-testid^="nav-"]', label).should('be.visible');
});

Then('no debo ver la opción {string}', (label) => {
  cy.contains('[data-testid^="nav-"]', label).should('not.exist');
});
