import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ProductsPage from './pages/ProductsPage';
import ClientsPage from './pages/ClientsPage';
import OrdersPage from './pages/OrdersPage';
import CustomMixPage from './pages/CustomMixPage';
import { initializeSampleData } from './data/seedData';
import './App.css';

function AppContent() {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Ya no se usan datos locales
  }, []);

  // Detectar si estamos en GitHub Pages o desarrollo local
  const isDev = import.meta?.env?.DEV ?? true;
  const basename = isDev ? '/' : '/KairosMix/';

  return (
    <Router basename={basename}>
      <Routes>
        {/* Ruta de login - disponible para todos */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas protegidas - requieren autenticación */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <Navigate
                        to={user?.role === 'USER' ? '/mezcla-personalizada' : '/productos'}
                        replace
                      />
                    }
                  />
                  <Route path="/productos" element={<ProductsPage />} />
                  <Route path="/clientes" element={<ClientsPage />} />
                  <Route path="/pedidos" element={<OrdersPage />} />
                  <Route path="/mezcla-personalizada" element={<CustomMixPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
