import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, defaultUser } from '@/services/mockData';

interface AuthContextType {
  user: User;
  role: 'donor' | 'ngo';
  switchRole: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'foodshare_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultUser;
      }
    }
    return defaultUser;
  });

  const [role, setRole] = useState<'donor' | 'ngo'>(user.role);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const switchRole = () => {
    const newRole = role === 'donor' ? 'ngo' : 'donor';
    setRole(newRole);
    setUser(prev => ({ ...prev, role: newRole }));
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, role, switchRole, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
