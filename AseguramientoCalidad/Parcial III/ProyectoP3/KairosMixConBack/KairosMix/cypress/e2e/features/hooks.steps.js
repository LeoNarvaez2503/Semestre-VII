/* global cy */

import { Before } from '@badeball/cypress-cucumber-preprocessor';

Before(() => {
  cy.clearLocalStorage();
  cy.viewport(1440, 900);
  cy.seedAppFixtures();
});
