import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// Credenciales de prueba precargadas
const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@kairosmix.com',
    password: 'admin123',
    role: 'ADMIN',
    name: 'Administrador'
  },
  user: {
    email: 'usuario@kairosmix.com',
    password: 'user123',
    role: 'USER',
    name: 'Usuario'
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) return null;
    try {
      const parsed = JSON.parse(savedUser);
      if (!localStorage.getItem('viewMode')) {
        localStorage.setItem('viewMode', parsed?.role === 'USER' ? 'client' : 'admin');
      }
      return parsed;
    } catch (e) {
      console.error('Error restoring session:', e);
      return null;
    }
  });
  const [loading] = useState(false);

  const login = (email, password) => {
    // Verificar contra credenciales de prueba
    if (email === TEST_CREDENTIALS.admin.email && password === TEST_CREDENTIALS.admin.password) {
      const adminUser = { 
        id: 1,
        email: TEST_CREDENTIALS.admin.email,
        name: TEST_CREDENTIALS.admin.name,
        role: TEST_CREDENTIALS.admin.role 
      };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      localStorage.setItem('viewMode', 'admin');
      return { success: true, role: 'ADMIN' };
    } else if (email === TEST_CREDENTIALS.user.email && password === TEST_CREDENTIALS.user.password) {
      const normalUser = { 
        id: 2,
        email: TEST_CREDENTIALS.user.email,
        name: TEST_CREDENTIALS.user.name,
        role: TEST_CREDENTIALS.user.role 
      };
      setUser(normalUser);
      localStorage.setItem('currentUser', JSON.stringify(normalUser));
      localStorage.setItem('viewMode', 'client');
      return { success: true, role: 'USER' };
    }
    return { success: false, error: 'Email o contraseña inválidos' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('viewMode');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, TEST_CREDENTIALS }}>
      {children}
    </AuthContext.Provider>
  );
}
