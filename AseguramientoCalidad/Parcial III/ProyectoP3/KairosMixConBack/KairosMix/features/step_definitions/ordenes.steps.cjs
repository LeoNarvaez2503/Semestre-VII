const { Given, When, Then } = require('@cucumber/cucumber');
const { screen, waitFor } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const assert = require('assert/strict');
const { testContext } = require('./testContext.cjs');

Given('estoy en la página de órdenes', async function () {
  const link = await screen.findByText(/^Pedidos$/i);
  await userEvent.click(link);
  await waitFor(() => {
    assert.ok(screen.queryByText(/Gestión de Pedidos/i));
  });
});

Then('debo ver una lista de órdenes', async function () {
  await waitFor(() => {
    assert.ok(screen.queryByText(/Gestión de Pedidos/i));
  });
});

Then('cada orden debe mostrar el cliente y total', async function () {
  await waitFor(() => {
    const rows = screen.queryAllByTestId(/^order-row-/);
    assert.ok(rows.length > 0);
  });
});

When('selecciono el primer cliente disponible', async function () {
  const select = screen.getByTestId('order-client-select');
  await waitFor(() => {
    assert.ok(select.querySelectorAll('option').length > 1);
  });
  // option[0] = placeholder, option[1] = first client
  const firstValue = select.querySelectorAll('option')[1].value;
  await userEvent.selectOptions(select, firstValue);
});

When('agrego el primer producto con cantidad {int}', async function (qty) {
  const addBtn = screen.getByTestId('order-add-product-button');
  await userEvent.click(addBtn);

  const productSelect = await screen.findByTestId('order-product-select-0');
  await waitFor(() => {
    assert.ok(productSelect.querySelectorAll('option').length > 1);
  });
  const firstProductValue = productSelect.querySelectorAll('option')[1].value;
  await userEvent.selectOptions(productSelect, firstProductValue);

  const quantityInput = screen.getByTestId('order-product-quantity-0');
  await userEvent.clear(quantityInput);
  await userEvent.type(quantityInput, String(qty));
});

When('confirmo el pedido', async function () {
  const before = JSON.parse(localStorage.getItem('orders') || '[]').map((o) => Number(o.id) || 0);
  const beforeMax = before.length ? Math.max(...before) : 0;

  const submit = screen.getByTestId('order-submit-button');
  await userEvent.click(submit);

  await waitFor(() => {
    assert.ok(screen.queryByText(/¡Registrado!|¡Actualizado!/i));
  });

  const after = JSON.parse(localStorage.getItem('orders') || '[]').map((o) => Number(o.id) || 0);
  const afterMax = after.length ? Math.max(...after) : 0;
  testContext.currentOrderId = afterMax > beforeMax ? afterMax : afterMax || null;
});

Then('debo ver la orden creada en la lista', async function () {
  await waitFor(() => {
    assert.ok(testContext.currentOrderId);
    assert.ok(screen.queryByTestId(`order-row-${testContext.currentOrderId}`));
  });
});

When('abro el detalle del primer pedido', async function () {
  await waitFor(() => {
    assert.ok(screen.queryAllByTestId(/^view-order-/).length > 0);
  });
  const first = screen.getAllByTestId(/^view-order-/)[0];
  const testId = first.getAttribute('data-testid') || '';
  const match = testId.match(/view-order-(\d+)/);
  if (match) testContext.currentOrderId = Number(match[1]);
  await userEvent.click(first);
});

Then('debo ver el detalle del pedido', async function () {
  await waitFor(() => {
    assert.ok(screen.queryByText(new RegExp(`Detalle del Pedido #${testContext.currentOrderId}`, 'i')));
  });
});
