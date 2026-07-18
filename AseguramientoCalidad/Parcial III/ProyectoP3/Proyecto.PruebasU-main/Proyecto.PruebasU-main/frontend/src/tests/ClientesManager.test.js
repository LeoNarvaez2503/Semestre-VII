import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClientesManager from '../components/ClientesManager';
import * as clienteService from '../services/clienteService';

// Mock del servicio de clientes
jest.mock('../services/clienteService');

describe('ClientesManager Component', () => {

    // Arrange: Configuración inicial antes de cada test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test 1: Verificar que el componente se renderiza correctamente (Arrange/Assert)
    test('renders form and client list section', async () => {
        // Mock de obtenerTodosLosClientes para que devuelva una lista vacía
        clienteService.obtenerTodosLosClientes.mockResolvedValue({ clientes: [] });

        render(<ClientesManager />);

        // Assert: Verificar elementos del formulario
        expect(screen.getByText(/Crear Cliente/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Juan Pérez/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/correo@ejemplo.com/i)).toBeInTheDocument();

        // Assert: Verificar sección de listado
        expect(screen.getByText(/Listado de Clientes/i)).toBeInTheDocument();

        // Esperamos a que se termine de cargar (estado inicial vacío) para evitar warnings de 'act'
        await waitFor(() => {
            expect(screen.getByText(/No hay clientes registrados/i)).toBeInTheDocument();
        });
    });

    // Test 2: Verificar el flujo de creación de un cliente (Act/Assert)
    test('calls crearCliente when form is submitted with valid data', async () => {
        // Arrange
        clienteService.obtenerTodosLosClientes.mockResolvedValue([]);
        clienteService.crearCliente.mockResolvedValue({ message: "Cliente creado" });

        render(<ClientesManager />);

        // Act: Simular escritura en los inputs
        fireEvent.change(screen.getByPlaceholderText(/Juan Pérez/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText(/correo@ejemplo.com/i), { target: { value: 'test@user.com' } });
        fireEvent.change(screen.getByPlaceholderText(/0991234567/i), { target: { value: '0990000000' } });
        fireEvent.change(screen.getByPlaceholderText(/Quito/i), { target: { value: 'Test City' } });
        fireEvent.change(screen.getByPlaceholderText(/Dirección completa/i), { target: { value: 'Test Address' } });

        // Act: Simular envío del formulario
        const submitBtn = screen.getByText('Crear');
        fireEvent.click(submitBtn);

        // Assert: Verificar que se llamó el servicio con los datos correctos
        await waitFor(() => {
            expect(clienteService.crearCliente).toHaveBeenCalledTimes(1);
            expect(clienteService.crearCliente).toHaveBeenCalledWith({
                nombre: 'Test User',
                email: 'test@user.com',
                telefono: '0990000000',
                ciudad: 'Test City',
                direccion: 'Test Address'
            });
            // Esperar también a que se recarguen los clientes
            expect(clienteService.obtenerTodosLosClientes).toHaveBeenCalledTimes(2); // 1 al inicio, 1 tras crear
        });
    });

    // Test 3: Verificar que se cargan y muestran los clientes (Act/Assert)
    test('displays clients fetched from API', async () => {
        // Arrange
        const mockClientes = [
            { id: 1, nombre: 'Cliente 1', email: 'c1@test.com', telefono: '111', ciudad: 'C1', direccion: 'D1' },
            { id: 2, nombre: 'Cliente 2', email: 'c2@test.com', telefono: '222', ciudad: 'C2', direccion: 'D2' }
        ];

        // Importante: El componente maneja { clientes: [...] } o [...] directo. Simulamos el objeto.
        clienteService.obtenerTodosLosClientes.mockResolvedValue({ clientes: mockClientes });

        // Act
        render(<ClientesManager />);

        // Assert: Esperar a que los clientes aparezcan en el documento
        await waitFor(() => {
            expect(screen.getByText('Cliente 1')).toBeInTheDocument();
            expect(screen.getByText('Cliente 2')).toBeInTheDocument();
        });
    });

    // Test 4: Manejo de errores (Assert)
    test('shows error message if API fails', async () => {
        // Arrange
        clienteService.obtenerTodosLosClientes.mockRejectedValue(new Error('Error de conexión'));

        // Act
        render(<ClientesManager />);

        // Assert
        await waitFor(() => {
            expect(screen.getByText(/Error de conexión/i)).toBeInTheDocument();
        });
    });
});
