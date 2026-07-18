import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VendedoresManager from '../components/VendedoresManager';
import * as vendedorService from '../services/vendedorService';

// Mock del servicio de vendedores
jest.mock('../services/vendedorService');

describe('VendedoresManager Component', () => {

    // Arrange: Configuración inicial antes de cada test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Verificar que el componente se renderiza correctamente (Arrange/Assert)
    test('renders form and vendor list section', async () => {
        // Mock de obtenerTodosLosVendedores para que devuelva una lista vacía
        vendedorService.obtenerTodosLosVendedores.mockResolvedValue([]);

        render(<VendedoresManager />);

        // Assert: Verificar elementos del formulario
        expect(screen.getByText(/Crear Vendedor/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Nombre del vendedor/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/correo@ejemplo.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Ej: 0991234567/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Ej: 10/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Ej: EMP-001/i)).toBeInTheDocument();

        // Assert: Verificar sección de listado
        expect(screen.getByText(/Listado de Vendedores/i)).toBeInTheDocument();

        // Esperamos a que se termine de cargar (estado inicial vacío)
        await waitFor(() => {
            expect(screen.getByText(/No hay vendedores registrados/i)).toBeInTheDocument();
        });
    });

    // Test 2: Verificar el flujo de creación de un vendedor (Act/Assert)
    test('calls crearVendedor when form is submitted with valid data', async () => {
        // Arrange
        vendedorService.obtenerTodosLosVendedores.mockResolvedValue([]);
        vendedorService.crearVendedor.mockResolvedValue({ message: "Vendedor creado" });

        render(<VendedoresManager />);

        // Act: Simular escritura en los inputs
        fireEvent.change(screen.getByPlaceholderText(/Nombre del vendedor/i), { target: { value: 'Test Vendor' } });
        fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), { target: { value: 'vendor@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Ej: 0991234567/i), { target: { value: '0990000000' } });
        fireEvent.change(screen.getByPlaceholderText(/Ej: 10/i), { target: { value: '5' } });
        fireEvent.change(screen.getByPlaceholderText(/Ej: EMP-001/i), { target: { value: 'EMP-999' } });

        // Act: Simular envío del formulario
        const submitBtn = screen.getByText('Crear');
        fireEvent.click(submitBtn);

        // Assert: Verificar que se llamó el servicio con los datos correctos
        await waitFor(() => {
            expect(vendedorService.crearVendedor).toHaveBeenCalledTimes(1);
            expect(vendedorService.crearVendedor).toHaveBeenCalledWith({
                name: 'Test Vendor',
                email: 'vendor@test.com',
                telefono: '0990000000',
                comision: '5',
                codigoEmpleado: 'EMP-999'
            });
            // Esperar también a que se recarguen los vendedores
            expect(vendedorService.obtenerTodosLosVendedores).toHaveBeenCalledTimes(2); // 1 al inicio, 1 tras crear
        });
    });

    // Test 3: Verificar que se cargan y muestran los vendedores (Act/Assert)
    test('displays vendors fetched from API', async () => {
        // Arrange
        const mockVendedores = [
            { id: 1, name: 'Vendedor 1', email: 'v1@test.com', telefono: '111', comision: '10', codigoEmpleado: 'V1' },
            { id: 2, name: 'Vendedor 2', email: 'v2@test.com', telefono: '222', comision: '20', codigoEmpleado: 'V2' }
        ];

        // Component expects array directly
        vendedorService.obtenerTodosLosVendedores.mockResolvedValue(mockVendedores);

        // Act
        render(<VendedoresManager />);

        // Assert: Esperar a que los vendedores aparezcan en el documento
        await waitFor(() => {
            expect(screen.getByText('Vendedor 1')).toBeInTheDocument();
            expect(screen.getByText('Vendedor 2')).toBeInTheDocument();
            expect(screen.getByText('V1')).toBeInTheDocument();
            expect(screen.getByText('V2')).toBeInTheDocument();
        });
    });

    // Test 4: Manejo de errores (Assert)
    test('shows error message if API fails', async () => {
        // Arrange
        vendedorService.obtenerTodosLosVendedores.mockRejectedValue(new Error('Error de conexión'));

        // Act
        render(<VendedoresManager />);

        // Assert
        await waitFor(() => {
            expect(screen.getByText(/Error de conexión/i)).toBeInTheDocument();
        });
    });
});
