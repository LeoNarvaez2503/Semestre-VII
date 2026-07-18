import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AutosManager from '../components/AutosManager';
import * as autoService from '../services/autoService';

// Mock del servicio
jest.mock('../services/autoService');

describe('AutosManager Component', () => {
    const mockAutos = [
        {
            id: 1,
            marca: 'Toyota',
            modelo: 'Corolla',
            anio: 2023,
            color: 'Blanco',
            numeroSerie: 'ABC-123'
        },
        {
            id: 2,
            marca: 'Honda',
            modelo: 'Civic',
            anio: 2022,
            color: 'Negro',
            numeroSerie: 'XYZ-789'
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup default mocks
        autoService.obtenerTodosLosAutos.mockResolvedValue(mockAutos);
        autoService.crearAuto.mockResolvedValue({ ...mockAutos[0], id: 3 });
        autoService.actualizarAuto.mockResolvedValue({ ...mockAutos[0], marca: 'Toyota Updated' });
        autoService.eliminarAuto.mockResolvedValue({});

        // Mock window.confirm
        window.confirm = jest.fn(() => true);
        window.scrollTo = jest.fn();
    });

    test('debe renderizar el título y cargar la lista de autos', async () => {
        render(<AutosManager />);

        expect(screen.getByText('Crear Auto')).toBeInTheDocument();
        expect(screen.getByText('Cargando...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Listado de Autos')).toBeInTheDocument();
        expect(screen.getByText('ABC-123')).toBeInTheDocument();
        expect(screen.getByText('XYZ-789')).toBeInTheDocument();
    });

    test('debe crear un nuevo auto correctamente', async () => {
        render(<AutosManager />);

        await waitFor(() => expect(screen.queryByText('Cargando...')).not.toBeInTheDocument());

        // Llenar formulario
        fireEvent.change(screen.getByRole('combobox', { name: /Marca/i }), { target: { value: 'Toyota' } });
        fireEvent.change(screen.getByRole('combobox', { name: /Modelo/i }), { target: { value: 'Corolla' } });
        fireEvent.change(screen.getByLabelText(/Año/i), { target: { value: '2024' } });
        fireEvent.change(screen.getByRole('combobox', { name: /Color/i }), { target: { value: 'Rojo' } });
        fireEvent.change(screen.getByLabelText(/Número de Serie \/ Placa/i), { target: { value: 'NEW-001' } });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: 'Crear' }));

        await waitFor(() => {
            expect(autoService.crearAuto).toHaveBeenCalledWith(expect.objectContaining({
                marca: 'Toyota',
                modelo: 'Corolla',
                año: 2024,
                color: 'Rojo',
                numeroSerie: 'NEW-001'
            }));
        });

        // Debe recargar la lista
        expect(autoService.obtenerTodosLosAutos).toHaveBeenCalledTimes(2);
    });

    test('debe validar campos requeridos', async () => {
        render(<AutosManager />);
        await waitFor(() => expect(screen.queryByText('Cargando...')).not.toBeInTheDocument());

        // Intentar enviar vacío
        // Llenamos solo marca y año para probar validación de modelo
        fireEvent.change(screen.getByRole('combobox', { name: /Marca/i }), { target: { value: 'Toyota' } });
        fireEvent.change(screen.getByLabelText(/Año/i), { target: { value: '2024' } });
        // Modelo vacío

        fireEvent.click(screen.getByRole('button', { name: 'Crear' }));

        await waitFor(() => {
            expect(screen.getByText('Selecciona un modelo válido para la marca seleccionada')).toBeInTheDocument();
        });

        expect(autoService.crearAuto).not.toHaveBeenCalled();
    });

    test('debe cargar datos en el formulario al editar', async () => {
        render(<AutosManager />);
        await waitFor(() => expect(screen.queryByText('Cargando...')).not.toBeInTheDocument());

        const editBtns = screen.getAllByText('Editar');
        fireEvent.click(editBtns[0]); // Editar el primer auto (Toyota)

        await waitFor(() => {
            expect(screen.getByText('Editar Auto')).toBeInTheDocument();
        });

        // Verificar valores en inputs
        expect(screen.getByRole('combobox', { name: /Marca/i })).toHaveValue('Toyota');
        expect(screen.getByRole('combobox', { name: /Modelo/i })).toHaveValue('Corolla');
        expect(screen.getByLabelText(/Año/i)).toHaveValue(2023);
        expect(screen.getByLabelText(/Número de Serie \/ Placa/i)).toHaveValue('ABC-123');
    });

    test('debe actualizar un auto existente', async () => {
        render(<AutosManager />);
        await waitFor(() => expect(screen.queryByText('Cargando...')).not.toBeInTheDocument());

        // Click editar
        fireEvent.click(screen.getAllByText('Editar')[0]);

        // Cambiar año
        fireEvent.change(screen.getByLabelText(/Año/i), { target: { value: '2025' } });

        // Submit actualización
        fireEvent.click(screen.getByRole('button', { name: 'Actualizar' }));

        await waitFor(() => {
            expect(autoService.actualizarAuto).toHaveBeenCalledWith(1, expect.objectContaining({
                marca: 'Toyota',
                modelo: 'Corolla',
                año: 2025
            }));
        });

        expect(autoService.obtenerTodosLosAutos).toHaveBeenCalledTimes(2);
    });

    test('debe eliminar un auto', async () => {
        render(<AutosManager />);
        await waitFor(() => expect(screen.queryByText('Cargando...')).not.toBeInTheDocument());

        const deleteBtns = screen.getAllByText('Borrar');
        fireEvent.click(deleteBtns[0]);

        expect(window.confirm).toHaveBeenCalled();

        await waitFor(() => {
            expect(autoService.eliminarAuto).toHaveBeenCalledWith(1);
        });

        expect(autoService.obtenerTodosLosAutos).toHaveBeenCalledTimes(2);
    });

    test('debe manejar errores de carga', async () => {
        autoService.obtenerTodosLosAutos.mockRejectedValue(new Error('Error de conexión'));

        render(<AutosManager />);

        await waitFor(() => {
            expect(screen.getByText('Error de conexión')).toBeInTheDocument();
        });
    });
});
