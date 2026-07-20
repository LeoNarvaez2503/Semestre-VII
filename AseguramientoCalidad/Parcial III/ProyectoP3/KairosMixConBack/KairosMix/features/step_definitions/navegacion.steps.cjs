const { When, Then } = require('@cucumber/cucumber');
const { screen, waitFor } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const assert = require('assert/strict');

const clickSidebarLink = async (labelRegex) => {
  const link = await screen.findByText(labelRegex);
  await userEvent.click(link);
};

When('voy a la página de productos', async function () {
  await clickSidebarLink(/^Productos$/i);
});

When('voy a la página de clientes', async function () {
  await clickSidebarLink(/^Clientes$/i);
});

When('voy a la página de órdenes', async function () {
  await clickSidebarLink(/^Pedidos$/i);
});

When('voy a la página de mezcla personalizada', async function () {
  const adminLink = screen.queryByText(/^Mezcla Personalizada$/i);
  const userLink = screen.queryByText(/^Diseñar Mezcla$/i);
  const link = adminLink || userLink;
  assert.ok(link);
  await userEvent.click(link);
});

Then('debo ver la página de productos', async function () {
  await waitFor(() => {
    assert.ok(screen.queryByText(/Gestión de Productos/i));
  });
});

Then('debo ver la página de clientes', async function () {
  await waitFor(() => {
    assert.ok(screen.queryByText(/Gestión de Clientes/i));
  });
});

Then('debo ver la página de órdenes', async function () {
  await waitFor(() => {
    assert.ok(screen.queryByText(/Gestión de Pedidos/i));
  });
});

Then('debo ver la página de mezcla personalizada', async function () {
  await waitFor(() => {
    assert.ok(
      screen.queryByText(/Diseñador de Mezclas Personalizadas/i) ||
        screen.queryByText(/Diseña Tu Mezcla Perfecta/i)
    );
  });
});

Then('no debo ver opciones de administrador en la barra lateral', async function () {
  await waitFor(() => {
    assert.equal(screen.queryByText(/^Productos$/i), null);
    assert.equal(screen.queryByText(/^Clientes$/i), null);
    assert.equal(screen.queryByText(/^Pedidos$/i), null);
  });
});
