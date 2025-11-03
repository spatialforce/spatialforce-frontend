import React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
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
  login: (userData: User, token: string) => Promise<void>;
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
    setInactivityTimer(setTimeout(() => {
      if (user) logout();
    }, 3600000)); // 1 hour inactivity timeout
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
        const token = Cookies.get('auth_token');
        
        setUser(sessionUser);
        setCurrentToken(token || null);
        
        // Update accounts if not already present
        setAccounts(prev => {
          const exists = prev.some(acc => acc.email === sessionUser.email);
          return exists ? prev : [...prev, sessionUser];
        });
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
      const { data } = await axios.get(`${API_BASE_URL}auth/session`);
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
  
  const login = async (userData: User, token: string) => {
    try {
      setLoading(true);
      
      // Update accounts list
      setAccounts(prev => {
        const updatedAccounts = prev.filter(acc => acc.email !== userData.email);
        const newAccounts = [...updatedAccounts, userData];
        localStorage.setItem('accounts', JSON.stringify(newAccounts));
        return newAccounts;
      });
  
      // Update cookie settings - critical changes here
      // In login function
Cookies.set('auth_token', token, {
  secure: true, // Always true in production
  sameSite: 'strict',
  path: '/',
  domain: '.spatialforce.co.zw', // Use your actual domain
  httpOnly: true, // Must be set by server
  expires: new Date(Date.now() + 86400000) // 1 day
});
  
      // Update state
      setUser(userData);
      setCurrentToken(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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

      // Clear auth state
      Cookies.remove('auth_token');
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
  


  const addAccount = (userData: User, token: string) => {
    setAccounts(prev => {
      const newAccounts = [...prev, userData];
      localStorage.setItem('accounts', JSON.stringify(newAccounts));
      return newAccounts;
    });

    Cookies.set(`auth_token_${userData.email}`, token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: 7
    });
  };

  const removeAccount = (email: string) => {
    setAccounts(prev => {
      const newAccounts = prev.filter(acc => acc.email !== email);
      localStorage.setItem('accounts', JSON.stringify(newAccounts));
      return newAccounts;
    });
    Cookies.remove(`auth_token_${email}`);
  };

// In AuthContext.tsx - Enhanced switchAccount function
const switchAccount = async (email: string) => {
  try {
    setLoading(true);
    console.log('Attempting to switch to account:', email);
    
    const token = Cookies.get(`auth_token_${email}`);
    console.log('Stored token for account:', token ? 'exists' : 'missing');

    if (!token) {
      throw new Error('No session found for this account');
    }

    // Verify token with backend
    console.log('Verifying token with backend...');
    const verificationResponse = await axios.get(`${API_BASE_URL}/auth/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { _: Date.now() } // Cache busting
    });
    console.log('Verification response:', verificationResponse.data);

    if (verificationResponse.data.valid) {
      console.log('Token valid. Updating session...');
      
      // Set the new active token
      Cookies.set('auth_token', token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: 7,
        domain: window.location.hostname,
        path: '/'
      });

      // Force headers update
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Axios headers updated with new token');

      // Refresh session data
      console.log('Refreshing session data...');
      const sessionResponse = await axios.get(`${API_BASE_URL}/auth/session`, {
        withCredentials: true,
        params: { _: Date.now() } // Cache busting
      });
      console.log('Session response:', sessionResponse.data);

      if (sessionResponse.data.authenticated) {
        console.log('Session updated successfully');
        const newUser = sessionResponse.data.user;
        setUser(newUser);
        setCurrentToken(token);
        
        // Update accounts list
        setAccounts(prev => {
          const exists = prev.some(acc => acc.email === newUser.email);
          return exists ? prev : [...prev, newUser];
        });
      } else {
        throw new Error('Session refresh failed');
      }
    } else {
      throw new Error('Invalid session token');
    }
  } catch (error) {
    console.error('Account switch error:', error);
    setError(`Switch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    // Don't remove account on error - just log
  } finally {
    setLoading(false);
    console.log('Account switch process completed');
  }
};



  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const newToken = response.data.token;
        setCurrentToken(newToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Refresh token failed:', error);
      logout(); // Optional: force logout if refresh fails
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

