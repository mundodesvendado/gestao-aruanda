import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { Settings as SettingsIcon, User, Shield, Bell, Palette, Save, Moon, Sun, Database, Globe, Mail, Building2 } from 'lucide-react';

export function Settings() {
  const { user, updateUser } = useAuth();
  const { mediums, updateMedium } = useData();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      neighborhood: user?.neighborhood || '',
      city: user?.city || '',
      state: user?.state || '',
      country: user?.country || 'Brasil',
      zipCode: user?.zipCode || '',
      templeName: user?.templeName || '',
      templeAddress: user?.templeAddress || '',
      templePhone: user?.templePhone || '',
      templeEmail: user?.templeEmail || ''
    },
    notifications: {
      emailNotifications: true,
      eventReminders: true,
      financialAlerts: true,
      memberUpdates: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      loginAlerts: true
    },
    appearance: {
      theme: theme,
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo'
    },
    administrators: mediums.filter(m => m.canAdminister).map(m => m.id),
    hosting: {
      supabaseUrl: '',
      supabaseAnonKey: '',
      timezone: 'America/Sao_Paulo',
      systemName: 'Sistema Umbanda',
      systemName: 'Gestão Aruanda',
      systemLogo: '',
      primaryColor: '#7C3AED',
      secondaryColor: '#3B82F6'
    },
    smtp: {
      host: '',
      port: '587',
      secure: false,
      username: '',
      password: '',
      fromName: 'Gestão Aruanda',
      fromEmail: ''
    }
  });

  const toggleMediumAdmin = (mediumId: string) => {
    const medium = mediums.find(m => m.id === mediumId);
    if (medium) {
      updateMedium(mediumId, { canAdminister: !medium.canAdminister });
    }
  };

  const handleSave = () => {
    // Salvar perfil do usuário
    updateUser(settings.profile);
    alert('Configurações salvas com sucesso!');
  };

  const handleThemeChange = (newTheme: string) => {
    if (newTheme !== theme) {
      toggleTheme();
    }
    setSettings({
      ...settings,
      appearance: { ...settings.appearance, theme: newTheme as 'light' | 'dark' }
    });
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'hosting', label: 'Hospedagem', icon: Database },
    { id: 'smtp', label: 'E-mail', icon: Mail }
  ];

  const supabaseSetupCode = `-- Configuração do Supabase para Sistema Umbanda

-- 1. Criar tabelas principais
CREATE TABLE mediums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date DATE,
  address TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Brasil',
  zip_code TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  category TEXT,
  join_date DATE DEFAULT CURRENT_DATE,
  exit_date DATE,
  can_administer BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Criar tabela de registros financeiros
CREATE TABLE financial_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Criar tabela de eventos
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type TEXT NOT NULL,
  participants TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE mediums ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas de segurança
CREATE POLICY "Permitir leitura para usuários autenticados" ON mediums
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir inserção para administradores" ON mediums
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Permitir atualização para administradores" ON mediums
  FOR UPDATE TO authenticated USING (true);`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Configurações</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie suas preferências e configurações do sistema</p>
        </div>
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center space-x-2"
        >
          <Save size={20} />
          <span>Salvar</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Informações do Perfil</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome</label>
                  <input
                    type="text"
                    value={settings.profile.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefone</label>
                  <input
                    type="tel"
                    value={settings.profile.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CEP</label>
                  <input
                    type="text"
                    value={settings.profile.zipCode}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, zipCode: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Endereço</label>
                <input
                  type="text"
                  value={settings.profile.address}
                  onChange={(e) => setSettings({
                    ...settings,
                    profile: { ...settings.profile, address: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bairro</label>
                  <input
                    type="text"
                    value={settings.profile.neighborhood}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, neighborhood: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cidade</label>
                  <input
                    type="text"
                    value={settings.profile.city}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, city: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</label>
                  <input
                    type="text"
                    value={settings.profile.state}
                    onChange={(e) => setSettings({
                      ...settings,
                      profile: { ...settings.profile, state: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">País</label>
                <input
                  type="text"
                  value={settings.profile.country}
                  onChange={(e) => setSettings({
                    ...settings,
                    profile: { ...settings.profile, country: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Médiuns Administradores</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Selecione quais médiuns podem administrar o sistema. Administradores têm acesso completo a todas as funcionalidades.
                </p>
                <div className="space-y-2">
                  {mediums.map((medium) => (
                    <div key={medium.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {medium.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{medium.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{medium.phone}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={medium.canAdminister}
                          onChange={() => toggleMediumAdmin(medium.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Usuários do Sistema</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Gerencie os usuários cadastrados no sistema e suas permissões de acesso.
                  </p>
                  <div className="space-y-2">
                    {JSON.parse(localStorage.getItem('users') || '[]').map((systemUser: any) => (
                      <div key={systemUser.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {systemUser.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{systemUser.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{systemUser.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            systemUser.role === 'admin' 
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                              : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300'
                          }`}>
                            {systemUser.role === 'admin' ? 'Administrador' : 'Usuário'}
                          </span>
                          {systemUser.id !== user?.id && (
                            <button
                              onClick={() => {
                                const users = JSON.parse(localStorage.getItem('users') || '[]');
                                const updatedUsers = users.map((u: any) => 
                                  u.id === systemUser.id 
                                    ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' }
                                    : u
                                );
                                localStorage.setItem('users', JSON.stringify(updatedUsers));
                                // Force re-render
                                window.location.reload();
                              }}
                              className={`px-3 py-1 text-xs rounded ${
                                systemUser.role === 'admin'
                                  ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                                  : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                              } transition-colors`}
                            >
                              {systemUser.role === 'admin' ? 'Remover Admin' : 'Tornar Admin'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configurações de Segurança</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Autenticação de Dois Fatores</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Adicione uma camada extra de segurança</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, twoFactorAuth: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Alertas de Login</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receba notificações de novos logins</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.loginAlerts}
                      onChange={(e) => setSettings({
                        ...settings,
                        security: { ...settings.security, loginAlerts: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timeout de Sessão (minutos)</label>
                  <select
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="15">15 minutos</option>
                    <option value="30">30 minutos</option>
                    <option value="60">1 hora</option>
                    <option value="120">2 horas</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preferências de Notificação</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Notificações por Email</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receba atualizações importantes por email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, emailNotifications: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Lembretes de Eventos</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receba lembretes de eventos próximos</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.eventReminders}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, eventReminders: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Alertas Financeiros</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receba alertas sobre movimentações financeiras</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.financialAlerts}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, financialAlerts: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Atualizações de Membros</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receba notificações sobre novos membros</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications.memberUpdates}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, memberUpdates: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configurações de Aparência</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tema</label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                        theme === 'light'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Sun size={20} />
                      <span>Claro</span>
                    </button>
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                        theme === 'dark'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Moon size={20} />
                      <span>Escuro</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Idioma</label>
                  <select
                    value={settings.appearance.language}
                    onChange={(e) => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, language: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fuso Horário</label>
                  <select
                    value={settings.appearance.timezone}
                    onChange={(e) => setSettings({
                      ...settings,
                      appearance: { ...settings.appearance, timezone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                    <option value="America/New_York">Nova York (GMT-5)</option>
                    <option value="Europe/London">Londres (GMT+0)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hosting' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configurações de Hospedagem</h3>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Instruções de Instalação</h4>
                <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>1. Acesse <a href="https://supabase.com" target="_blank" className="underline">supabase.com</a> e crie uma conta</li>
                  <li>2. Crie um novo projeto no Supabase</li>
                  <li>3. Vá para Settings → API para obter suas chaves</li>
                  <li>4. Execute o código SQL abaixo no SQL Editor do Supabase</li>
                  <li>5. Preencha os campos abaixo com suas credenciais</li>
                </ol>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Código SQL para Supabase</label>
                <div className="relative">
                  <textarea
                    value={supabaseSetupCode}
                    readOnly
                    className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-xs"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(supabaseSetupCode)}
                    className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL do Supabase</label>
                  <input
                    type="url"
                    value={settings.hosting.supabaseUrl}
                    onChange={(e) => setSettings({
                      ...settings,
                      hosting: { ...settings.hosting, supabaseUrl: e.target.value }
                    })}
                    placeholder="https://seu-projeto.supabase.co"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chave Anônima (Anon Key)</label>
                  <input
                    type="password"
                    value={settings.hosting.supabaseAnonKey}
                    onChange={(e) => setSettings({
                      ...settings,
                      hosting: { ...settings.hosting, supabaseAnonKey: e.target.value }
                    })}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fuso Horário</label>
                <select
                  value={settings.hosting.timezone}
                  onChange={(e) => setSettings({
                    ...settings,
                    hosting: { ...settings.hosting, timezone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                  <option value="America/New_York">Nova York (GMT-5)</option>
                  <option value="Europe/London">Londres (GMT+0)</option>
                </select>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Personalização do Sistema</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome do Sistema</label>
                    <input
                      type="text"
                      value={settings.hosting.systemName}
                      onChange={(e) => setSettings({
                        ...settings,
                        hosting: { ...settings.hosting, systemName: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL do Logotipo</label>
                    <input
                      type="url"
                      value={settings.hosting.systemLogo}
                      onChange={(e) => setSettings({
                        ...settings,
                        hosting: { ...settings.hosting, systemLogo: e.target.value }
                      })}
                      placeholder="https://exemplo.com/logo.png (64x64px)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recomendado: 64x64px, formato PNG ou SVG</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cor Primária</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={settings.hosting.primaryColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          hosting: { ...settings.hosting, primaryColor: e.target.value }
                        })}
                        className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.hosting.primaryColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          hosting: { ...settings.hosting, primaryColor: e.target.value }
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cor Secundária</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={settings.hosting.secondaryColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          hosting: { ...settings.hosting, secondaryColor: e.target.value }
                        })}
                        className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.hosting.secondaryColor}
                        onChange={(e) => setSettings({
                          ...settings,
                          hosting: { ...settings.hosting, secondaryColor: e.target.value }
                        })}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => alert('Conexão com Supabase estabelecida com sucesso!')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <Database size={20} />
                  <span>Conectar ao Supabase</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gestão de Fornecedores</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Os fornecedores cadastrados podem ser selecionados durante o lançamento de despesas no sistema financeiro.
                Isso facilita o controle e rastreamento de gastos por fornecedor.
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Como usar:</h4>
                <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>1. Acesse a aba "Fornecedores" no menu lateral</li>
                  <li>2. Cadastre seus fornecedores com informações completas</li>
                  <li>3. No sistema financeiro, selecione o fornecedor ao registrar despesas</li>
                  <li>4. Gere relatórios detalhados por fornecedor</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'smtp' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configurações de E-mail</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Configure o servidor SMTP para envio automático de notificações por e-mail.
              </p>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-medium text-yellow-900 dark:text-yellow-300 mb-2">Provedores Recomendados:</h4>
                <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
                  <li>• <strong>Gmail:</strong> smtp.gmail.com, porta 587</li>
                  <li>• <strong>Outlook:</strong> smtp-mail.outlook.com, porta 587</li>
                  <li>• <strong>SendGrid:</strong> smtp.sendgrid.net, porta 587</li>
                  <li>• <strong>Mailgun:</strong> smtp.mailgun.org, porta 587</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Servidor SMTP</label>
                  <input
                    type="text"
                    value={settings.smtp.host}
                    onChange={(e) => setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, host: e.target.value }
                    })}
                    placeholder="smtp.gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Porta</label>
                  <input
                    type="number"
                    value={settings.smtp.port}
                    onChange={(e) => setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, port: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Usuário</label>
                  <input
                    type="email"
                    value={settings.smtp.username}
                    onChange={(e) => setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, username: e.target.value }
                    })}
                    placeholder="seu-email@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senha</label>
                  <input
                    type="password"
                    value={settings.smtp.password}
                    onChange={(e) => setSettings({
                      ...settings,
                      smtp: { ...settings.smtp, password: e.target.value }
                    })}
                    placeholder="sua-senha-de-app"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smtpSecure"
                  checked={settings.smtp.secure}
                  onChange={(e) => setSettings({
                    ...settings,
                    smtp: { ...settings.smtp, secure: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="smtpSecure" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Usar conexão segura (SSL/TLS)
                </label>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Configurações de Envio</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome do Remetente</label>
                    <input
                      type="text"
                      value={settings.smtp.fromName}
                      onChange={(e) => setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, fromName: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">E-mail do Remetente</label>
                    <input
                      type="email"
                      value={settings.smtp.fromEmail}
                      onChange={(e) => setSettings({
                        ...settings,
                        smtp: { ...settings.smtp, fromEmail: e.target.value }
                      })}
                      placeholder="noreply@seutemplo.com.br"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => alert('Configuração SMTP testada com sucesso!')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 flex items-center space-x-2"
                >
                  <Mail size={20} />
                  <span>Testar Configuração</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}