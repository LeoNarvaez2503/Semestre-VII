// Función auxiliar para formatear fecha a DD/MM/YYYY
const formatDateToDDMMYYYY = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const sampleProducts = [
  {
    id: 1,
    code: 'A01',
    name: 'Almendras Premium',
    countryOfOrigin: 'Estados Unidos',
    pricePerPound: 15.99,
    wholesalePrice: 14.50,
    retailPrice: 17.99,
    initialStock: 50,
    image: null,
    imagePreview: ''
  },
  {
    id: 2,
    code: 'N01',
    name: 'Nueces de Castilla',
    countryOfOrigin: 'Chile',
    pricePerPound: 22.50,
    wholesalePrice: 20.00,
    retailPrice: 25.99,
    initialStock: 30,
    image: null,
    imagePreview: ''
  },
  {
    id: 3,
    code: 'P01',
    name: 'Pasas Sultan',
    countryOfOrigin: 'Turquía',
    pricePerPound: 8.75,
    wholesalePrice: 7.50,
    retailPrice: 10.99,
    initialStock: 75,
    image: null,
    imagePreview: ''
  },
  {
    id: 4,
    code: 'P02',
    name: 'Pistachos Tostados',
    countryOfOrigin: 'Irán',
    pricePerPound: 35.00,
    wholesalePrice: 32.00,
    retailPrice: 39.99,
    initialStock: 20,
    image: null,
    imagePreview: ''
  },
  {
    id: 5,
    code: 'A02',
    name: 'Avellanas Enteras',
    countryOfOrigin: 'Italia',
    pricePerPound: 18.25,
    wholesalePrice: 16.50,
    retailPrice: 21.99,
    initialStock: 40,
    image: null,
    imagePreview: ''
  }
];

