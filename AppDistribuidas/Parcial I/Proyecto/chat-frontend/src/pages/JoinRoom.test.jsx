import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import JoinRoom from './JoinRoom';
import * as api from '../services/api';

vi.mock('../services/api', () => ({
  joinRoom: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('JoinRoom', () => {
  it('renders correctly', () => {
    render(<MemoryRouter><JoinRoom /></MemoryRouter>);
    expect(screen.getByText(/Chat Seguro/i)).toBeInTheDocument();
  });

  it('handles submit successfully', async () => {
    api.joinRoom.mockResolvedValueOnce({
      deviceId: 'dev1', nickname: 'user1', roomId: '1234', type: 'TEXTO'
    });
    
    render(<MemoryRouter><JoinRoom /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/PIN de la sala/i), { target: { value: '1234' } });
    fireEvent.change(screen.getByLabelText(/Nickname/i), { target: { value: 'user1' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Unirse a la sala/i }));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/room/1234');
    });
  });

  it('shows error on failure', async () => {
    api.joinRoom.mockRejectedValueOnce(new Error('Sala no encontrada'));
    render(<MemoryRouter><JoinRoom /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/PIN de la sala/i), { target: { value: '1234' } });
    fireEvent.change(screen.getByLabelText(/Nickname/i), { target: { value: 'user1' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Unirse a la sala/i }));
    
    expect(await screen.findByText('Sala no encontrada')).toBeInTheDocument();
  });
});
