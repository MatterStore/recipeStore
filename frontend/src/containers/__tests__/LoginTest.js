import Login from '../Login';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContextProvider } from '../../contexts/AuthContext';

describe('Login tests', () => {
  it('should show expected elements', () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <Login />
        </AuthContextProvider>
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Enter Email')).toBeDefined();
    expect(screen.getByPlaceholderText('Enter Password')).toBeDefined();
  });
});
