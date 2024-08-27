import React, { createContext, useState, ReactNode } from 'react';


// Use for the useState
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
}

// use for the createContext
interface AuthContextType {
  authState: AuthState;
  login: (token: string, userId: string) => void;
  logout: () => void;
}


// Specify the AuthContext
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Use for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Returns the Auth Provider with its childrends
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  // Create the useState for the AuthState
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    userId: null,
  });

  // Does the login
  const login = (token: string, userId: string) => {
    setAuthState({
      isAuthenticated: true,
      token,
      userId,
    });
  };

  // Does the logout
  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      token: null,
      userId: null,
    });
  };

  // Returns the AuthContext.Provider with its value and functions
  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};