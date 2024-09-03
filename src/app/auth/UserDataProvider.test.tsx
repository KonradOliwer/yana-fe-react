import React, { useContext } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AuthContext, AuthProvider } from './UserDataProvider';
import { login, logout, whoAmI } from './api';
import axios from 'axios';

jest.mock('./api');
jest.mock('./apiAuthConfig');

const AuthContextPrintTestComponent = () => {
  const { userStatus } = useContext(AuthContext);
  return (
    <>
      <div data-testid="authStatus">{userStatus.authStatus}</div>;
      {userStatus.userDetails ? (
        <div data-testid="userDetails.username">{userStatus.userDetails.username}</div>
      ) : (
        ''
      )}
    </>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should render children', async () => {
    render(
      <AuthProvider>
        <div>Test</div>
      </AuthProvider>,
    );

    const testText = await screen.findByText('Test');
    expect(testText).toBeInTheDocument();
  });

  test('should start not logged in when whomAmI fails', async () => {
    jest
      .mocked(whoAmI)
      .mockRejectedValue(new axios.AxiosError('Request failed', 'ERR_BAD_REQUEST'));

    render(
      <AuthProvider>
        <AuthContextPrintTestComponent />
      </AuthProvider>,
    );

    let authStatus = await screen.findByTestId('authStatus');
    await waitFor(() => expect(authStatus).toHaveTextContent('signed out'));
    const username = screen.queryByTestId('userDetails.username');
    expect(username).toBeNull();
  });

  test('should start logged in when whoAmI returns user', async () => {
    jest.mocked(whoAmI).mockReturnValue(Promise.resolve({ username: 'testuser' }));

    render(
      <AuthProvider>
        <AuthContextPrintTestComponent />
      </AuthProvider>,
    );

    let authStatus = await screen.findByTestId('authStatus');
    await waitFor(() => expect(authStatus).toHaveTextContent('signed in'));
    const username = screen.queryByTestId('userDetails.username');
    expect(username).toHaveTextContent('testuser');
  });

  test('allows for signing in user after initial rendering', async () => {
    // given
    const LoginTestComponent = () => {
      const { signIn } = useContext(AuthContext);
      const performLogin = async () => {
        await signIn({ username: 'testuser', password: 'testpassword' });
      };
      return <button onClick={performLogin}>Login</button>;
    };
    jest
      .mocked(whoAmI)
      .mockRejectedValue(new axios.AxiosError('Request failed', 'ERR_BAD_REQUEST'));

    render(
      <AuthProvider>
        <LoginTestComponent />
        <AuthContextPrintTestComponent />
      </AuthProvider>,
    );
    let authStatus = await screen.findByTestId('authStatus');
    await waitFor(() => expect(authStatus).toHaveTextContent('signed out'));

    jest.mocked(login).mockResolvedValue({ token_expire_at: Number.MAX_SAFE_INTEGER });
    jest.mocked(whoAmI).mockReturnValue(Promise.resolve({ username: 'whoAmI user' }));

    //when
    screen.getByRole('button').click();

    //then
    await waitFor(() => expect(authStatus).toHaveTextContent('signed in'));
    const username = screen.queryByTestId('userDetails.username');
    expect(username).toHaveTextContent('whoAmI user');
  });

  test('allows for signing out user after initial rendering', async () => {
    //given
    const LoginTestComponent = () => {
      const { signOut } = useContext(AuthContext);
      const performLogout = async () => {
        await signOut();
      };
      return <button onClick={performLogout}>Login</button>;
    };
    jest.mocked(whoAmI).mockReturnValue(Promise.resolve({ username: 'whoAmI user' }));

    render(
      <AuthProvider>
        <LoginTestComponent />
        <AuthContextPrintTestComponent />
      </AuthProvider>,
    );
    let authStatus = await screen.findByTestId('authStatus');
    jest
      .mocked(whoAmI)
      .mockRejectedValue(new axios.AxiosError('Request failed', 'ERR_BAD_REQUEST'));

    jest.mocked(logout).mockResolvedValue();

    //when
    screen.getByRole('button').click();

    //then
    await waitFor(() => expect(authStatus).toHaveTextContent('signed out'));
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
