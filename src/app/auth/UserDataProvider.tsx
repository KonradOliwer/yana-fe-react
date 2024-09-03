import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login, LoginRequest, logout, whoAmI } from './api';
import { rememberTokenExpiration } from './apiAuthConfig';

type AuthOperationResult = 'success' | 'failure';
type AuthStatus = 'loading' | 'signed in' | 'signed out';

interface UserDetails {
  username: string;
}

interface UserStatus {
  authStatus: AuthStatus;
  userDetails: UserDetails | null;
}

interface AuthContextDetails {
  userStatus: UserStatus;
  signIn: (loginRequest: LoginRequest) => Promise<AuthOperationResult>;
  signOut: () => Promise<AuthOperationResult>;
}

function useUserStatus() {
  const [userStatus, setUserStatus] = useState<UserStatus>({
    authStatus: 'loading',
    userDetails: null,
  });

  const refreshUserStatus = useCallback(async () => {
    try {
      const user = await whoAmI();
      setUserStatus({ authStatus: 'signed in', userDetails: user });
    } catch {
      setUserStatus({ authStatus: 'signed out', userDetails: null });
    }
  }, []);

  return { userStatus, refreshUserStatus };
}

const AuthContext = React.createContext<AuthContextDetails>({} as AuthContextDetails);

const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const { userStatus, refreshUserStatus } = useUserStatus();

  useEffect(() => {
    refreshUserStatus().then();
  }, [refreshUserStatus]);

  const signIn = useCallback(
    async (loginRequest: LoginRequest): Promise<AuthOperationResult> => {
      try {
        let response = await login(loginRequest);
        rememberTokenExpiration(response.token_expire_at);
        refreshUserStatus().then();
        return 'success';
      } catch (e) {
        return 'failure';
      }
    },
    [refreshUserStatus],
  );

  const signOut = useCallback(async (): Promise<AuthOperationResult> => {
    try {
      await logout();
      refreshUserStatus().then();
      return 'success';
    } catch (e) {
      return 'failure';
    }
  }, [refreshUserStatus]);

  const authContextValue = useMemo(() => {
    return { userStatus, signIn, signOut };
  }, [userStatus, signIn, signOut]);

  if (userStatus.authStatus === 'loading') {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

const AuthIsSignedIn = ({ children }: { children?: React.ReactNode }) => {
  const { userStatus } = useContext(AuthContext);
  return <>{userStatus.authStatus === 'signed in' ? children : null}</>;
};

const AuthIsSignedOut = ({ children }: { children?: React.ReactNode }) => {
  const { userStatus } = useContext(AuthContext);
  return <>{userStatus.authStatus === 'signed out' ? children : null}</>;
};

export { AuthProvider, AuthContext, AuthIsSignedIn, AuthIsSignedOut };
export type { AuthContextDetails, UserDetails, AuthOperationResult, AuthStatus };