import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { TrendingUp, TrendingDown, DollarSign, Search, Eye } from 'lucide-react';

export function ReadOnlyFinancial() {
  const { financialRecords, suppliers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredRecords = financialRecords.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || record.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalIncome = financialRecords
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = financialRecords
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Situação Financeira</h1>
          <p className="text-gray-600 dark:text-gray-400">Visualização das receitas e despesas do templo</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
          <Eye size={16} className="text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Modo Consulta</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Receitas</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">R$ {totalIncome.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-800">
              <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Despesas</p>
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">R$ {totalExpenses.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-800">
              <TrendingDown className="text-red-600 dark:text-red-400" size={24} />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          balance >= 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saldo</p>
              <p className={`text-2xl font-bold ${
                balance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'
              }`}>
                R$ {balance.toFixed(2)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              balance >= 0 ? 'bg-blue-100 dark:bg-blue-800' : 'bg-orange-100 dark:bg-orange-800'
            }`}>
              <DollarSign className={`${
                balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'
              }`} size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar transação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Todas</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredRecords.length} registros encontrados
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Data</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Tipo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Descrição</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Categoria</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Fornecedor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Valor</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {new Date(record.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      record.type === 'income' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {record.type === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{record.description}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{record.category}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {record.supplierId ? suppliers.find(s => s.id === record.supplierId)?.name || 'N/A' : '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${
                      record.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {record.type === 'income' ? '+' : '-'}R$ {record.amount.toFixed(2)}
                    </span>
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