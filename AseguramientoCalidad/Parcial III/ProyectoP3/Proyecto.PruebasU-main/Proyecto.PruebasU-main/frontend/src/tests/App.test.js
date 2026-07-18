import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders login form', () => {
    render(<App />);
    const loginTitle = screen.getByText(/Login - Concesionaria/i);
    expect(loginTitle).toBeInTheDocument();
});
