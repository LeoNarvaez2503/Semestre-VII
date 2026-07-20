// In dev, prefer same-origin calls (via Vite proxy) with default '/api/v1'.
// In prod, set VITE_API_BASE_URL to your deployed backend, e.g. 'https://api.example.com/api/v1'.
const BASE_URL = import.meta?.env?.VITE_API_BASE_URL || '/api/v1';

const toNumber = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeProduct = (product) => {
    if (!product) return product;
    const stock = product.stock ?? product.currentStock ?? product.initialStock ?? 0;
    return {
        ...product,
        stock,
        initialStock: product.initialStock ?? stock,
        currentStock: product.currentStock ?? stock
    };
};

const normalizeClient = (client) => {
    if (!client) return client;
    return {
        ...client,
        idNumber: client.idNumber ?? client.documentId ?? '',
        idType: client.idType ?? client.documentType ?? '',
        identification: client.identification ?? client.documentId ?? '',
        documentId: client.documentId ?? client.idNumber ?? '',
        documentType: client.documentType ?? client.idType ?? ''
    };
};

const statusCodeToLabel = (status) => {
    const map = {
        CLIENT_PENDING: 'client_pending',
        PENDING: 'Pendiente',
        PROCESSING: 'En Proceso',
        WAITING: 'En Espera',
        COMPLETED: 'Completado',
        CANCELLED: 'Cancelado'
    };
    return map[status] || status || 'Pendiente';
};

const statusLabelToCode = (status) => {
    const normalized = (status || '').toString().trim();
    const map = {
        client_pending: 'CLIENT_PENDING',
        'client pending': 'CLIENT_PENDING',
        pendiente: 'PENDING',
        'en proceso': 'PROCESSING',
        'en espera': 'WAITING',
        completado: 'COMPLETED',
        cancelado: 'CANCELLED'
    };
    return map[normalized.toLowerCase()] || normalized.toUpperCase() || 'PENDING';
};

const normalizeOrderItem = (item) => {
    if (!item) return item;
    const quantity = toNumber(item.quantity, 0);
    const unitPrice = toNumber(item.unitPrice ?? item.price, 0);
    const subtotal = item.subtotal ?? item.totalPrice ?? unitPrice * quantity;
    return {
        ...item,
        code: item.code ?? item.productCode ?? item.product?.code ?? '',
        name: item.name ?? item.productName ?? item.product?.name ?? '',
        price: unitPrice,
        unitPrice,
        totalPrice: subtotal,
        subtotal
    };
};

const normalizeMix = (mix) => {
    if (!mix) return mix;
    return {
        ...mix,
        totalPrice: toNumber(mix.totalPrice, 0),
        components: Array.isArray(mix.components)
            ? mix.components.map((component) => ({
                ...component,
                productId: component.productId ?? component.product?.id ?? null,
                productCode: component.productCode ?? component.product?.code ?? '',
                productName: component.productName ?? component.product?.name ?? '',
                quantity: toNumber(component.quantity, 0),
                unitPrice: toNumber(component.unitPrice ?? component.price, 0),
                price: toNumber(component.price ?? component.subtotal, 0),
                subtotal: toNumber(component.subtotal ?? component.price, 0)
            }))
            : [],
        createdAt: mix.createdAt ?? mix.created_at ?? null
    };
};

const normalizeOrder = (order) => {
    if (!order) return order;
    const items = Array.isArray(order.items) ? order.items : (Array.isArray(order.products) ? order.products : []);
    const normalizedItems = items.map(normalizeOrderItem);
    const totalPrice = toNumber(order.totalPrice ?? order.totalAmount ?? order.total, 0);
    const status = statusCodeToLabel(order.status);

    return {
        ...order,
        clientId: String(order.clientId ?? order.client?.id ?? ''),
        clientName: order.clientName ?? order.client?.name ?? 'Cliente no especificado',
        client: order.client ?? (order.clientId || order.client?.id ? {
            id: order.clientId ?? order.client?.id,
            name: order.clientName ?? order.client?.name ?? 'Cliente no especificado'
        } : null),
        status,
        items: normalizedItems,
        products: normalizedItems,
        totalPrice,
        totalAmount: totalPrice,
        total: totalPrice,
        subtotal: order.subtotal ?? totalPrice,
        taxes: order.taxes ?? 0,
        observations: order.observations ?? order.notes ?? '',
        notes: order.notes ?? order.observations ?? '',
        paymentMethod: order.paymentMethod ?? 'Efectivo',
        date: order.date ?? order.createdAt ?? '',
        createdAt: order.createdAt ?? null,
        updatedAt: order.updatedAt ?? null,
        clientRequest: order.clientRequest ?? (order.status === 'CLIENT_PENDING' || order.status === 'client_pending')
    };
};

