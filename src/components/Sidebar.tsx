import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Users, DollarSign, Calendar, Settings, Star, Bell, FileText, Building2 } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
}

const menuItems = [
  { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
  { id: 'mediums', icon: Users, label: 'Médiuns' },
  { id: 'suppliers', icon: Building2, label: 'Fornecedores' },
  { id: 'financial', icon: DollarSign, label: 'Financeiro' },
  { id: 'events', icon: Calendar, label: 'Eventos' },
  { id: 'notifications', icon: Bell, label: 'Notificações' },
  { id: 'reports', icon: FileText, label: 'Relatórios' },
  { id: 'settings', icon: Settings, label: 'Configurações' }
];

export function Sidebar({ activeTab, setActiveTab, sidebarOpen }: SidebarProps) {
  const { isAdmin, isMasterAdmin } = useAuth();

  return (
    <aside className={`fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${
      sidebarOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              disabled={!isAdmin() && item.id !== 'dashboard' && item.id !== 'settings'}
            >
              <item.icon size={20} />
              {sidebarOpen && (
                <span className="flex-1 text-left">
                  {item.id === 'dashboard' && isMasterAdmin() ? 'Painel Master' :
                   item.id === 'settings' && !isAdmin() ? 'Meu Perfil' : item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}