// Shared commands for modular E2E steps

Cypress.Commands.add('openSidebarSection', (label) => {
	cy.contains('.nav-item', label).click();
});

Cypress.Commands.add('findProductCard', (name) => {
	return cy.contains(name, { timeout: 10000 }).closest('[data-testid^=product-card-]');
});

Cypress.Commands.add('confirmSwal', (label) => {
	cy.contains('button', label, { timeout: 10000 }).click();
});