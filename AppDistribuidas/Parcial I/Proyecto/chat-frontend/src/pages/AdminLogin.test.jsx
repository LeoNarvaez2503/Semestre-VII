import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import AdminLogin from './AdminLogin';
import * as api from '../services/api';

vi.mock('../services/api', () => ({
  adminLogin: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('AdminLogin', () => {
  it('renders correctly', () => {
    render(<MemoryRouter><AdminLogin /></MemoryRouter>);
    expect(screen.getByLabelText(/Usuario/i)).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    api.adminLogin.mockResolvedValueOnce({});
    render(<MemoryRouter><AdminLogin /></MemoryRouter>);
    
    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  it('shows error on failed login', async () => {
    api.adminLogin.mockRejectedValueOnce(new Error('Credenciales inválidas'));
    render(<MemoryRouter><AdminLogin /></MemoryRouter>);
    
    fireEvent.change(screen.getByLabelText(/Usuario/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /Iniciar sesión/i }));
    
    expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
  });
});
