import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('I am logged in as admin', () => {
  cy.loginAsAdmin();
});

Given('I open the {string} section', (label) => {
  cy.openSidebarSection(label);
});

Then('I should be on {string}', (path) => {
  cy.url().should('include', path);
});
