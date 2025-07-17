import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Medium {
  id: string;
  name: string;
  email?: string;
  birthDate: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  status: 'active' | 'inactive';
  category: 'passista' | 'development' | 'cambone' | 'priest' | 'oga' | 'consulente';
  joinDate: string;
  exitDate?: string;
  canAdminister: boolean;
  hasSystemAccess?: boolean;
}

interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category: string;
  supplierId?: string;
}

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'gira' | 'meeting' | 'ceremony' | 'event' | 'lecture' | 'festivity' | 'external';
  participants: string[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string;
  read: boolean;
  targetUsers: string[];
}

interface DataContextType {
  mediums: Medium[];
  addMedium: (medium: Omit<Medium, 'id'>) => void;
  updateMedium: (id: string, medium: Partial<Medium>) => void;
  deleteMedium: (id: string) => void;
  
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  financialRecords: FinancialRecord[];
  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>) => void;
  updateFinancialRecord: (id: string, record: Partial<FinancialRecord>) => void;
  deleteFinancialRecord: (id: string) => void;
  
  events: Event[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [mediums, setMediums] = useState<Medium[]>([
    {
      id: '1',
      name: 'Maria das Graças',
      address: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      zipCode: '01234-567',
      phone: '(11) 99999-9999',
      status: 'active',
      category: 'priest',
      joinDate: '2020-01-15',
      canAdminister: true
    },
    {
      id: '2',
      name: 'João Carlos',
      address: 'Avenida Central, 456',
      neighborhood: 'Vila Nova',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      zipCode: '01234-890',
      phone: '(11) 88888-8888',
      status: 'active',
      category: 'oga',
      joinDate: '2021-03-20',
      canAdminister: false
    }
  ]);

  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([
    {
      id: '1',
      type: 'income',
      amount: 500.00,
      description: 'Doação para manutenção do templo',
      date: '2024-01-15',
      category: 'Doações'
    },
    {
      id: '2',
      type: 'expense',
      amount: 150.00,
      description: 'Compra de velas e incensos',
      date: '2024-01-10',
      category: 'Materiais'
    }
  ]);

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Gira de Exú',
      description: 'Gira tradicional com consultas e passes',
      date: '2024-01-20',
      time: '19:00',
      type: 'gira',
      participants: ['1', '2']
    },
    {
      id: '2',
      title: 'Reunião de Estudo',
      description: 'Estudo sobre os fundamentos da Umbanda',
      date: '2024-01-25',
      time: '18:00',
      type: 'meeting',
      participants: ['1']
    },
    {
      id: '3',
      title: 'Palestra sobre Orixás',
      description: 'Palestra educativa sobre os Orixás na Umbanda',
      date: '2024-02-01',
      time: '20:00',
      type: 'lecture',
      participants: ['1', '2']
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nova Gira Agendada',
      message: 'Gira de Exú foi agendada para 20/01/2024 às 19:00',
      type: 'info',
      date: '2024-01-15T10:00:00',
      read: false,
      targetUsers: ['all']
    },
    {
      id: '2',
      title: 'Lembrete de Reunião',
      message: 'Reunião de estudo amanhã às 18:00',
      type: 'warning',
      date: '2024-01-24T15:00:00',
      read: true,
      targetUsers: ['1']
    }
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Casa de Artigos Religiosos São Jorge',
      email: 'contato@casasaojorge.com.br',
      phone: '(11) 3333-4444',
      address: 'Rua das Ervas, 789',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      category: 'Artigos Religiosos',
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Distribuidora de Velas Luz Divina',
      email: 'vendas@luzdivina.com.br',
      phone: '(11) 5555-6666',
      address: 'Avenida da Fé, 456',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-890',
      category: 'Velas e Incensos',
      status: 'active',
      createdAt: '2024-01-05'
    }
  ]);
  const addMedium = (medium: Omit<Medium, 'id'>) => {
    const newMedium = { ...medium, id: Date.now().toString() };
    setMediums(prev => [...prev, newMedium]);
  };

  const updateMedium = (id: string, medium: Partial<Medium>) => {
    setMediums(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, ...medium };
        // Se o status mudou para inativo e não há data de saída, adicionar
        if (updated.status === 'inactive' && !updated.exitDate && m.status === 'active') {
          updated.exitDate = new Date().toISOString().split('T')[0];
        }
        // Se o status mudou para ativo, remover data de saída
        if (updated.status === 'active' && m.status === 'inactive') {
          updated.exitDate = undefined;
        }
        return updated;
      }
      return m;
    }));
  };

  const deleteMedium = (id: string) => {
    setMediums(prev => prev.filter(m => m.id !== id));
  };

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier = { 
      ...supplier, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSuppliers(prev => [...prev, newSupplier]);
  };

  const updateSupplier = (id: string, supplier: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...supplier } : s));
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };
  const addFinancialRecord = (record: Omit<FinancialRecord, 'id'>) => {
    const newRecord = { ...record, id: Date.now().toString() };
    setFinancialRecords(prev => [...prev, newRecord]);
  };

  const updateFinancialRecord = (id: string, record: Partial<FinancialRecord>) => {
    setFinancialRecords(prev => prev.map(r => r.id === id ? { ...r, ...record } : r));
  };

  const deleteFinancialRecord = (id: string) => {
    setFinancialRecords(prev => prev.filter(r => r.id !== id));
  };

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = { ...event, id: Date.now().toString() };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, event: Partial<Event>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...event } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification = { 
      ...notification, 
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <DataContext.Provider value={{
      mediums,
      addMedium,
      updateMedium,
      deleteMedium,
      suppliers,
      addSupplier,
      updateSupplier,
      deleteSupplier,
      financialRecords,
      addFinancialRecord,
      updateFinancialRecord,
      deleteFinancialRecord,
      events,
      addEvent,
      updateEvent,
      deleteEvent,
      notifications,
      addNotification,
      markNotificationAsRead,
      deleteNotification
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};