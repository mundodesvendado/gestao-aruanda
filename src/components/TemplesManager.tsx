import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, Search, Building, Users, UserPlus, Shield, Eye, EyeOff, CreditCard, Calendar, AlertTriangle } from 'lucide-react';

export function TemplesManager() {
  const { temples, addTemple, updateTemple, deleteTemple, addTempleAdmin, updateTempleAdmin, deleteTempleAdmin, getTempleUsers } = useAuth();
  const [activeTab, setActiveTab] = useState('temples');
  const [showTempleForm, setShowTempleForm] = useState(false);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<string | null>(null);
  const [editingTemple, setEditingTemple] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTempleId, setSelectedTempleId] = useState<string>('');

  const [templeFormData, setTempleFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    status: 'active' as const,
    subdomain: ''
  });

  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    country: 'Brasil',
    zipCode: '',
    templeId: '',
    role: 'temple_admin' as const,
    active: true
  });

  const resetTempleForm = () => {
    setTempleFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      status: 'active',
      subdomain: ''
    });
    setEditingTemple(null);
    setShowTempleForm(false);
  };

  const resetAdminForm = () => {
    setAdminFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      neighborhood: '',
      city: '',
      state: '',
      country: 'Brasil',
      zipCode: '',
      templeId: '',
      role: 'temple_admin',
      active: true
    });
    setEditingAdmin(null);
    setShowAdminForm(false);
  };

  const handleTempleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTemple) {
        await updateTemple(editingTemple, templeFormData);
        alert('Templo atualizado com sucesso!');
      } else {
        await addTemple(templeFormData);
        alert('Templo cadastrado com sucesso!');
      }
      resetTempleForm();
    } catch (error) {
      alert('Erro ao salvar templo: ' + (error as Error).message);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        await updateTempleAdmin(editingAdmin, adminFormData);
        alert('Administrador atualizado com sucesso!');
      } else {
        await addTempleAdmin(adminFormData);
        alert('Administrador cadastrado com sucesso!');
      }
      resetAdminForm();
    } catch (error) {
      alert('Erro ao salvar administrador: ' + (error as Error).message);
    }
  };

  const handleEditTemple = (temple: any) => {
    setTempleFormData(temple);
    setEditingTemple(temple.id);
    setShowTempleForm(true);
  };

  const handleDeleteTemple = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este templo? Todos os dados relacionados serão perdidos.')) {
      try {
        await deleteTemple(id);
        alert('Templo excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir templo: ' + (error as Error).message);
      }
    }
  };

  const handleSetTempleAdmin = async (templeId: string, mediumId: string) => {
    try {
      // Promover médium para administrador do templo
      await promoteToAdmin(mediumId);
      alert('Administrador do templo definido com sucesso!');
    } catch (error) {
      alert('Erro ao definir administrador: ' + (error as Error).message);
    }
  };
  const handleEditAdmin = (admin: any) => {
    setAdminFormData({
      ...admin,
      password: '' // Don't pre-fill password for security
    });
    setEditingAdmin(admin.id);
    setShowAdminForm(true);
  };

  const handleDeleteAdmin = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este administrador?')) {
      try {
        await deleteTempleAdmin(id);
        alert('Administrador excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir administrador: ' + (error as Error).message);
      }
    }
  };

  const filteredTemples = temples.filter(temple =>
    temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    temple.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allUsers = getTempleUsers();
  const selectedTempleUsers = selectedTempleId ? allUsers.filter(u => u.templeId === selectedTempleId) : allUsers;

  const getTempleStatus = (temple: any) => {
    const trialEndDate = new Date(new Date(temple.createdAt).getTime() + 14 * 24 * 60 * 60 * 1000);
    const isTrialExpired = new Date() > trialEndDate;
    const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    
    return { isTrialExpired, daysRemaining, trialEndDate };
  };

  const tabs = [
    { id: 'temples', label: 'Templos', icon: Building },
    { id: 'admins', label: 'Administradores', icon: Users },
    { id: 'billing', label: 'Cobrança', icon: CreditCard }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestão de Templos</h1>
          <p className="text-gray-600 dark:text-gray-400">Administração completa de templos e usuários</p>
        </div>
        <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          <Shield size={16} className="text-red-600 dark:text-red-400" />
          <span className="text-sm text-red-700 dark:text-red-300 font-medium">Administrador Master</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
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
          {activeTab === 'temples' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Buscar templo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setShowTempleForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Novo Templo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemples.map((temple) => {
                  const { isTrialExpired, daysRemaining } = getTempleStatus(temple);
                  const templeUsers = allUsers.filter(u => u.templeId === temple.id);
                  const templeMediums = templeUsers.filter(u => u.isMedium);
                  const templeAdmin = templeUsers.find(u => u.role === 'temple_admin');
                  
                  return (
                    <div key={temple.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{temple.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{temple.address}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{temple.email}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{temple.phone}</p>
                          {templeAdmin && (
                            <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                              <strong>Admin:</strong> {templeAdmin.name}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditTemple(temple)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTemple(temple.id)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {templeMediums.length > 0 && !templeAdmin && (
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Definir Administrador do Templo:
                            </label>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleSetTempleAdmin(temple.id, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="">Selecione um médium...</option>
                              {templeMediums.map(medium => (
                                <option key={medium.id} value={medium.id}>
                                  {medium.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            temple.status === 'active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}>
                            {temple.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                          {temple.subdomain && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {temple.subdomain}.gestaoaruanda.com.br
                            </span>
                          )}
                        </div>
                        
                        <div className={`p-2 rounded text-xs ${
                          isTrialExpired 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                            : daysRemaining <= 7
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                        }`}>
                          {isTrialExpired 
                            ? 'Período de teste expirado'
                            : `${daysRemaining} dias restantes no teste`
                          }
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Administradores de Templos</h3>
                  <select
                    value={selectedTempleId}
                    onChange={(e) => setSelectedTempleId(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Todos os templos</option>
                    {temples.map(temple => (
                      <option key={temple.id} value={temple.id}>{temple.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setShowAdminForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2"
                >
                  <UserPlus size={16} />
                  <span>Novo Administrador</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Nome</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Templo</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTempleUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{user.name}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{user.email}</td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{user.templeName || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'temple_admin'
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                              : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300'
                          }`}>
                            {user.role === 'temple_admin' ? 'Admin Templo' : 'Usuário'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.active
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}>
                            {user.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditAdmin(user)}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(user.id)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sistema de Cobrança</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {temples.map((temple) => {
                  const { isTrialExpired, daysRemaining, trialEndDate } = getTempleStatus(temple);
                  
                  return (
                    <div key={temple.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">{temple.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          isTrialExpired 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                        }`}>
                          {isTrialExpired ? 'Expirado' : 'Período de Teste'}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>
                          <span className={isTrialExpired ? 'text-red-600' : 'text-blue-600'}>
                            {isTrialExpired ? 'Período expirado' : `${daysRemaining} dias restantes`}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Fim do teste:</span>
                          <span className="text-gray-900 dark:text-white">
                            {trialEndDate.toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Valor mensal:</span>
                          <span className="text-gray-900 dark:text-white font-medium">R$ 47,00</span>
                        </div>
                        
                        {isTrialExpired && (
                          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                            <button
                              onClick={() => window.open('https://pay.kiwify.com.br/lV2nT9Y', '_blank')}
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                            >
                              Ativar Assinatura
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Temple Form Modal */}
      {showTempleForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {editingTemple ? 'Editar Templo' : 'Novo Templo'}
            </h3>
            <form onSubmit={handleTempleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Templo</label>
                <input
                  type="text"
                  value={templeFormData.name}
                  onChange={(e) => setTempleFormData({...templeFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endereço</label>
                <input
                  type="text"
                  value={templeFormData.address}
                  onChange={(e) => setTempleFormData({...templeFormData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={templeFormData.phone}
                    onChange={(e) => setTempleFormData({...templeFormData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={templeFormData.email}
                    onChange={(e) => setTempleFormData({...templeFormData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subdomínio</label>
                  <input
                    type="text"
                    value={templeFormData.subdomain}
                    onChange={(e) => setTempleFormData({...templeFormData, subdomain: e.target.value})}
                    placeholder="ex: templo1"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    value={templeFormData.status}
                    onChange={(e) => setTempleFormData({...templeFormData, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetTempleForm}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  {editingTemple ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Form Modal */}
      {showAdminForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {editingAdmin ? 'Editar Administrador' : 'Novo Administrador de Templo'}
            </h3>
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={adminFormData.name}
                    onChange={(e) => setAdminFormData({...adminFormData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={adminFormData.email}
                    onChange={(e) => setAdminFormData({...adminFormData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {editingAdmin ? 'Nova Senha (deixe vazio para manter)' : 'Senha Provisória'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminFormData.password}
                      onChange={(e) => setAdminFormData({...adminFormData, password: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required={!editingAdmin}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Templo</label>
                  <select
                    value={adminFormData.templeId}
                    onChange={(e) => setAdminFormData({...adminFormData, templeId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Selecione um templo</option>
                    {temples.filter(t => t.status === 'active').map(temple => (
                      <option key={temple.id} value={temple.id}>{temple.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
                  <input
                    type="tel"
                    value={adminFormData.phone}
                    onChange={(e) => setAdminFormData({...adminFormData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CEP</label>
                  <input
                    type="text"
                    value={adminFormData.zipCode}
                    onChange={(e) => setAdminFormData({...adminFormData, zipCode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endereço</label>
                <input
                  type="text"
                  value={adminFormData.address}
                  onChange={(e) => setAdminFormData({...adminFormData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bairro</label>
                  <input
                    type="text"
                    value={adminFormData.neighborhood}
                    onChange={(e) => setAdminFormData({...adminFormData, neighborhood: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={adminFormData.city}
                    onChange={(e) => setAdminFormData({...adminFormData, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado</label>
                  <input
                    type="text"
                    value={adminFormData.state}
                    onChange={(e) => setAdminFormData({...adminFormData, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetAdminForm}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  {editingAdmin ? 'Atualizar' : 'Cadastrar'} Administrador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}