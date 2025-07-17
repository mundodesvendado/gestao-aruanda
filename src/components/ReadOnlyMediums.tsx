import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Search, Filter, UserPlus, Eye } from 'lucide-react';

export function ReadOnlyMediums() {
  const { mediums } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredMediums = mediums.filter(medium => {
    const matchesSearch = medium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medium.phone.includes(searchTerm) ||
                         medium.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || medium.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getCategoryLabel = (category: string) => {
    const labels = {
      passista: 'Passista',
      development: 'Em Desenvolvimento',
      cambone: 'Cambone',
      priest: 'Sacerdote',
      oga: 'Ogã',
      consulente: 'Consulente'
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Médiuns do Templo</h1>
          <p className="text-gray-600 dark:text-gray-400">Visualização dos médiuns cadastrados</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
          <Eye size={16} className="text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Modo Consulta</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar médium..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <UserPlus size={16} />
            <span>{filteredMediums.length} médiuns encontrados</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Nome</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Categoria</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Cidade</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Telefone</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Ingresso</th>
              </tr>
            </thead>
            <tbody>
              {filteredMediums.map((medium) => (
                <tr key={medium.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {medium.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{medium.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{medium.neighborhood}, {medium.city}</p>
                        {medium.canAdminister && (
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                      {getCategoryLabel(medium.category)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      medium.status === 'active' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {medium.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{medium.city}, {medium.state}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{medium.phone}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {new Date(medium.joinDate).toLocaleDateString('pt-BR')}
                    {medium.exitDate && (
                      <div className="text-xs text-red-600 dark:text-red-400">
                        Saída: {new Date(medium.exitDate).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}