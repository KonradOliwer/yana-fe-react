import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginPage from './LoginPage';
import { AuthContext, AuthContextDetails } from './UserDataProvider';

describe('LoginPage', () => {
  test('renders LoginPage and performs login', async () => {
    const mockSignIn = jest.fn().mockResolvedValue('success');
    const authContextValue: AuthContextDetails = {
      signIn: mockSignIn,
      userStatus: { authStatus: 'loading', userDetails: null },
      signOut: jest.fn(),
    };

    render(
      <AuthContext.Provider value={authContextValue}>
        <LoginPage />
      </AuthContext.Provider>,
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/your username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.submit(screen.getByRole('form'));

    // Verify signIn function is called with correct arguments
    expect(mockSignIn).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
  });
});