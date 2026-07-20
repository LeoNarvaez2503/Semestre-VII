import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, Users, ShoppingCart, Blend, User, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const isClientMode = user?.role === 'USER';

    // Definir menús según el modo
    const adminMenuItems = [
        {
        path: '/productos',
        icon: Package,
        label: 'Productos',
        description: 'Gestionar frutos secos'
        },
        {
        path: '/clientes',
        icon: Users,
        label: 'Clientes',
        description: 'Administrar base de clientes'
        },
        {
        path: '/pedidos',
        icon: ShoppingCart,
        label: 'Pedidos',
        description: 'Gestionar órdenes y ventas'
        },
        {
        path: '/mezcla-personalizada',
        icon: Blend,
        label: 'Mezcla Personalizada',
        description: 'Crear mezclas únicas'
        }
    ];

    const clientMenuItems = [
        {
        path: '/mezcla-personalizada',
        icon: Blend,
        label: 'Diseñar Mezcla',
        description: 'Crear tu mezcla personalizada'
        }
    ];

    const menuItems = isClientMode ? clientMenuItems : adminMenuItems;

    return (
        <aside className={`sidebar ${isClientMode ? 'client-mode' : ''}`} data-testid="sidebar">
        <div className="sidebar-header">
            <h1 
                className="sidebar-title"
            >
            <span className="brand-icon">🌰</span>
            KairosMix
            </h1>
            <p className="sidebar-subtitle">
                {isClientMode ? 'Portal de Cliente' : 'Frutos Secos Premium'}
            </p>
            {isClientMode && (
                <div className="client-mode-badge">
                    <User size={16} />
                    <span>Modo Cliente</span>
                </div>
            )}
        </div>

        <nav className="sidebar-nav">
            {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
                <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                data-testid={`nav-${item.path === '/' ? 'home' : item.path.replaceAll('/', '')}`}
                >
                <div className="nav-icon">
                    <IconComponent size={24} />
                </div>
                <div className="nav-content">
                    <div className="nav-label">{item.label}</div>
                    <div className="nav-description">{item.description}</div>
                </div>
                </Link>
            );
            })}
        </nav>

        <div className="sidebar-footer">
            <div className="user-info">
            <div className="user-avatar">
                <span>{user?.name?.charAt(0) || 'U'}</span>
            </div>
            <div className="user-details">
                <div className="user-name">
                    {user?.name || 'Usuario'}
                </div>
                <div className="user-role">
                    {user?.role === 'ADMIN' ? '👤 Administrador' : '👥 Usuario'}
                </div>
            </div>
            </div>
            
            {/* Mostrar botón de logout */}
            <button 
                className="logout-btn"
                onClick={() => {
                    logout();
                    navigate('/login');
                }}
                title="Cerrar sesión"
                data-testid="logout-button"
            >
                <LogOut size={16} />
                <span>Salir</span>
            </button>
        </div>
        </aside>
    );
    };

export default Sidebar;
