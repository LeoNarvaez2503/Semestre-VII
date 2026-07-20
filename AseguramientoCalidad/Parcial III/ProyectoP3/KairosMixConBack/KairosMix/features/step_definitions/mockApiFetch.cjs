let seedModulePromise = null;
const getSeedModule = async () => {
  if (!seedModulePromise) {
    seedModulePromise = import('../../src/data/seedData.js');
  }
  return seedModulePromise;
};

const jsonResponse = (data, status = 200) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  });

const parseUrlPath = (url) => {
  try {
    return new URL(url, 'http://localhost').pathname;
  } catch {
    return String(url);
  }
};

const readStore = () => ({
  products: JSON.parse(localStorage.getItem('products') || '[]'),
  clients: JSON.parse(localStorage.getItem('clients') || '[]'),
  orders: JSON.parse(localStorage.getItem('orders') || '[]'),
  customMixes: JSON.parse(localStorage.getItem('customMixes') || '[]'),
});

const writeStore = (store) => {
  if (store.products) localStorage.setItem('products', JSON.stringify(store.products));
  if (store.clients) localStorage.setItem('clients', JSON.stringify(store.clients));
  if (store.orders) localStorage.setItem('orders', JSON.stringify(store.orders));
  if (store.customMixes) localStorage.setItem('customMixes', JSON.stringify(store.customMixes));
};

const installMockApiFetch = () => {
  if (globalThis.fetch && globalThis.fetch.__isMockApiFetch) return;

  globalThis.fetch = async (input, init = {}) => {
    const method = (init.method || 'GET').toUpperCase();
    const path = parseUrlPath(input);
    const store = readStore();

    // Products
    if (path.endsWith('/products')) {
      if (method === 'GET') return jsonResponse(store.products);
      if (method === 'POST') {
        const body = init.body ? JSON.parse(init.body) : {};
        const nextId = Math.max(0, ...store.products.map((p) => Number(p.id) || 0)) + 1;
        const created = { id: nextId, ...body };
        store.products.push(created);
        writeStore(store);
        return jsonResponse(created, 201);
      }
    }
    if (path.match(/\/products\/\d+$/)) {
      const id = Number(path.split('/').pop());
      if (method === 'PUT') {
        const body = init.body ? JSON.parse(init.body) : {};
        store.products = store.products.map((p) => (Number(p.id) === id ? { ...p, ...body } : p));
        writeStore(store);
        return jsonResponse(store.products.find((p) => Number(p.id) === id) || null);
      }
      if (method === 'DELETE') {
        store.products = store.products.filter((p) => Number(p.id) !== id);
        writeStore(store);
        return jsonResponse({}, 204);
      }
    }

    // Clients
    if (path.endsWith('/clients')) {
      if (method === 'GET') return jsonResponse(store.clients);
      if (method === 'POST') {
        const body = init.body ? JSON.parse(init.body) : {};
        const created = { ...body };
        store.clients.push(created);
        writeStore(store);
        return jsonResponse(created, 201);
      }
    }
    if (path.match(/\/clients\/[^/]+$/)) {
      const id = path.split('/').pop();
      if (method === 'DELETE') {
        store.clients = store.clients.filter((c) => String(c.id) !== String(id));
        writeStore(store);
        return jsonResponse({}, 204);
      }
    }

    // Orders
    if (path.endsWith('/orders')) {
      if (method === 'GET') return jsonResponse(store.orders);
      if (method === 'POST') {
        const body = init.body ? JSON.parse(init.body) : {};
        const nextId = Math.max(0, ...store.orders.map((o) => Number(o.id) || 0)) + 1;
        const created = { id: nextId, ...body };
        store.orders.push(created);
        writeStore(store);
        return jsonResponse(created, 201);
      }
    }
    if (path.match(/\/orders\/\d+\/status$/) && method === 'PATCH') {
      const id = Number(path.split('/')[path.split('/').length - 2]);
      const url = new URL(String(input), 'http://localhost');
      const status = url.searchParams.get('status');
      store.orders = store.orders.map((o) => (Number(o.id) === id ? { ...o, status } : o));
      writeStore(store);
      return jsonResponse(store.orders.find((o) => Number(o.id) === id) || null);
    }
    if (path.match(/\/orders\/\d+$/) && method === 'DELETE') {
      const id = Number(path.split('/').pop());
      store.orders = store.orders.filter((o) => Number(o.id) !== id);
      writeStore(store);
      return jsonResponse({}, 204);
    }

    // Custom mixes
    if (path.endsWith('/custom-mixes')) {
      if (method === 'GET') return jsonResponse(store.customMixes);
      if (method === 'POST') {
        const body = init.body ? JSON.parse(init.body) : {};
        const nextId = Math.max(0, ...store.customMixes.map((m) => Number(m.id) || 0)) + 1;
        const created = { id: nextId, ...body };
        store.customMixes.push(created);
        writeStore(store);
        return jsonResponse(created, 201);
      }
    }
    if (path.match(/\/custom-mixes\/\d+$/) && method === 'DELETE') {
      const id = Number(path.split('/').pop());
      store.customMixes = store.customMixes.filter((m) => Number(m.id) !== id);
      writeStore(store);
      return jsonResponse({}, 204);
    }

    return jsonResponse([], 404);
  };

  globalThis.fetch.__isMockApiFetch = true;
};

const resetMockData = async () => {
  localStorage.clear();
  const { initializeSampleData } = await getSeedModule();
  initializeSampleData();
  try {
    const seededProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const normalized = seededProducts.map((p) => ({
      ...p,
      stock: typeof p.stock === 'number' ? p.stock : Number(p.initialStock) || 0,
    }));
    localStorage.setItem('products', JSON.stringify(normalized));
  } catch {
    // ignore
  }
  // Custom mixes are not part of seedData output key; keep empty.
  if (!localStorage.getItem('customMixes')) {
    localStorage.setItem('customMixes', JSON.stringify([]));
  }
};

module.exports = { installMockApiFetch, resetMockData };
