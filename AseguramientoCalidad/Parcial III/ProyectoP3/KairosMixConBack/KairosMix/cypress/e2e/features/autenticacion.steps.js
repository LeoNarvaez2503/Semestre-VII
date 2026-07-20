/* global cy, expect */

import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const adminCredentials = {
  email: 'admin@kairosmix.com',
  password: 'admin123',
};

const userCredentials = {
  email: 'usuario@kairosmix.com',
  password: 'user123',
};

Given('estoy en la página de inicio de sesión', () => {
  cy.visit('/login');
  cy.contains('Sistema de Gestión de Frutos Secos').should('be.visible');
});

When('ingreso las credenciales de administrador', () => {
  cy.get('[data-testid="email-input"]').clear().type(adminCredentials.email);
  cy.get('[data-testid="password-input"]').clear().type(adminCredentials.password);
});

When('ingreso las credenciales de usuario regular', () => {
  cy.get('[data-testid="email-input"]').clear().type(userCredentials.email);
  cy.get('[data-testid="password-input"]').clear().type(userCredentials.password);
});

When('hago clic en el botón Ingresar', () => {
  cy.get('[data-testid="login-button"]').click();
});

Then('debo ver el panel de administrador', () => {
  cy.location('pathname').should('eq', '/productos');
  cy.get('[data-testid="product-manager"]').should('be.visible');
});

Then('debo ver la barra lateral con opciones de administrador', () => {
  cy.get('[data-testid="sidebar"]').should('be.visible');
  cy.get('[data-testid="nav-productos"]').should('be.visible');
  cy.get('[data-testid="nav-clientes"]').should('be.visible');
  cy.get('[data-testid="nav-pedidos"]').should('be.visible');
  cy.get('[data-testid="nav-mezclapersonalizada"]').should('be.visible');
});

Then('debo ver el panel de usuario', () => {
  cy.location('pathname').should('eq', '/mezcla-personalizada');
  cy.get('[data-testid="sidebar"]').should('be.visible');
});

Then('debo ver opciones limitadas en la barra lateral', () => {
  cy.get('[data-testid="nav-mezclapersonalizada"]').should('be.visible');
  cy.get('[data-testid="nav-productos"]').should('not.exist');
  cy.get('[data-testid="nav-clientes"]').should('not.exist');
  cy.get('[data-testid="nav-pedidos"]').should('not.exist');
});

When('ingreso un email incorrecto {string}', (email) => {
  cy.get('[data-testid="email-input"]').clear().type(email);
});

When('ingreso una contraseña incorrecta {string}', (password) => {
  cy.get('[data-testid="password-input"]').clear().type(password);
});

Then('debo ver un mensaje de error {string}', (errorMessage) => {
  cy.get('.error-message').should('contain.text', errorMessage);
});

Given('estoy autenticado como administrador', () => {
  cy.visitWithAuth('/productos', 'admin');
  cy.get('[data-testid="product-manager"]').should('be.visible');
});

When('hago clic en el botón Salir', () => {
  cy.get('[data-testid="logout-button"]').click();
});

Then('debo ser redirigido a la página de inicio de sesión', () => {
  cy.location('pathname').should('eq', '/login');
  cy.contains('Sistema de Gestión de Frutos Secos').should('be.visible');
});

Then('no debe haber datos de sesión guardados', () => {
  cy.window().then((win) => {
    expect(win.localStorage.getItem('currentUser')).to.equal(null);
    expect(win.localStorage.getItem('viewMode')).to.equal(null);
  });
});
