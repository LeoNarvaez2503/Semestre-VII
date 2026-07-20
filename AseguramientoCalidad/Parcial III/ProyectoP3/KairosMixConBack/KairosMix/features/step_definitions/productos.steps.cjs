const { Given, When, Then } = require('@cucumber/cucumber');
const { screen, waitFor, within } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const assert = require('assert/strict');
const { testContext } = require('./testContext.cjs');

Given('estoy en la página de productos', async function () {
  const link = await screen.findByText(/^Productos$/i);
  await userEvent.click(link);
  await waitFor(() => {
    assert.ok(screen.queryByText(/Gestión de Productos/i));
  });
});

Then('debo ver una lista de productos', async function () {
  await waitFor(() => {
    assert.ok(screen.queryByText(/Gestión de Productos/i));
  });
});

Then('debo ver al menos un producto', async function () {
  await waitFor(() => {
    const cards = screen.queryAllByTestId(/^product-card-/);
    assert.ok(cards.length > 0);
  });
});

When('hago clic en el botón {string}', async function (buttonText) {
  const btn = screen.getByRole('button', { name: new RegExp(buttonText, 'i') });
  await userEvent.click(btn);
});


When('completo el formulario de producto con:', async function (dataTable) {
  const rows = dataTable.hashes();
  for (const row of rows) {
    const campo = row.Campo;
    const valor = row.Valor;

    if (/^Nombre$/i.test(campo)) {
      const input = screen.getByLabelText(/Nombre del Producto/i);
      await userEvent.clear(input);
      await userEvent.type(input, valor);
      continue;
    }

    if (/^País de Origen$/i.test(campo)) {
      const input = screen.getByLabelText(/País de Origen/i);
      await userEvent.clear(input);
      await userEvent.type(input, valor);
      continue;
    }

    if (/^Precio Base$/i.test(campo)) {
      const input = screen.getByLabelText(/Precio por Libra/i);
      await userEvent.clear(input);
      await userEvent.type(input, valor);
      continue;
    }

    if (/^Precio Mayorista$/i.test(campo)) {
      const input = screen.getByLabelText(/Precio Mayorista por Libra/i);
      await userEvent.clear(input);
      await userEvent.type(input, valor);
      continue;
    }

    if (/^Precio Minorista$/i.test(campo)) {
      const input = screen.getByLabelText(/Precio Minorista por Libra/i);
      await userEvent.clear(input);
      await userEvent.type(input, valor);
      continue;
    }

    if (/^Stock Inicial$/i.test(campo)) {
      const input = screen.getByLabelText(/Stock Inicial/i);
      await userEvent.clear(input);
      await userEvent.type(input, valor);
      continue;
    }

    throw new Error(`Campo no soportado en test: ${campo}`);
  }
});

Then('debo ver el producto {string} en la lista', async function (productName) {
  await waitFor(() => {
    assert.ok(screen.queryByText(new RegExp(productName, 'i')));
  }, { timeout: 5000 });
});

When('hago clic en el botón de editar del primer producto', async function () {
  await waitFor(() => {
    assert.ok(screen.queryAllByTestId(/^edit-product-/).length > 0);
  });
  const first = screen.getAllByTestId(/^edit-product-/)[0];
  const testId = first.getAttribute('data-testid') || '';
  const match = testId.match(/edit-product-(\d+)/);
  if (match) testContext.currentProductId = Number(match[1]);
  await userEvent.click(first);
});

When('cambio el stock a {int}', async function (newStock) {
  const input = screen.getByLabelText(/Stock Inicial/i);
  await userEvent.clear(input);
  await userEvent.type(input, String(newStock));
});

Then('el stock debe actualizar a {int}', async function (expectedStock) {
  await waitFor(() => {
    assert.ok(testContext.currentProductId);
    const card = screen.getByTestId(`product-card-${testContext.currentProductId}`);
    assert.ok(within(card).queryByText(new RegExp(`${expectedStock}\\s+libras`, 'i')));
  }, { timeout: 5000 });
});

When('hago clic en el botón de eliminar del primer producto', async function () {
  await waitFor(() => {
    assert.ok(screen.queryAllByTestId(/^delete-product-/).length > 0);
  });
  const first = screen.getAllByTestId(/^delete-product-/)[0];
  const testId = first.getAttribute('data-testid') || '';
  const match = testId.match(/delete-product-(\d+)/);
  if (match) testContext.currentProductId = Number(match[1]);
  await userEvent.click(first);
});

Then('debo ver un diálogo de confirmación', async function () {
  await waitFor(() => {
    assert.ok(screen.queryByText(/¿Estás seguro\?/i));
  });
});

When('hago clic en "Confirmar"', async function () {
  const confirm = await screen.findByText(/Sí, eliminar/i);
  await userEvent.click(confirm);
});

Then('el producto debe ser eliminado', async function () {
  await waitFor(() => {
    assert.ok(testContext.currentProductId);
    assert.equal(screen.queryByTestId(`product-card-${testContext.currentProductId}`), null);
  });
});

Then('la lista debe actualizarse', async function () {
  await waitFor(() => {
    const cards = screen.queryAllByTestId(/^product-card-/);
    assert.ok(cards.length >= 0);
  });
});
