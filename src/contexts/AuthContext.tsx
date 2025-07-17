import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  templeName?: string;
  templeAddress?: string;
  templePhone?: string;
  templeEmail?: string;
  role: 'admin' | 'moderator' | 'user';
  isMedium: boolean;
  mediumId?: string;
  avatar?: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  createdAt?: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  updateUser: (userData: Partial<User>) => void;
  updateUserProfile: (userData: Partial<User>) => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAdmin: () => boolean;
  canEdit: (resource: string) => boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for master admin credentials
    if (email === 'admin@gestaoaruanda.com.br' && password === '123@mudar') {
      const mockUser: User = {
        id: '1',
        name: 'Administrador Master',
        email: 'admin@gestaoaruanda.com.br',
        phone: '(11) 99999-9999',
        address: 'Rua dos Orixás, 123',
        neighborhood: 'Centro Espírita',
        city: 'São Paulo',
        state: 'SP',
        country: 'Brasil',
        zipCode: '01234-567',
        role: 'admin',
        isMedium: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Save user to users list
      localStorage.setItem('users', JSON.stringify([mockUser]));
      setLoading(false);
      return;
    }
    
    // Check if user exists in localStorage (simulating database)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = existingUsers.find((u: any) => u.email === email);
    
    if (!foundUser) {
      alert('Usuário não encontrado ou senha incorreta!');
      setLoading(false);
      return;
    }
    
    if (foundUser) {
    } else {
      // Update last login
      const updatedUser = { ...foundUser, lastLogin: new Date().toISOString() };
      const updatedUsers = existingUsers.map((u: any) => u.id === foundUser.id ? updatedUser : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    }
    
    setLoading(false);
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (existingUsers.find((u: any) => u.email === userData.email)) {
      alert('Este email já está cadastrado!');
      setLoading(false);
      return;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      neighborhood: userData.neighborhood,
      city: userData.city,
      state: userData.state,
      country: userData.country,
      zipCode: userData.zipCode,
      role: 'user', // New users start as regular users
      isMedium: false,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    // Save to users list
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Auto login the new user
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    setLoading(false);
    alert('Conta criada com sucesso!');
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.find((u: any) => u.email === email);
    
    if (userExists) {
      alert('Link de recuperação enviado para seu email!');
    } else {
      alert('Email não encontrado!');
    }
    
    setLoading(false);
  };
  const changePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would verify the current password
    // For now, we'll just simulate success
    alert('Senha alterada com sucesso!');
    setLoading(false);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in users list if it's the current user
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = existingUsers.map((u: any) => u.id === user.id ? updatedUser : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUserProfile = (userData: Partial<User>) => {
    // Only allow users to update their own profile data
    if (user) {
      const allowedFields = ['name', 'email', 'phone', 'address', 'neighborhood', 'city', 'state', 'country', 'zipCode'];
      const filteredData = Object.keys(userData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = userData[key as keyof User];
          return obj;
        }, {});
      
      updateUser(filteredData);
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const canEdit = (resource: string) => {
    if (!user) return false;
    
    // Admins can edit everything
    if (user.role === 'admin') return true;
    
    // Regular users can only edit their own profile
    if (resource === 'profile') return true;
    
    return false;
  };
  return (
    <AuthContext.Provider value={{ 
      user, 
      updateUser, 
      updateUserProfile,
      login, 
      register, 
      resetPassword, 
      changePassword,
      logout, 
      loading,
      isAdmin,
      canEdit
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};