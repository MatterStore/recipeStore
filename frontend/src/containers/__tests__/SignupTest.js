import Signup from '../Signup';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContextProvider } from '../../contexts/AuthContext';

describe('Signup tests', () => {
  it('should show expected elements', () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <Signup />
        </AuthContextProvider>
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Enter Name')).toBeDefined();
    expect(screen.getByPlaceholderText('Enter Email')).toBeDefined();
    expect(screen.getByPlaceholderText('Enter Password')).toBeDefined();
  });
});
