import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders JoinRoom component for root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/Chat Seguro/i)).toBeInTheDocument();
  });

  it('renders AdminLogin for /admin route', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Admin/i })).toBeInTheDocument();
  });
});
