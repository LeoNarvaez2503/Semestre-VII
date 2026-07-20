/* global cy */

import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

When('busco el producto con código {string}', (code) => {
  cy.get('[data-testid="product-search-input"]').clear().type(code);
  cy.get('[data-testid="product-search-button"]').click();
});

Then('debo ver un modal de resultado exitoso', () => {
  cy.get('.swal2-popup').should('be.visible');
  cy.get('.swal2-title').should('contain.text', 'Producto encontrado');
  cy.get('.swal2-confirm').click();
});

Then('debo ver el producto {string}', (productName) => {
  cy.get('.search-status').should('contain.text', productName);
  cy.contains('.product-card', productName).should('be.visible');
});

When('abro el formulario de nuevo producto', () => {
  cy.get('[data-testid="new-product-button"]').click();
  cy.get('[data-testid="product-form"]').should('be.visible');
});

When('completo el formulario con un producto válido', () => {
  cy.get('[data-testid="product-name-input"]').clear().type('Pecanas Gourmet');
  cy.get('[data-testid="product-country-input"]').clear().type('Perú');
  cy.get('[data-testid="product-price-input"]').clear().type('19.90');
  cy.get('[data-testid="product-wholesale-input"]').clear().type('16.50');
  cy.get('[data-testid="product-retail-input"]').clear().type('22.90');
  cy.get('[data-testid="product-stock-input"]').clear().type('12');
  cy.get('[data-testid="product-code-input"]').should('have.value', 'P01');
});

When('guardo el producto', () => {
  cy.get('[data-testid="product-save-button"]').click();
});

Then('debo ver el código generado {string}', (code) => {
  cy.contains('.product-card', code).should('be.visible');
});

Then('debo ver el producto {string} en la lista', (productName) => {
  cy.contains('.product-card', productName).should('be.visible');
});