export const sampleClients = [
  {
    id: '1234567890',
    name: 'Juan Carlos Pérez',
    documentType: 'cedula',
    email: 'juan.perez@email.com',
    phone: '0998765432',
    address: 'Av. 10 de Agosto 1234, Quito',
    city: 'Quito',
    registrationDate: new Date().toISOString()
  },
  {
    id: '1790123456001',
    name: 'Comercial Los Andes S.A.',
    documentType: 'ruc',
    email: 'ventas@losandes.com',
    phone: '0987654321',
    address: 'Av. Amazonas 2345, Quito',
    city: 'Quito',
    registrationDate: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'AB123456',
    name: 'María González',
    documentType: 'pasaporte',
    email: 'maria.gonzalez@email.com',
    phone: '0976543210',
    address: 'Calle de las Flores 567, Guayaquil',
    city: 'Guayaquil',
    registrationDate: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const sampleSavedMixes = [
  {
    id: 1,
    name: 'Mezcla Energética Premium',
    components: [
      {
        productCode: 'A01',
        productName: 'Almendras Premium',
        quantity: 2.5,
        price: 44.98
      },
      {
        productCode: 'N01',
        productName: 'Nueces de Castilla',
        quantity: 1.5,
        price: 38.99
      },
      {
        productCode: 'P02',
        productName: 'Pistachos Tostados',
        quantity: 1.0,
        price: 39.99
      }
    ],
    totalPrice: 123.96,
    nutrition: {
      calories: 1485.5,
      protein: 89.4,
      fat: 275.8,
      carbs: 104.1,
      fiber: 45.2,
      vitamins: ['E', 'B6', 'Tiamina', 'B2', 'Niacina'],
      minerals: ['Magnesio', 'Manganeso', 'Cobre', 'Calcio', 'Hierro']
    },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 2,
    name: 'Mix Antioxidante Natural',
    components: [
      {
        productCode: 'A01',
        productName: 'Almendras Premium',
        quantity: 2.0,
        price: 35.98
      },
      {
        productCode: 'P01',
        productName: 'Pasas Sultan',
        quantity: 1.5,
        price: 16.49
      },
      {
        productCode: 'A02',
        productName: 'Avellanas Enteras',
        quantity: 2.0,
        price: 43.98
      }
    ],
    totalPrice: 96.45,
    nutrition: {
      calories: 1312.0,
      protein: 65.8,
      fat: 210.3,
      carbs: 158.7,
      fiber: 38.1,
      vitamins: ['E', 'K', 'B6', 'Folato', 'Tiamina'],
      minerals: ['Magnesio', 'Manganeso', 'Potasio', 'Hierro', 'Cobre']
    },
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: 3,
    name: 'Mezcla Proteica Light',
    components: [
      {
        productCode: 'A01',
        productName: 'Almendras Premium',
        quantity: 1.5,
        price: 26.99
      },
      {
        productCode: 'P01',
        productName: 'Pasas Sultan',
        quantity: 0.5,
        price: 5.50
      }
    ],
    totalPrice: 32.49,
    nutrition: {
      calories: 718.2,
      protein: 33.3,
      fat: 75.0,
      carbs: 72.0,
      fiber: 20.6,
      vitamins: ['E', 'B2', 'K', 'B6'],
      minerals: ['Magnesio', 'Calcio', 'Potasio', 'Hierro']
    },
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export const sampleOrders = [
  {
    id: 1,
    clientId: '1234567890',
    clientName: 'Juan Carlos Pérez',
    client: {
      id: '1234567890',
      name: 'Juan Carlos Pérez'
    },
    type: 'custom_mix',
    mixData: {
      name: 'Mezcla Energética Premium',
      components: [
        {
          productCode: 'A01',
          productName: 'Almendras Premium',
          quantity: 2.5,
          price: 44.98
        },
        {
          productCode: 'N01',
          productName: 'Nueces de Castilla',
          quantity: 1.5,
          price: 38.99
        }
      ],
      totalPrice: 83.97,
      nutrition: {
        calories: 1247.0,
        protein: 75.8,
        fat: 197.1,
        carbs: 74.5,
        fiber: 41.5
      }
    },
    products: [
      {
        code: 'A01',
        name: 'Almendras Premium',
        quantity: 2.5,
        unitPrice: 17.99,
        totalPrice: 44.98
      },
      {
        code: 'N01',
        name: 'Nueces de Castilla',
        quantity: 1.5,
        unitPrice: 25.99,
        totalPrice: 38.99
      }
    ],
    total: 83.97,
    totalAmount: 83.97,
    status: 'Pendiente',
    observations: 'Cliente solicita empaque especial para regalo',
    date: formatDateToDDMMYYYY(new Date(Date.now() - 86400000 * 2)),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 2,
    clientId: '1790123456001',
    clientName: 'Comercial Los Andes S.A.',
    client: {
      id: '1790123456001',
      name: 'Comercial Los Andes S.A.'
    },
    type: 'regular',
    products: [
      {
        code: 'P02',
        name: 'Pistachos Tostados',
        quantity: 5.0,
        unitPrice: 39.99,
        totalPrice: 199.95
      },
      {
        code: 'A02',
        name: 'Avellanas Enteras',
        quantity: 3.0,
        unitPrice: 21.99,
        totalPrice: 65.97
      }
    ],
    total: 265.92,
    totalAmount: 265.92,
    status: 'Completado',
    observations: 'Pedido mayorista - descuento aplicado',
    date: formatDateToDDMMYYYY(new Date(Date.now() - 86400000 * 5)),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 3,
    clientId: 'AB123456',
    clientName: 'María González',
    client: {
      id: 'AB123456',
      name: 'María González'
    },
    type: 'custom_mix',
    mixData: {
      name: 'Mix Antioxidante Natural',
      components: [
        {
          productCode: 'A01',
          productName: 'Almendras Premium',
          quantity: 1.0,
          price: 17.99
        },
        {
          productCode: 'P01',
          productName: 'Pasas Sultan',
          quantity: 0.5,
          price: 5.50
        }
      ],
      totalPrice: 23.49,
      nutrition: {
        calories: 728.5,
        protein: 22.75,
        fat: 50.42,
        carbs: 60.35,
        fiber: 14.35
      }
    },
    products: [
      {
        code: 'A01',
        name: 'Almendras Premium',
        quantity: 1.0,
        unitPrice: 17.99,
        totalPrice: 17.99
      },
      {
        code: 'P01',
        name: 'Pasas Sultan',
        quantity: 0.5,
        unitPrice: 10.99,
        totalPrice: 5.50
      }
    ],
    total: 23.49,
    totalAmount: 23.49,
    status: 'Completado',
    observations: 'Entrega rápida solicitada',
    date: formatDateToDDMMYYYY(new Date(Date.now() - 86400000 * 8)),
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: 4,
    clientId: '1234567890',
    clientName: 'Juan Carlos Pérez',
    client: {
      id: '1234567890',
      name: 'Juan Carlos Pérez'
    },
    type: 'regular',
    products: [
      {
        code: 'N01',
        name: 'Nueces de Castilla',
        quantity: 2.0,
        unitPrice: 25.99,
        totalPrice: 51.98
      }
    ],
    total: 51.98,
    totalAmount: 51.98,
    status: 'Cancelado',
    observations: 'Cliente canceló por cambio de planes',
    date: formatDateToDDMMYYYY(new Date(Date.now() - 86400000 * 10)),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 9).toISOString()
  }
];

// Función para inicializar datos de ejemplo
export const initializeSampleData = () => {
  // Forzar recarga de datos corregidos (eliminar la verificación)
  localStorage.setItem('products', JSON.stringify(sampleProducts));
  localStorage.setItem('clients', JSON.stringify(sampleClients));
  localStorage.setItem('savedMixes', JSON.stringify(sampleSavedMixes));
  localStorage.setItem('orders', JSON.stringify(sampleOrders));
  
  console.log('Datos de ejemplo actualizados correctamente');
};
