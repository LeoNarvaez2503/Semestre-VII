import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminDashboard from './AdminDashboard';
import * as api from '../services/api';

vi.mock('../services/api', () => ({
  adminStatus: vi.fn(),
  adminLogout: vi.fn(),
  createRoom: vi.fn(),
  getAdminRooms: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('redirects to /admin if not logged in', async () => {
    api.adminStatus.mockResolvedValueOnce({ logged: false });
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  it('renders dashboard when logged in and fetches rooms', async () => {
    api.adminStatus.mockResolvedValueOnce({ logged: true });
    api.getAdminRooms.mockResolvedValueOnce([{ id: '1234', type: 'TEXTO' }]);
    
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
    
    expect(await screen.findByText(/Panel de Admin/i)).toBeInTheDocument();
    expect(screen.getByText('#1234')).toBeInTheDocument();
  });

  it('creates a new room', async () => {
    api.adminStatus.mockResolvedValueOnce({ logged: true });
    api.getAdminRooms.mockResolvedValueOnce([]);
    api.createRoom.mockResolvedValueOnce({ roomId: '9999', type: 'TEXTO' });
    
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
    expect(await screen.findByText(/Panel de Admin/i)).toBeInTheDocument();
    
    fireEvent.change(screen.getByLabelText(/PIN de la sala/i), { target: { value: '1111' } });
    fireEvent.click(screen.getByRole('button', { name: /Crear sala/i }));
    
    expect(await screen.findByText(/Sala creada: 9999/i)).toBeInTheDocument();
  });

  it('handles logout', async () => {
    api.adminStatus.mockResolvedValueOnce({ logged: true });
    api.getAdminRooms.mockResolvedValueOnce([]);
    api.adminLogout.mockResolvedValueOnce({});
    
    render(<MemoryRouter><AdminDashboard /></MemoryRouter>);
    expect(await screen.findByText(/Panel de Admin/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole('button', { name: /Cerrar sesión/i }));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });
});
