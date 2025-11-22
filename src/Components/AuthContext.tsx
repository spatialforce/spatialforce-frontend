import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  token: string | null; 
  authProvider?: 'google' | 'github' | 'email';
}

interface AuthContextType {
  user: User | null;
  accounts: User[];
  isAuthenticated: boolean;
  login: (userData: User, token?: string | null) => Promise<void>;
  logout: () => Promise<void>;
  addAccount: (userData: User, token: string) => void;
  removeAccount: (email: string) => void;
  switchAccount: (email: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  checkSession: () => Promise<void>;
  token: string | null;
  refreshToken: () => Promise<boolean>; 
  getCSRFToken: () => Promise<string>;
}

const getCSRFToken = async (): Promise<string> => {
  const response = await axios.get(`${API_BASE_URL}/csrf-token`, {
    withCredentials: true
  });
  return response.data.csrfToken;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentToken, setCurrentToken] = useState<string | null>(null);

// Add session timeout handling
const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout>();

useEffect(() => {
  const resetTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    const timer = setTimeout(() => {
      if (user) logout();
    }, 3600000);
    setInactivityTimer(timer);
  };
  

  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('keypress', resetTimer);
  
  return () => {
    window.removeEventListener('mousemove', resetTimer);
    window.removeEventListener('keypress', resetTimer);
    if (inactivityTimer) clearTimeout(inactivityTimer);
  };
}, [user]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const storedAccounts = localStorage.getItem('accounts');
        if (storedAccounts) {
          setAccounts(JSON.parse(storedAccounts));
        }
        await checkSession();
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

 

  const checkSession = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/session`, {
        withCredentials: true
      });

      if (response.data.authenticated) {
        const sessionUser = response.data.user;
      
        setUser(sessionUser);
      } else {
        setUser(null);
        setCurrentToken(null);
      }
      
    } catch (error) {
      console.error('Session check error:', error);
      setError('Session verification failed');
    }
  };
  // Listen for storage events across tabs
useEffect(() => {
  const handleStorage = async (event: StorageEvent) => {
    if (event.key === 'sessionSync') {
      const { data } = await axios.get(`${API_BASE_URL}/auth/session`);
      setUser(data.authenticated ? data.user : null);
    }
  };

  window.addEventListener('storage', handleStorage);
  return () => window.removeEventListener('storage', handleStorage);
}, []);

// Broadcast session changes
const syncSession = () => {
  localStorage.setItem('sessionSync', Date.now().toString());
};
  
const login = async (userData: User, token?: string | null) => {
  try {
    setLoading(true);

    setAccounts(prev => {
      const updatedAccounts = prev.filter(acc => acc.email !== userData.email);
      const newAccounts = [...updatedAccounts, userData];
      localStorage.setItem('accounts', JSON.stringify(newAccounts));
      return newAccounts;
    });

    setUser(userData);
    setCurrentToken(token || null); // purely for UI if you need it
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Login failed');
    throw err;
  } finally {
    setLoading(false);
  }
};



  
const logout = async () => {
  try {
    setLoading(true);
    await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
      withCredentials: true
    });
    setUser(null);
    setCurrentToken(null);
    delete axios.defaults.headers.common['Authorization'];
  } catch (err) {
    console.error('Logout error:', err);
    setError('Logout failed');
  } finally {
    setLoading(false);
  }
};

  
  const addAccount = (userData: User) => {
    setAccounts(prev => {
      const updated = prev.filter(acc => acc.email !== userData.email);
      const newAccounts = [...updated, userData];
      localStorage.setItem('accounts', JSON.stringify(newAccounts));
      return newAccounts;
    });
  };
  
  const removeAccount = (email: string) => {
    setAccounts(prev => {
      const newAccounts = prev.filter(acc => acc.email !== email);
      localStorage.setItem('accounts', JSON.stringify(newAccounts));
      return newAccounts;
    });
  };
  
  // For now, just a stub – real “switch” needs a dedicated backend flow
  const switchAccount = async (email: string) => {
    setError('Account switching is not yet supported with cookie-only auth');
  };
  



const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );

    if (response.data.success) {
      // Server updated HttpOnly cookies; nothing to store on client
      return true;
    }
    return false;
  } catch (error) {
    console.error('Refresh token failed:', error);
    logout();
    return false;
  }
};


  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user,
      accounts,
      refreshToken,
      token: currentToken,
      isAuthenticated: !!user,
      login,
      logout,
      addAccount,
      removeAccount,
      switchAccount,
      loading,
      error,
      clearError,
      checkSession,
      getCSRFToken
     
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

