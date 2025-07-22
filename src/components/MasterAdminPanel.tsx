import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, Search, Building, Users, UserPlus, Shield, Eye, EyeOff } from 'lucide-react';

export function MasterAdminPanel() {
  const { temples, getTempleUsers } = useAuth();
  const [activeTab, setActiveTab] = useState('temples');
  const [searchTerm, setSearchTerm] = useState('');


  const filteredTemples = temples.filter(temple =>
    temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    temple.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allUsers = getTempleUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Master</h1>
          <p className="text-gray-600 dark:text-gray-400">Visão geral do sistema</p>
        </div>
        <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          <Shield size={16} className="text-red-600 dark:text-red-400" />
          <span className="text-sm text-red-700 dark:text-red-300 font-medium">Administrador Master</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total de Templos</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{temples.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800">
              <Building className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Templos Ativos</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {temples.filter(t => t.status === 'active').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-800">
              <Building className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total de Usuários</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{allUsers.length}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-800">
              <Users className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Administradores</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {allUsers.filter(u => u.role === 'temple_admin').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-800">
              <Shield className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumo do Sistema</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Templos Recentes</h4>
            <div className="space-y-2">
              {temples.slice(-5).map((temple) => (
                <div key={temple.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-900 dark:text-white">{temple.name}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    temple.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  }`}>
                    {temple.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Administradores Recentes</h4>
            <div className="space-y-2">
              {allUsers.filter(u => u.role === 'temple_admin').slice(-5).map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <span className="text-gray-900 dark:text-white">{admin.name}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{admin.templeName}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    admin.active
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  }`}>
                    {admin.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}