import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Temple {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  status: 'active' | 'inactive';
  subdomain?: string;
  createdAt: string;
}

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
  role: 'master_admin' | 'temple_admin' | 'user';
  templeId?: string;
  templeName?: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  temples: Temple[];
  selectedTemple: Temple | null;
  updateUser: (userData: Partial<User>) => void;
  updateUserProfile: (userData: Partial<User>) => void;
  login: (email: string, password: string, templeId?: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isMasterAdmin: () => boolean;
  isTempleAdmin: () => boolean;
  isAdmin: () => boolean;
  canEdit: (resource: string) => boolean;
  // Temple management (master admin only)
  addTemple: (temple: Omit<Temple, 'id' | 'createdAt'>) => Promise<void>;
  updateTemple: (id: string, temple: Partial<Temple>) => Promise<void>;
  deleteTemple: (id: string) => Promise<void>;
  // User management
  addTempleAdmin: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateTempleAdmin: (id: string, userData: Partial<User>) => Promise<void>;
  deleteTempleAdmin: (id: string) => Promise<void>;
  promoteToAdmin: (userId: string) => Promise<void>;
  demoteFromAdmin: (userId: string) => Promise<void>;
  getTempleUsers: () => User[];
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
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
  templeId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load temples
    const savedTemples = localStorage.getItem('temples');
    if (savedTemples) {
      const templesData = JSON.parse(savedTemples);
      setTemples(templesData);
    } else {
      // Create default temple for demo
      const defaultTemple: Temple = {
        id: '1',
        name: 'Templo Aruanda Demo',
        address: 'Rua dos Orixás, 123',
        phone: '(11) 99999-9999',
        email: 'contato@temploareuanda.com.br',
        status: 'active',
        subdomain: 'demo',
        createdAt: new Date().toISOString()
      };
      setTemples([defaultTemple]);
      localStorage.setItem('temples', JSON.stringify([defaultTemple]));
    }

    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      
      // Set selected temple
      const userTemple = temples.find(t => t.id === userData.templeId);
      if (userTemple) {
        setSelectedTemple(userTemple);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, templeId?: string, rememberMe: boolean = false) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for master admin credentials
    if (email === 'admin@gestaoaruanda.com.br' && password === '123@mudar') {
      const masterUser: User = {
        id: 'master-1',
        name: 'Administrador Master',
        email: 'admin@gestaoaruanda.com.br',
        role: 'master_admin',
        active: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      setUser(masterUser);
      localStorage.setItem('user', JSON.stringify(masterUser));
      setLoading(false);
      return;
    }
    
    // Check if temple is selected for regular users
    if (!templeId) {
      alert('Por favor, selecione um templo para fazer login.');
      setLoading(false);
      return;
    }
    
    // Find the temple
    const temple = temples.find(t => t.id === templeId);
    if (!temple) {
      alert('Templo não encontrado!');
      setLoading(false);
      return;
    }
    
    if (temple.status === 'inactive') {
      alert('Este templo está inativo. Entre em contato com o administrador.');
      setLoading(false);
      return;
    }
    
    // Check if user exists in localStorage (simulating database)
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = existingUsers.find((u: any) => u.email === email && u.templeId === templeId);
    
    if (!foundUser) {
      alert('Usuário não encontrado neste templo ou senha incorreta!');
      setLoading(false);
      return;
    }
    
    if (!foundUser.active) {
      alert('Sua conta ainda não foi aprovada pelo administrador do templo. Entre em contato para mais informações.');
      setLoading(false);
      return;
    }
    
    // Update last login
    const updatedUser = { 
      ...foundUser, 
      lastLogin: new Date().toISOString(),
      templeName: temple.name
    };
    const updatedUsers = existingUsers.map((u: any) => u.id === foundUser.id ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setUser(updatedUser);
    setSelectedTemple(temple);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    if (rememberMe) {
      localStorage.setItem('rememberMe', 'true');
    }
    
    setLoading(false);
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find the temple
    const temple = temples.find(t => t.id === userData.templeId);
    if (!temple) {
      alert('Templo não encontrado!');
      setLoading(false);
      return;
    }
    
    if (temple.status === 'inactive') {
      alert('Este templo está inativo. Entre em contato com o administrador.');
      setLoading(false);
      return;
    }
    
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
      role: 'user',
      templeId: userData.templeId,
      templeName: temple.name,
      active: false, // Usuários precisam ser aprovados pelo admin do templo
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    // Save to users list
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    setLoading(false);
    alert('Conta criada com sucesso! Aguarde a aprovação do administrador do templo para acessar o sistema.');
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Senha alterada com sucesso!');
    setLoading(false);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in users list if it's not master admin
      if (user.role !== 'master_admin') {
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = existingUsers.map((u: any) => u.id === user.id ? updatedUser : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
    }
  };

  const updateUserProfile = (userData: Partial<User>) => {
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

  const logout = () => {
    setUser(null);
    setSelectedTemple(null);
    localStorage.removeItem('user');
  };

  // Temple management functions (master admin only)
  const addTemple = async (templeData: Omit<Temple, 'id' | 'createdAt'>) => {
    if (!isMasterAdmin()) {
      throw new Error('Acesso negado');
    }
    
    const newTemple: Temple = {
      ...templeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    const updatedTemples = [...temples, newTemple];
    setTemples(updatedTemples);
    localStorage.setItem('temples', JSON.stringify(updatedTemples));
  };

  const updateTemple = async (id: string, templeData: Partial<Temple>) => {
    if (!isMasterAdmin()) {
      throw new Error('Acesso negado');
    }
    
    const updatedTemples = temples.map(t => t.id === id ? { ...t, ...templeData } : t);
    setTemples(updatedTemples);
    localStorage.setItem('temples', JSON.stringify(updatedTemples));
  };

  const deleteTemple = async (id: string) => {
    if (!isMasterAdmin()) {
      throw new Error('Acesso negado');
    }
    
    const updatedTemples = temples.filter(t => t.id !== id);
    setTemples(updatedTemples);
    localStorage.setItem('temples', JSON.stringify(updatedTemples));
    
    // Remove users from this temple
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = existingUsers.filter((u: any) => u.templeId !== id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const addTempleAdmin = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    if (!isMasterAdmin()) {
      throw new Error('Acesso negado');
    }
    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (existingUsers.find((u: any) => u.email === userData.email)) {
      throw new Error('Este email já está cadastrado!');
    }
    
    const temple = temples.find(t => t.id === userData.templeId);
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      templeName: temple?.name,
      createdAt: new Date().toISOString()
    };
    
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const updateTempleAdmin = async (id: string, userData: Partial<User>) => {
    if (!isMasterAdmin()) {
      throw new Error('Acesso negado');
    }
    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = existingUsers.map((u: any) => 
      u.id === id ? { ...u, ...userData } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const deleteTempleAdmin = async (id: string) => {
    if (!isMasterAdmin()) {
      throw new Error('Acesso negado');
    }
    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = existingUsers.filter((u: any) => u.id !== id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const promoteToAdmin = async (userId: string) => {
    if (!isAdmin()) {
      throw new Error('Acesso negado');
    }
    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = existingUsers.map((u: any) => 
      u.id === userId ? { ...u, role: 'temple_admin' } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const approveUser = async (userId: string) => {
    if (!isAdmin()) {
      throw new Error('Acesso negado');
    }
    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = existingUsers.map((u: any) => 
      u.id === userId ? { ...u, active: true } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const rejectUser = async (userId: string) => {
    if (!isAdmin()) {
      throw new Error('Acesso negado');
    }
    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = existingUsers.filter((u: any) => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };
  const demoteFromAdmin = async (userId: string) => {
    if (!isAdmin()) {
      throw new Error('Acesso negado');
    }
    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = existingUsers.map((u: any) => 
      u.id === userId ? { ...u, role: 'user' } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const getTempleUsers = () => {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (isMasterAdmin()) {
      return existingUsers;
    }
    return existingUsers.filter((u: any) => u.templeId === user?.templeId);
  };

  const isMasterAdmin = () => user?.role === 'master_admin';
  const isTempleAdmin = () => user?.role === 'temple_admin';
  const isAdmin = () => user?.role === 'master_admin' || user?.role === 'temple_admin';

  const canEdit = (resource: string) => {
    if (!user) return false;
    if (isMasterAdmin()) return true;
    if (isTempleAdmin() && resource !== 'temples') return true;
    if (resource === 'profile') return true;
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      temples,
      selectedTemple,
      updateUser, 
      updateUserProfile,
      login, 
      register, 
      resetPassword, 
      changePassword,
      logout, 
      loading,
      isMasterAdmin,
      isTempleAdmin,
      isAdmin,
      canEdit,
      addTemple,
      updateTemple,
      deleteTemple,
      addTempleAdmin,
      updateTempleAdmin,
      deleteTempleAdmin,
      promoteToAdmin,
      demoteFromAdmin,
      getTempleUsers,
      approveUser,
      rejectUser
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