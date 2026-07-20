const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', '..', 'proyecto', 'KairosMix', 'src');

function replaceFile(filePath, searchRegex, replacement) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(searchRegex, replacement);
        fs.writeFileSync(filePath, content);
    }
}

// 1. Update ProductManager
const productManagerPath = path.join(srcDir, 'components', 'Products', 'ProductManager.jsx');
let content = fs.readFileSync(productManagerPath, 'utf8');
content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { api } from '../../utils/api';");
// replace useEffect
content = content.replace(/useEffect\(\(\) => \{\s+\/\/ Cargar productos desde localStorage[\s\S]*?\}, \[\]\);/m, useEffect(() => {
    api.getProducts().then(setProducts).catch(console.error);
}, []););
// replace handleAddProduct
content = content.replace(/const handleAddProduct = async \(\w+\) => \{[\s\S]*?setShowForm\(false\);\n    \};/m, const handleAddProduct = async (productData) => {
        try {
            const newProduct = await api.createProduct({ ...productData, stock: productData.initialStock });
            setProducts([...products, newProduct]);
            setShowForm(false);
        } catch (e) { console.error(e); }
    };);
// replace handleEditProduct
content = content.replace(/const handleEditProduct = async \(\w+\) => \{[\s\S]*?setShowForm\(false\);\n    \};/m, const handleEditProduct = async (productData) => {
        try {
            const updated = await api.updateProduct(editingProduct.id, { ...productData, stock: productData.initialStock });
            setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
            setEditingProduct(null);
            setShowForm(false);
        } catch(e) { console.error(e); }
    };);
// replace handleDeleteProduct
content = content.replace(/const handleDeleteProduct = async \(\w+\) => \{[\s\S]*?// result\.isConfirmed[\s\S]*?localStorage\.setItem\('products', JSON\.stringify\(updatedProducts\)\);/m, const handleDeleteProduct = async (id) => {
        const product = products.find(p => p.id === id);
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            html: \Vas a eliminar el producto:<br><strong>\</strong><br><br>Esta acción no se puede deshacer.\,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
        if (result.isConfirmed) {
            try {
                await api.deleteProduct(id);
                setProducts(products.filter(p => p.id !== id)););
fs.writeFileSync(productManagerPath, content);

console.log("Refactoring complete");
