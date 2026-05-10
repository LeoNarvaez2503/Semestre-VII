import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatRoom from './ChatRoom';
import * as api from '../services/api';
import * as websocket from '../services/websocket';

vi.mock('../services/api', () => ({
  getRoomInfo: vi.fn(),
  uploadFile: vi.fn(),
}));

vi.mock('../services/websocket', () => ({
  connect: vi.fn(),
  subscribeToRoom: vi.fn(),
  sendMessage: vi.fn(),
  disconnect: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('ChatRoom', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.setItem('nickname', 'TestUser');
    localStorage.setItem('roomType', 'TEXTO');
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('redirects if no nickname', () => {
    localStorage.removeItem('nickname');
    render(
      <MemoryRouter initialEntries={['/room/1234']}>
        <Routes>
          <Route path="/room/:roomId" element={<ChatRoom />} />
        </Routes>
      </MemoryRouter>
    );
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders chat room and connects to websocket', async () => {
    api.getRoomInfo.mockResolvedValueOnce({ users: ['TestUser'], files: [] });
    websocket.connect.mockResolvedValueOnce();
    websocket.subscribeToRoom.mockReturnValueOnce({ unsubscribe: vi.fn() });

    render(
      <MemoryRouter initialEntries={['/room/1234']}>
        <Routes>
          <Route path="/room/:roomId" element={<ChatRoom />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/#1234/i)).toBeInTheDocument();
    expect(await screen.findAllByText(/Conectado/i)).toHaveLength(2);
    expect(websocket.connect).toHaveBeenCalled();
  });

  it('sends a message', async () => {
    api.getRoomInfo.mockResolvedValue({ users: ['TestUser'], files: [] });
    websocket.connect.mockResolvedValueOnce();
    websocket.subscribeToRoom.mockReturnValueOnce({ unsubscribe: vi.fn() });

    render(
      <MemoryRouter initialEntries={['/room/1234']}>
        <Routes>
          <Route path="/room/:roomId" element={<ChatRoom />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findAllByText(/Conectado/i);
    
    const input = screen.getByPlaceholderText(/Escribe un mensaje/i);
    fireEvent.change(input, { target: { value: 'Hola Mundo' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar/i }));
    
    expect(websocket.sendMessage).toHaveBeenCalledWith('1234', 'TestUser', 'Hola Mundo');
  });

  it('handles disconnect and leave', async () => {
    api.getRoomInfo.mockResolvedValue({ users: ['TestUser'], files: [] });
    websocket.connect.mockResolvedValueOnce();
    websocket.subscribeToRoom.mockReturnValueOnce({ unsubscribe: vi.fn() });

    render(
      <MemoryRouter initialEntries={['/room/1234']}>
        <Routes>
          <Route path="/room/:roomId" element={<ChatRoom />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findAllByText(/Conectado/i);
    fireEvent.click(screen.getByRole('button', { name: /Salir/i }));
    
    expect(websocket.disconnect).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  it('handles file upload in MULTIMEDIA room', async () => {
    localStorage.setItem('roomType', 'MULTIMEDIA');
    api.getRoomInfo.mockResolvedValue({ users: ['TestUser'], files: [] });
    api.uploadFile.mockResolvedValueOnce({ url: 'test.png' });
    websocket.connect.mockResolvedValueOnce();
    websocket.subscribeToRoom.mockReturnValueOnce({ unsubscribe: vi.fn() });

    render(
      <MemoryRouter initialEntries={['/room/1234']}>
        <Routes>
          <Route path="/room/:roomId" element={<ChatRoom />} />
        </Routes>
      </MemoryRouter>
    );

    await screen.findAllByText(/Conectado/i);
    
    // Find file input and upload
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Elegir archivo/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    const uploadBtn = await screen.findByRole('button', { name: /Subir/i });
    fireEvent.click(uploadBtn);
    
    expect(api.uploadFile).toHaveBeenCalledWith('1234', 'TestUser', file);
  });
});
