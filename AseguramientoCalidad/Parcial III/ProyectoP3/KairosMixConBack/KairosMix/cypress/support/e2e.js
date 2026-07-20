// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Seed localStorage and intercept API calls with an in-memory store derived from fixture
beforeEach(() => {
	cy.fixture('sampleData.json').then((seed) => {
		// seed localStorage so UI that reads localStorage shows data
		cy.window().then((win) => {
			win.localStorage.setItem('products', JSON.stringify(seed.products));
			win.localStorage.setItem('clients', JSON.stringify(seed.clients));
			win.localStorage.setItem('orders', JSON.stringify(seed.orders));
			win.localStorage.setItem('customMixes', JSON.stringify(seed.savedMixes || []));
		});

		// mutable in-test store for intercept handlers
		const store = {
			products: [...seed.products],
			clients: [...seed.clients],
			orders: [...seed.orders],
			customMixes: [...(seed.savedMixes || [])]
		};

		// PRODUCTS
		cy.intercept('GET', '**/api/v1/products', (req) => {
			req.reply({ body: store.products });
		});

		cy.intercept('POST', '**/api/v1/products', (req) => {
			const nextId = Math.max(0, ...store.products.map(p => Number(p.id) || 0)) + 1;
			const created = { id: nextId, ...req.body };
			store.products.push(created);
			req.reply({ statusCode: 201, body: created });
		});

		cy.intercept('PUT', '**/api/v1/products/*', (req) => {
			const parts = req.url.split('/');
			const id = Number(parts[parts.length - 1]);
			store.products = store.products.map(p => (Number(p.id) === id ? { ...p, ...req.body } : p));
			const updated = store.products.find(p => Number(p.id) === id);
			req.reply({ body: updated });
		});

		cy.intercept('DELETE', '**/api/v1/products/*', (req) => {
			const parts = req.url.split('/');
			const id = Number(parts[parts.length - 1]);
			store.products = store.products.filter(p => Number(p.id) !== id);
			req.reply({ statusCode: 204 });
		});

		// CLIENTS
		cy.intercept('GET', '**/api/v1/clients', (req) => {
			req.reply({ body: store.clients });
		});

		cy.intercept('POST', '**/api/v1/clients', (req) => {
			const body = req.body || {};
			const created = { id: body.id || body.idNumber || `c${Date.now()}`, ...body };
			store.clients.push(created);
			req.reply({ statusCode: 201, body: created });
		});

		cy.intercept('DELETE', '**/api/v1/clients/*', (req) => {
			const id = req.url.split('/').pop();
			store.clients = store.clients.filter(c => String(c.id) !== String(id));
			req.reply({ statusCode: 204 });
		});

		// ORDERS
		cy.intercept('GET', '**/api/v1/orders', (req) => {
			req.reply({ body: store.orders });
		});

		cy.intercept('POST', '**/api/v1/orders', (req) => {
			const nextId = Math.max(0, ...store.orders.map(o => Number(o.id) || 0)) + 1;
			const created = { id: nextId, ...req.body };
			store.orders.push(created);
			req.reply({ statusCode: 201, body: created });
		});

		cy.intercept('PATCH', '**/api/v1/orders/*/status', (req) => {
			const parts = req.url.split('/');
			const id = Number(parts[parts.length - 2]);
			const url = new URL(req.url, 'http://localhost');
			const status = url.searchParams.get('status') || req.body?.status;
			store.orders = store.orders.map(o => (Number(o.id) === id ? { ...o, status } : o));
			req.reply({ body: store.orders.find(o => Number(o.id) === id) });
		});

		cy.intercept('DELETE', '**/api/v1/orders/*', (req) => {
			const id = Number(req.url.split('/').pop());
			store.orders = store.orders.filter(o => Number(o.id) !== id);
			req.reply({ statusCode: 204 });
		});

		// CUSTOM MIXES
		cy.intercept('GET', '**/api/v1/custom-mixes', (req) => {
			req.reply({ body: store.customMixes });
		});

		cy.intercept('POST', '**/api/v1/custom-mixes', (req) => {
			const nextId = Math.max(0, ...store.customMixes.map(m => Number(m.id) || 0)) + 1;
			const created = { id: nextId, ...req.body };
			store.customMixes.push(created);
			req.reply({ statusCode: 201, body: created });
		});

		cy.intercept('DELETE', '**/api/v1/custom-mixes/*', (req) => {
			const id = Number(req.url.split('/').pop());
			store.customMixes = store.customMixes.filter(m => Number(m.id) !== id);
			req.reply({ statusCode: 204 });
		});
	});
});

// Convenience command to login as admin using UI autofill
Cypress.Commands.add('loginAsAdmin', () => {
	cy.visit('/login');
	cy.get('[data-testid="fill-admin-button"]').click();
	cy.get('[data-testid="login-button"]').click();
	cy.url().should('include', '/productos');
});