const toApiOrderPayload = (order) => {
    const rawItems = Array.isArray(order?.items) && order.items.length > 0
        ? order.items
        : Array.isArray(order?.products) ? order.products : [];

    const items = rawItems.map((item) => ({
        productId: item.productId ?? item.id ?? item.product?.id ?? null,
        quantity: toNumber(item.quantity, 0),
        unitPrice: toNumber(item.unitPrice ?? item.price, 0),
        priceType: item.priceType ?? null
    })).filter((item) => item.productId != null);

    return {
        clientId: order?.clientId ?? order?.client?.id ?? null,
        status: statusLabelToCode(order?.status ?? 'PENDING'),
        items,
        notes: order?.notes ?? order?.observations ?? '',
        totalPrice: toNumber(order?.totalPrice ?? order?.totalAmount ?? order?.total, 0)
    };
};

const toApiCustomMixPayload = (mix) => ({
    name: mix?.name,
    description: mix?.description ?? '',
    clientId: mix?.clientId ?? mix?.client?.id ?? null,
    totalPrice: toNumber(mix?.totalPrice, 0),
    components: Array.isArray(mix?.components)
        ? mix.components.map((component) => ({
            productId: component.productId ?? component.id ?? component.product?.id ?? null,
            productCode: component.productCode ?? component.product?.code ?? '',
            productName: component.productName ?? component.product?.name ?? '',
            quantity: toNumber(component.quantity, 0),
            unitPrice: toNumber(component.unitPrice ?? component.price, 0),
            nutritionalInfo: component.nutritionalInfo ?? null
        }))
        : []
});

export const api = {
    // Products
    getProducts: async () => {
        const res = await fetch(`${BASE_URL}/products`);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data.map(normalizeProduct) : [];
    },
    createProduct: async (product) => {
        const payload = {
            ...product,
            initialStock: product.initialStock ?? product.stock,
            currentStock: product.currentStock ?? product.stock ?? product.initialStock
        };
        delete payload.stock;

        const res = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return normalizeProduct(await res.json());
    },
    updateProduct: async (id, product) => {
        const payload = {
            ...product,
            initialStock: product.initialStock ?? product.stock,
            currentStock: product.currentStock ?? product.stock ?? product.initialStock
        };
        delete payload.stock;

        const res = await fetch(`${BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return normalizeProduct(await res.json());
    },
    deleteProduct: async (id) => {
        await fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
    },

    // Clients
    getClients: async () => {
        const res = await fetch(`${BASE_URL}/clients`);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data.map(normalizeClient) : [];
    },
    createClient: async (client) => {
        const payload = {
            documentId: client.documentId ?? client.idNumber,
            documentType: client.documentType ?? client.idType,
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            city: client.city
        };

        const res = await fetch(`${BASE_URL}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return normalizeClient(await res.json());
    },
    deleteClient: async (id) => {
        await fetch(`${BASE_URL}/clients/${id}`, { method: 'DELETE' });
    },

    // Orders
    getOrders: async () => {
        const res = await fetch(`${BASE_URL}/orders`);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data.map(normalizeOrder) : [];
    },
    createOrder: async (order) => {
        const res = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(toApiOrderPayload(order))
        });
        return normalizeOrder(await res.json());
    },
    updateOrderStatus: async (id, status) => {
        // Backend expects request param name 'status' and the enum code.
        const code = statusLabelToCode(status);
        const res = await fetch(`${BASE_URL}/orders/${id}/status?status=${encodeURIComponent(code)}`, {
            method: 'PATCH'
        });
        return normalizeOrder(await res.json());
    },
    deleteOrder: async (id) => {
        await fetch(`${BASE_URL}/orders/${id}`, { method: 'DELETE' });
    },

    // Custom Mixes
    getCustomMixes: async () => {
        const res = await fetch(`${BASE_URL}/custom-mixes`);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data.map(normalizeMix) : [];
    },
    createCustomMix: async (mix) => {
        const res = await fetch(`${BASE_URL}/custom-mixes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(toApiCustomMixPayload(mix))
        });
        return normalizeMix(await res.json());
    },
    deleteCustomMix: async (id) => {
        await fetch(`${BASE_URL}/custom-mixes/${id}`, { method: 'DELETE' });
    }
};
