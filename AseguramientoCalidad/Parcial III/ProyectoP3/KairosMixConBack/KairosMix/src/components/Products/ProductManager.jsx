import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { api } from '../../utils/api';
import Swal from 'sweetalert2';
import ProductForm from './ProductForm';
import './ProductManager.css';

const ProductManager = () => {
const [products, setProducts] = useState([]);
const [showForm, setShowForm] = useState(false);
const [editingProduct, setEditingProduct] = useState(null);
const [searchTerm, setSearchTerm] = useState('');

  // Datos de ejemplo para productos de frutos secos
  useEffect(() => {
    api.getProducts().then(setProducts).catch(console.error);
  }, []);

    // New advanced search system
    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchError, setSearchError] = useState('');

    const performSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setSearchPerformed(false);
            setSelectedProduct(null);
            setSearchError('');
            return;
        }

        try {
            setSearchError('');
            const query = searchQuery.trim();

            // 4.1: Exact code search
            const exactCodeMatch = products.find(product => 
                product.code.toLowerCase() === query.toLowerCase()
            );

            if (exactCodeMatch) {
                setSelectedProduct(exactCodeMatch);
                setSearchResults([]);
                setSearchPerformed(true);
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Producto encontrado',
                    html: `
                        <div style="text-align: left;">
                            <strong>Código:</strong> ${exactCodeMatch.code}<br>
                            <strong>Nombre:</strong> ${exactCodeMatch.name}<br>
                            <strong>País:</strong> ${exactCodeMatch.countryOfOrigin}<br>
                            <strong>Precio base:</strong> $${exactCodeMatch.pricePerPound}/lb<br>
                            <strong>Stock:</strong> ${exactCodeMatch.initialStock} libras
                        </div>
                    `,
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            // 4.2 & 4.3: Partial name search
            const nameMatches = products.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );

            if (nameMatches.length === 0) {
                // Exception: No matches found
                setSearchResults([]);
                setSelectedProduct(null);
                setSearchPerformed(true);
                setSearchError('No se encontraron productos');
                
                await Swal.fire({
                    icon: 'warning',
                    title: 'Sin resultados',
                    text: `No existe ningún producto que coincida con "${query}"`,
                    confirmButtonText: 'Intentar de nuevo'
                });
                return;
            }

            if (nameMatches.length === 1) {
                // 4.3: Single result - show complete info
                const singleProduct = nameMatches[0];
                setSelectedProduct(singleProduct);
                setSearchResults([]);
                setSearchPerformed(true);
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Producto encontrado',
                    html: `
                        <div style="text-align: left;">
                            <strong>Código:</strong> ${singleProduct.code}<br>
                            <strong>Nombre:</strong> ${singleProduct.name}<br>
                            <strong>País:</strong> ${singleProduct.countryOfOrigin}<br>
                            <strong>Precio base:</strong> $${singleProduct.pricePerPound}/lb<br>
                            <strong>Mayorista:</strong> $${singleProduct.wholesalePrice}/lb<br>
                            <strong>Minorista:</strong> $${singleProduct.retailPrice}/lb<br>
                            <strong>Stock:</strong> ${singleProduct.initialStock} libras
                        </div>
                    `,
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            // 4.2: Multiple results - show list
            setSearchResults(nameMatches);
            setSelectedProduct(null);
            setSearchPerformed(true);
            
            const resultsList = nameMatches.map(product => 
                `• ${product.code} - ${product.name} ($${product.pricePerPound}/lb)`
            ).join('<br>');
            
            await Swal.fire({
                icon: 'info',
                title: `${nameMatches.length} productos encontrados`,
                html: `<div style="text-align: left;">${resultsList}</div>`,
                confirmButtonText: 'Ver en la lista'
            });

        } catch (error) {
            // Exception: System error
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
        setSelectedProduct(null);
        setSearchError('');
    };

    // Display logic for products
    const displayProducts = searchPerformed ? 
        (searchResults.length > 0 ? searchResults : 
         selectedProduct ? [selectedProduct] : []) : 
        products;

    const handleAddProduct = async (productData) => {
        try {
            const newProduct = await api.createProduct({ ...productData, stock: productData.initialStock });
            setProducts([...products, newProduct]);
            setShowForm(false);

            await Swal.fire({
                icon: 'success',
                title: '¡Guardado!',
                text: 'El producto ha sido creado correctamente.',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (e) { console.error(e); }
    };    

    const handleEditProduct = async (productData) => {
        try {
            const updated = await api.updateProduct(editingProduct.id, { ...productData, stock: productData.initialStock });
            setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
            setEditingProduct(null);
            setShowForm(false);

            await Swal.fire({
                icon: 'success',
                title: '¡Actualizado!',
                text: 'El producto ha sido actualizado correctamente.',
                timer: 1500,
                showConfirmButton: false
            });
        } catch(e) { console.error(e); }
    };

    const handleDeleteProduct = async (id) => {
        const product = products.find(p => p.id === id);
        
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            html: `Vas a eliminar el producto:<br><strong>${product.name}</strong><br><br>Esta acción no se puede deshacer.`,
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
                await api.deleteProduct(id);
                const updatedProducts = products.filter(p => p.id !== id);
                setProducts(updatedProducts);
            
            await Swal.fire({
                icon: 'success',
                title: '¡Eliminado!',
                text: 'El producto ha sido eliminado correctamente.',
                timer: 1500,
                showConfirmButton: false
            });
            } catch(e) { console.error(e); }
        }
    };

    const openEditForm = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return 'out-of-stock';
        if (stock <= 10) return 'low-stock';
        return 'in-stock';
    };

  return (
    <div className="product-manager" data-testid="product-manager">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <Package className="page-icon" />
            Gestión de Productos
          </h1>
          <p className="page-description">
            Administra tu inventario de frutos secos y productos premium
          </p>
        </div>
        <button 
          className="btn btn-success d-flex align-items-center"
          onClick={() => setShowForm(true)}
          data-testid="new-product-button"
        >
          <Plus size={20} className="me-2" />
          Nuevo Producto
        </button>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-box">
            <Search className="search-icon" />
              <input
              type="text"
              placeholder="Buscar por código exacto o nombre del producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control search-input"
              data-testid="product-search-input"
            />
          </div>
          <div className="search-actions">
            <button 
              type="submit" 
              className="btn btn-primary me-2"
              disabled={!searchTerm.trim()}
              data-testid="product-search-button"
            >
              <Search size={18} className="me-1" />
              Buscar
            </button>
            {searchPerformed && (
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={clearSearch}
                  data-testid="product-clear-button"
                >
                Limpiar
              </button>
            )}
          </div>
        </form>
        
        {searchPerformed && (
          <div className="search-status">
            {selectedProduct && (
              <div className="alert alert-success">
                <strong>Producto encontrado:</strong> {selectedProduct.name} ({selectedProduct.code})
              </div>
            )}
            {searchResults.length > 0 && (
              <div className="alert alert-info">
                <strong>{searchResults.length} productos encontrados</strong> - Se muestran abajo
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

      <div className="products-grid">
        {displayProducts.map(product => (
          <div key={product.id} className="product-card" data-testid={`product-card-${product.id}`}>
            <div className="product-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="image-placeholder">
                  <Package size={40} />
                </div>
              )}
            </div>
            
            <div className="product-info">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h3 className="product-name">{product.name}</h3>
                <span className="badge bg-secondary">{product.code}</span>
              </div>
              <p className="text-muted small mb-3">Origen: {product.countryOfOrigin}</p>
              
              <div className="product-details">
                <div className="detail-item">
                  <span className="detail-label">Precio Base:</span>
                  <span className="product-price">${product.pricePerPound}/lb</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Mayorista:</span>
                  <span className="text-success">${product.wholesalePrice}/lb</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Minorista:</span>
                  <span className="text-info">${product.retailPrice}/lb</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Stock:</span>
                  <span className={`stock-badge ${getStockStatus(product.initialStock)}`}>
                    {product.initialStock} libras
                  </span>
                </div>
              </div>
            </div>
            
            <div className="product-actions">
              <button
                className="btn btn-warning btn-sm rounded-circle me-2"
                onClick={() => openEditForm(product)}
                title="Editar producto"
                aria-label={`Editar producto ${product.name}`}
                data-testid={`edit-product-${product.id}`}
                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Edit size={16} />
              </button>
              <button
                className="btn btn-danger btn-sm rounded-circle"
                onClick={() => handleDeleteProduct(product.id)}
                title="Eliminar producto"
                aria-label={`Eliminar producto ${product.name}`}
                data-testid={`delete-product-${product.id}`}
                style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {displayProducts.length === 0 && !searchPerformed && (
        <div className="empty-state">
          <Package size={64} />
          <h3>No hay productos registrados</h3>
          <p>Agrega tu primer producto usando el botón "Nuevo Producto"</p>
        </div>
      )}

      {displayProducts.length === 0 && searchPerformed && (
        <div className="empty-state">
          <Search size={64} />
          <h3>Sin resultados de búsqueda</h3>
          <p>No se encontraron productos que coincidan con tu búsqueda</p>
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSave={editingProduct ? handleEditProduct : handleAddProduct}
          onCancel={closeForm}
          existingProducts={products}
        />
      )}
    </div>
  );
};

export default ProductManager;
