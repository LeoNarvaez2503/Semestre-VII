const { Before, After } = require('@cucumber/cucumber');
const { cleanup } = require('@testing-library/react');
const { installMockApiFetch, resetMockData } = require('./mockApiFetch.cjs');
const { testContext } = require('./testContext.cjs');

Before(async function () {
  try {
    const mod = await import('sweetalert2');
    (mod.default || mod).close();
  } catch {
    // ignore
  }
  try {
    document.querySelectorAll('.swal2-container').forEach((n) => n.remove());
    document.body.classList.remove('swal2-shown', 'swal2-height-auto');
  } catch {
    // ignore
  }

  await resetMockData();
  installMockApiFetch();
  try {
    window.history.pushState({}, '', '/');
  } catch {
    // ignore
  }
});

After(function () {
  cleanup();
  testContext.container = null;
});
