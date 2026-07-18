import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConcesionariasManager from '../components/ConcesionariasManager';
import * as concesionariaService from '../services/concesionariaService';

// Mock del servicio
jest.mock('../services/concesionariaService');

describe('ConcesionariasManager Component', () => {
    const mockConcesionarias = [
        {
            id: 1,
            nombre: 'Concesionaria A',
            direccion: 'Calle 123',
            telefono: '0991234567',
            ciudad: 'Quito',
            gerente: 'Juan Gerente'
        },
        {
            id: 2,
            nombre: 'Concesionaria B',
            direccion: 'Av Principal',
            telefono: '0999876543',
            ciudad: 'Guayaquil',
            gerente: 'Maria Gerente'
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup mocks
        concesionariaService.obtenerTodasLasConcesionarias.mockResolvedValue(mockConcesionarias);
        concesionariaService.crearConcesionaria.mockResolvedValue({ ...mockConcesionarias[0], id: 3 });
        concesionariaService.actualizarConcesionaria.mockResolvedValue({ ...mockConcesionarias[0], nombre: 'Concesionaria A Updated' });
        concesionariaService.eliminarConcesionaria.mockResolvedValue({});

        window.confirm = jest.fn(() => true);
        window.scrollTo = jest.fn();
    });

    test('debe renderizar título y lista de concesionarias', async () => {
        render(<ConcesionariasManager />);

        expect(screen.getByText('Crear Concesionaria')).toBeInTheDocument();
        // Estado de carga inicial
        expect(screen.getByText('Cargando...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Concesionarias Registradas')).toBeInTheDocument();
        expect(screen.getByText('Concesionaria A')).toBeInTheDocument();
        expect(screen.getByText('Concesionaria B')).toBeInTheDocument();
    });

    test('debe crear una nueva concesionaria', async () => {
        render(<ConcesionariasManager />);
        await waitFor(() => expect(screen.queryByText('Cargando...')).not.toBeInTheDocument());

        // Llenar formulario
        fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Nueva Concesionaria' } });
        fireEvent.change(screen.getByLabelText(/^Gerente/i), { target: { value: 'Nuevo Gerente' } });
        fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '0987654321' } });
        fireEvent.change(screen.getByLabelText(/Ciudad/i), { target: { value: 'Cuenca' } });
        fireEvent.change(screen.getByLabelText(/Dirección/i), { target: { value: 'Av. Loja' } });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: 'Crear' }));

        await waitFor(() => {
            expect(concesionariaService.crearConcesionaria).toHaveBeenCalledWith(expect.objectContaining({
                nombre: 'Nueva Concesionaria',
                gerente: 'Nuevo Gerente',
                telefono: '0987654321',
                ciudad: 'Cuenca',
                direccion: 'Av. Loja'
            }));
        });

        expect(concesionariaService.obtenerTodasLasConcesionarias).toHaveBeenCalledTimes(2);
    });

    test('debe validar formulario incompleto', async () => {
        render(<ConcesionariasManager />);
        await waitFor(() => expect(screen.queryByText('Cargando...')).not.toBeInTheDocument());

        // Dejar campos vacíos y enviar
        fireEvent.click(screen.getByRole('button', { name: 'Crear' }));

        // JSDOM ignora la validación HTML5, así que el handler se ejecuta
        // El componente tiene validación manual: if (!form.nombre ...) setError(...)

        await waitFor(() => {
            expect(screen.getByText('Todos los campos son requeridos')).toBeInTheDocument();
        });

        expect(concesionariaService.crearConcesionaria).not.toHaveBeenCalled();
    });

    test('debe cargar datos para editar', async () => {
        render(<ConcesionariasManager />);
        await waitFor(() => expect(screen.queryByText('Cargando...')).not.toBeInTheDocument());

        const editBtns = screen.getAllByTitle('Editar');
        fireEvent.click(editBtns[0]);

        expect(screen.getByText('Editar Concesionaria')).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre/i)).toHaveValue('Concesionaria A');
        expect(screen.getByLabelText(/Ciudad/i)).toHaveValue('Quito');
    });

    test('debe actualizar una concesionaria', async () => {
        render(<ConcesionariasManager />);
        await waitFor(() => expect(screen.queryByText('Cargando...')).not.toBeInTheDocument());

        // Editar
        fireEvent.click(screen.getAllByTitle('Editar')[0]);

        // Cambiar nombre
        fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Concesionaria Editada' } });

        // Submit actualizar
        fireEvent.click(screen.getByRole('button', { name: 'Actualizar' }));

        await waitFor(() => {
            expect(concesionariaService.actualizarConcesionaria).toHaveBeenCalledWith(1, expect.objectContaining({
                nombre: 'Concesionaria Editada'
            }));
        });

        expect(concesionariaService.obtenerTodasLasConcesionarias).toHaveBeenCalledTimes(2);
    });

    test('debe eliminar una concesionaria', async () => {
        render(<ConcesionariasManager />);
        await waitFor(() => expect(screen.queryByText('Cargando...')).not.toBeInTheDocument());

        const deleteBtns = screen.getAllByTitle('Eliminar');
        fireEvent.click(deleteBtns[0]);

        expect(window.confirm).toHaveBeenCalled();

        await waitFor(() => {
            expect(concesionariaService.eliminarConcesionaria).toHaveBeenCalledWith(1);
        });

        expect(concesionariaService.obtenerTodasLasConcesionarias).toHaveBeenCalledTimes(2);
    });

    test('debe manejar error al guardar', async () => {
        concesionariaService.crearConcesionaria.mockRejectedValue(new Error('Error de servidor'));

        render(<ConcesionariasManager />);
        await waitFor(() => expect(screen.queryByText('Cargando...')).not.toBeInTheDocument());

        // Llenar datos válidos
        fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Test' } });
        fireEvent.change(screen.getByLabelText(/^Gerente/i), { target: { value: 'Gerente' } });
        fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '123' } });
        fireEvent.change(screen.getByLabelText(/Ciudad/i), { target: { value: 'Quito' } });
        fireEvent.change(screen.getByLabelText(/Dirección/i), { target: { value: 'Av' } });

        fireEvent.click(screen.getByRole('button', { name: 'Crear' }));

        await waitFor(() => {
            expect(screen.getByText('Error de servidor')).toBeInTheDocument();
        });
    });
});
