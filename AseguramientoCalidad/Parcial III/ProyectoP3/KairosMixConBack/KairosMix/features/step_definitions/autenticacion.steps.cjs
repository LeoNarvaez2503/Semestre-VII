const { Given, When, Then } = require('@cucumber/cucumber');
const { render, screen, waitFor } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const assert = require('assert/strict');
const React = require('react');
const { testContext } = require('./testContext.cjs');

let appModulePromise = null;
const getApp = async () => {
  if (!appModulePromise) {
    appModulePromise = import('../../src/App.jsx');
  }
  const mod = await appModulePromise;
  return mod.default;
};

// ============ PASOS DEFINIDOS ============

Given('estoy en la página de inicio de sesión', async function() {
  const App = await getApp();
  // Renderizar la aplicación
  const { container } = render(React.createElement(App));
  testContext.container = container;
  
  // Esperar a que aparezca el formulario de login
  await waitFor(() => {
    const loginForm = screen.getByText(/Sistema de Gestión de Frutos Secos/i);
    assert.ok(loginForm);
  }, { timeout: 5000 });
});

When('ingreso las credenciales de administrador', async function() {
  const emailInput = screen.getByTestId('email-input');
  const passwordInput = screen.getByTestId('password-input');
  
  await userEvent.clear(emailInput);
  await userEvent.type(emailInput, 'admin@kairosmix.com');
  
  await userEvent.clear(passwordInput);
  await userEvent.type(passwordInput, 'admin123');
});

When('ingreso las credenciales de usuario regular', async function() {
  const emailInput = screen.getByTestId('email-input');
  const passwordInput = screen.getByTestId('password-input');
  
  await userEvent.clear(emailInput);
  await userEvent.type(emailInput, 'usuario@kairosmix.com');
  
  await userEvent.clear(passwordInput);
  await userEvent.type(passwordInput, 'user123');
});

When('hago clic en el botón Ingresar', async function() {
  const loginButton = screen.getByTestId('login-button');
  await userEvent.click(loginButton);
  
  // Esperar a que se complete la autenticación
  await new Promise(resolve => setTimeout(resolve, 1000));
});

Then('debo ver el panel de administrador', async function() {
  await waitFor(() => {
    assert.ok(screen.queryByText(/Gestión de Productos/i));
  }, { timeout: 5000 });
});

Then('debo ver la barra lateral con opciones de administrador', async function() {
  await waitFor(() => {
    assert.ok(screen.getByRole('link', { name: /Productos/i }));
    assert.ok(screen.getByRole('link', { name: /Clientes/i }));
    assert.ok(screen.getByRole('link', { name: /Pedidos/i }));
  });
});

Then('debo ver el panel de usuario', async function() {
  await waitFor(() => {
    assert.ok(screen.getByRole('link', { name: /Diseñar Mezcla/i }));
  });
});

Then('debo ver opciones limitadas en la barra lateral', async function() {
  await waitFor(() => {
    assert.ok(screen.queryByText(/Diseñar Mezcla/i));
    assert.equal(screen.queryByRole('link', { name: /Productos/i }), null);
    assert.equal(screen.queryByRole('link', { name: /Clientes/i }), null);
    assert.equal(screen.queryByRole('link', { name: /Pedidos/i }), null);
  });
});

When('ingreso un email incorrecto {string}', async function(email) {
  const emailInput = screen.getByTestId('email-input');
  await userEvent.clear(emailInput);
  await userEvent.type(emailInput, email);
});

When('ingreso una contraseña incorrecta {string}', async function(password) {
  const passwordInput = screen.getByTestId('password-input');
  await userEvent.clear(passwordInput);
  await userEvent.type(passwordInput, password);
});

Then('debo ver un mensaje de error {string}', async function(errorMessage) {
  await waitFor(() => {
    assert.ok(screen.getByText(errorMessage));
  });
});

When('hago clic en "Cargar Credenciales" del administrador', async function() {
  const fillAdminButton = screen.getByTestId('fill-admin-button');
  await userEvent.click(fillAdminButton);
});

Then('el campo email debe contener {string}', async function(expectedEmail) {
  const emailInput = screen.getByTestId('email-input');
  assert.equal(emailInput.value, expectedEmail);
});

Then('el campo contraseña debe contener {string}', async function(expectedPassword) {
  const passwordInput = screen.getByTestId('password-input');
  assert.equal(passwordInput.value, expectedPassword);
});

Given('estoy autenticado como administrador', async function() {
  const App = await getApp();
  // Preparar datos en localStorage para simular autenticación
  const adminUser = {
    id: 1,
    email: 'admin@kairosmix.com',
    name: 'Administrador',
    role: 'ADMIN'
  };
  localStorage.setItem('currentUser', JSON.stringify(adminUser));
  localStorage.setItem('viewMode', 'admin');
  
  // Renderizar la aplicación
  const { container } = render(React.createElement(App));
  testContext.container = container;
  
  // Esperar a que se cargue la página principal
  await waitFor(() => {
    assert.ok(screen.queryByText(/Gestión de Productos/i));
  });
});

Given('estoy autenticado como usuario regular', async function() {
  const App = await getApp();
  const normalUser = {
    id: 2,
    email: 'usuario@kairosmix.com',
    name: 'Usuario',
    role: 'USER'
  };
  localStorage.setItem('currentUser', JSON.stringify(normalUser));
  localStorage.setItem('viewMode', 'client');

  const { container } = render(React.createElement(App));
  testContext.container = container;

  await waitFor(() => {
    assert.ok(screen.queryByText(/Diseñar Mezcla/i));
  }, { timeout: 5000 });
});

When('hago clic en el botón Salir', async function() {
  const logoutButton = screen.getByTestId('logout-button');
  await userEvent.click(logoutButton);
});

Then('debo ser redirigido a la página de inicio de sesión', async function() {
  await waitFor(() => {
    assert.ok(screen.getByText(/Sistema de Gestión de Frutos Secos/i));
  });
});

Then('no debe haber datos de sesión guardados', async function() {
  const savedUser = localStorage.getItem('currentUser');
  assert.equal(savedUser, null);
});
