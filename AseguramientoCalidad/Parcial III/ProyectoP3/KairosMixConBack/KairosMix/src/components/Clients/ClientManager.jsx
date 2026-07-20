import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Users, Phone, Mail, MapPin, CreditCard } from 'lucide-react';
import { api } from '../../utils/api';
import Swal from 'sweetalert2';
import ClientForm from './ClientForm';
import './ClientManager.css';

const ClientManager = () => {
    const [clients, setClients] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchError, setSearchError] = useState('');

    useEffect(() => {
        api.getClients().then(setClients).catch(console.error);
    }, []);

    const performSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setSearchPerformed(false);
            setSelectedClient(null);
            setSearchError('');
            return;
        }

        try {
            setSearchError('');
            const query = searchQuery.trim();

            // 4.1: Exact ID number search
            const exactIdMatch = clients.find(client => 
                client.idNumber.toLowerCase() === query.toLowerCase()
            );

            if (exactIdMatch) {
                setSelectedClient(exactIdMatch);
                setSearchResults([]);
                setSearchPerformed(true);
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Cliente encontrado',
                    html: `
                        <div style="text-align: left;">
                            <strong>Nombre:</strong> ${exactIdMatch.name}<br>
                            <strong>Identificación:</strong> ${exactIdMatch.idNumber}<br>
                            <strong>Email:</strong> ${exactIdMatch.email}<br>
                            <strong>Teléfono:</strong> ${exactIdMatch.phone}<br>
                            <strong>Dirección:</strong> ${exactIdMatch.address}
                        </div>
                    `,
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            // 4.2: Partial name search
            const nameMatches = clients.filter(client =>
                client.name.toLowerCase().includes(query.toLowerCase())
            );

            if (nameMatches.length === 0) {
                setSearchResults([]);
                setSelectedClient(null);
                setSearchPerformed(true);
                setSearchError('No se encontraron clientes');
                
                await Swal.fire({
                    icon: 'warning',
                    title: 'Sin resultados',
                    text: `No existe ningún cliente que coincida con "${query}"`,
                    confirmButtonText: 'Intentar de nuevo'
                });
                return;
            }

            if (nameMatches.length === 1) {
                const singleClient = nameMatches[0];
                setSelectedClient(singleClient);
                setSearchResults([]);
                setSearchPerformed(true);
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Cliente encontrado',
                    html: `
                        <div style="text-align: left;">
                            <strong>Nombre:</strong> ${singleClient.name}<br>
                            <strong>Identificación:</strong> ${singleClient.idNumber}<br>
                            <strong>Email:</strong> ${singleClient.email}<br>
                            <strong>Teléfono:</strong> ${singleClient.phone}<br>
                            <strong>Dirección:</strong> ${singleClient.address}
                        </div>
                    `,
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            setSearchResults(nameMatches);
            setSelectedClient(null);
            setSearchPerformed(true);
            
            const resultsList = nameMatches.map(client => 
                `• ${client.name} - ${client.idNumber} (${client.email})`
            ).join('<br>');
            
            await Swal.fire({
                icon: 'info',
                title: `${nameMatches.length} clientes encontrados`,
                html: `<div style="text-align: left;">${resultsList}</div>`,
                confirmButtonText: 'Ver en la lista'
            });

        } catch (error) {
            setSearchError('Error en la búsqueda');
            await Swal.fire({
                icon: 'error',
                title: 'Error del sistema',
                text: 'No se pudo completar la búsqueda. Por favor, inténtalo de nuevo.',
                confirmButtonText: 'Intentar de nuevo'
            });
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        performSearch(searchTerm);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setSearchPerformed(false);
        setSelectedClient(null);
        setSearchError('');
    };

    // Display logic for clients
    const displayClients = searchPerformed ? 
        (searchResults.length > 0 ? searchResults : 
            selectedClient ? [selectedClient] : []) : 
        clients;

    const handleAddClient = async (clientData) => {
        try {
            const newClient = await api.createClient(clientData);
            setClients([...clients, newClient]);
            setShowForm(false);
        } catch (e) { console.error(e); }
    };

    const handleEditClient = async (clientData) => {
        // Asumiendo que createClient sirve para upsert o no hay update explicit en el backend de Clients
        // Pero en un caso real se llamaría api.updateClient
        setClients(clients.map(c => 
            c.id === editingClient.id ? { ...clientData, id: editingClient.id } : c
        ));
        setEditingClient(null);
        setShowForm(false);
    };

    const handleDeleteClient = async (id) => {
        const client = clients.find(c => c.id === id);
        
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            html: `Vas a eliminar el cliente:<br><strong>${client.name}</strong><br><br>Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                await api.deleteClient(id);
                setClients(clients.filter(c => c.id !== id));
            
            await Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: 'El cliente ha sido eliminado correctamente.',
                timer: 1500,
                showConfirmButton: false
            });
            } catch(e) { console.error(e); }
        }
    };

    const openEditForm = (client) => {
        setEditingClient(client);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingClient(null);
    };

    const getIdTypeLabel = (idType) => {
        switch(idType) {
            case 'cedula': return 'Cédula';
            case 'ruc': return 'RUC';
            case 'pasaporte': return 'Pasaporte';
            default: return 'ID';
        }
    };

    return (
        <div className="client-manager">
            <div className="page-header">
                <div className="header-content">
                    <h1>
                        <Users className="page-icon" />
                        Gestión de Clientes
                    </h1>
                    <p className="page-description">
                        Administra tu cartera de clientes y sus datos de contacto
                    </p>
                </div>
                <button 
                    className="btn btn-success d-flex align-items-center"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={20} className="me-2" />
                    Nuevo Cliente
                </button>
            </div>

            <div className="search-section">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <div className="search-box">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o número de identificación..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control search-input"
                        />
                    </div>
                    <div className="search-actions">
                        <button 
                            type="submit" 
                            className="btn btn-primary me-2"
                            disabled={!searchTerm.trim()}
                        >
                            <Search size={18} className="me-1" />
                            Buscar
                        </button>
                        {searchPerformed && (
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary"
                                onClick={clearSearch}
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </form>
                
                {searchPerformed && (
                    <div className="search-status">
                        {selectedClient && (
                            <div className="alert alert-success">
                                <strong>Cliente encontrado:</strong> {selectedClient.name} ({selectedClient.idNumber})
                            </div>
                        )}
                        {searchResults.length > 0 && (
                            <div className="alert alert-info">
                                <strong>{searchResults.length} clientes encontrados</strong> - Se muestran abajo
                            </div>
                        )}
                        {searchError && (
                            <div className="alert alert-warning">
                                <strong>Sin resultados:</strong> {searchError}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="clients-grid">
                {displayClients.map(client => (
                    <div key={client.id} className="client-card">
                        <div className="client-header">
                            <div className="client-avatar">
                                <Users size={32} />
                            </div>
                            <div className="client-basic-info">
                                <h3 className="client-name">{client.name}</h3>
                                <span className="badge bg-secondary">
                                    {getIdTypeLabel(client.idType)}: {client.idNumber}
                                </span>
                            </div>
                        </div>
                        
                        <div className="client-details">
                            <div className="detail-item">
                                <Mail size={16} className="detail-icon" />
                                <span className="detail-text">{client.email}</span>
                            </div>
                            
                            <div className="detail-item">
                                <Phone size={16} className="detail-icon" />
                                <span className="detail-text">{client.phone}</span>
                            </div>
                            
                            <div className="detail-item">
                                <MapPin size={16} className="detail-icon" />
                                <span className="detail-text">{client.address}</span>
                            </div>
                        </div>
                        
                        <div className="client-actions">
                            <button
                                className="btn btn-warning btn-sm rounded-circle me-2"
                                onClick={() => openEditForm(client)}
                                title="Editar cliente"
                                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Edit size={16} />
                            </button>
                            <button
                                className="btn btn-danger btn-sm rounded-circle"
                                onClick={() => handleDeleteClient(client.id)}
                                title="Eliminar cliente"
                                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {displayClients.length === 0 && !searchPerformed && (
                <div className="empty-state">
                    <Users size={64} />
                    <h3>No hay clientes registrados</h3>
                    <p>Agrega tu primer cliente usando el botón "Nuevo Cliente"</p>
                </div>
            )}

            {displayClients.length === 0 && searchPerformed && (
                <div className="empty-state">
                    <Search size={64} />
                    <h3>Sin resultados de búsqueda</h3>
                    <p>No se encontraron clientes que coincidan con tu búsqueda</p>
                </div>
            )}

            {showForm && (
                <ClientForm
                    client={editingClient}
                    onSave={editingClient ? handleEditClient : handleAddClient}
                    onCancel={closeForm}
                    existingClients={clients}
                />
            )}
        </div>
    );
};

export default ClientManager;
