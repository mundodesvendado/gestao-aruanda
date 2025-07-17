import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { FileText, Calendar, Users, DollarSign, TrendingUp, BarChart3, PieChart, Eye } from 'lucide-react';

export function ReadOnlyReports() {
  const { mediums, financialRecords, events } = useData();
  const [activeReport, setActiveReport] = useState('mediums');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const generateMediumsReport = () => {
    const totalMediums = mediums.length;
    const activeMediums = mediums.filter(m => m.status === 'active').length;
    const inactiveMediums = mediums.filter(m => m.status === 'inactive').length;
    
    const categoryStats = mediums.reduce((acc, medium) => {
      acc[medium.category] = (acc[medium.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const cityStats = mediums.reduce((acc, medium) => {
      acc[medium.city] = (acc[medium.city] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMediums,
      activeMediums,
      inactiveMediums,
      categoryStats,
      cityStats,
      adminCount: mediums.filter(m => m.canAdminister).length
    };
  };

  const generateFinancialReport = () => {
    const filteredRecords = financialRecords.filter(record => {
      const recordDate = new Date(record.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return recordDate >= startDate && recordDate <= endDate;
    });

    const totalIncome = filteredRecords
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    
    const totalExpenses = filteredRecords
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);

    const balance = totalIncome - totalExpenses;

    const incomeByCategory = filteredRecords
      .filter(r => r.type === 'income')
      .reduce((acc, record) => {
        acc[record.category] = (acc[record.category] || 0) + record.amount;
        return acc;
      }, {} as Record<string, number>);

    const expensesByCategory = filteredRecords
      .filter(r => r.type === 'expense')
      .reduce((acc, record) => {
        acc[record.category] = (acc[record.category] || 0) + record.amount;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalIncome,
      totalExpenses,
      balance,
      incomeByCategory,
      expensesByCategory,
      recordCount: filteredRecords.length
    };
  };

  const generateEventsReport = () => {
    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return eventDate >= startDate && eventDate <= endDate;
    });

    const totalEvents = filteredEvents.length;
    const upcomingEvents = filteredEvents.filter(e => new Date(e.date) > new Date()).length;
    const pastEvents = filteredEvents.filter(e => new Date(e.date) <= new Date()).length;

    const eventsByType = filteredEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageParticipants = filteredEvents.length > 0 
      ? filteredEvents.reduce((sum, event) => sum + event.participants.length, 0) / filteredEvents.length 
      : 0;

    return {
      totalEvents,
      upcomingEvents,
      pastEvents,
      eventsByType,
      averageParticipants: Math.round(averageParticipants * 10) / 10
    };
  };

  const mediumsReport = generateMediumsReport();
  const financialReport = generateFinancialReport();
  const eventsReport = generateEventsReport();

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

  const getEventTypeLabel = (type: string) => {
    const labels = {
      gira: 'Gira',
      meeting: 'Reunião',
      ceremony: 'Cerimônia',
      event: 'Evento',
      lecture: 'Palestra',
      festivity: 'Festividade',
      external: 'Evento Externo'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
          <p className="text-gray-600 dark:text-gray-400">Análises e estatísticas do templo</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
          <Eye size={16} className="text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Modo Consulta</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <div className="flex items-center space-x-4">
            <select
              value={activeReport}
              onChange={(e) => setActiveReport(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="mediums">Relatório de Médiuns</option>
              <option value="financial">Relatório Financeiro</option>
              <option value="events">Relatório de Eventos</option>
            </select>
            
            {(activeReport === 'financial' || activeReport === 'events') && (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-gray-500 dark:text-gray-400">até</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}
          </div>
        </div>

        {activeReport === 'mediums' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Total de Médiuns</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{mediumsReport.totalMediums}</p>
                  </div>
                  <Users className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">Ativos</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{mediumsReport.activeMediums}</p>
                  </div>
                  <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 dark:text-red-400">Inativos</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">{mediumsReport.inactiveMediums}</p>
                  </div>
                  <BarChart3 className="text-red-600 dark:text-red-400" size={24} />
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Administradores</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{mediumsReport.adminCount}</p>
                  </div>
                  <PieChart className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribuição por Categoria</h3>
                <div className="space-y-3">
                  {Object.entries(mediumsReport.categoryStats).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">{getCategoryLabel(category)}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Distribuição por Cidade</h3>
                <div className="space-y-3">
                  {Object.entries(mediumsReport.cityStats).map(([city, count]) => (
                    <div key={city} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">{city}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'financial' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">Receitas</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">R$ {financialReport.totalIncome.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600 dark:text-red-400">Despesas</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">R$ {financialReport.totalExpenses.toFixed(2)}</p>
                  </div>
                  <BarChart3 className="text-red-600 dark:text-red-400" size={24} />
                </div>
              </div>
              <div className={`p-4 rounded-lg ${financialReport.balance >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${financialReport.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>Saldo</p>
                    <p className={`text-2xl font-bold ${financialReport.balance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-orange-700 dark:text-orange-300'}`}>
                      R$ {financialReport.balance.toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className={`${financialReport.balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`} size={24} />
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Transações</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{financialReport.recordCount}</p>
                  </div>
                  <FileText className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Receitas por Categoria</h3>
                <div className="space-y-3">
                  {Object.entries(financialReport.incomeByCategory).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">{category}</span>
                      <span className="font-semibold text-green-700 dark:text-green-300">R$ {amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Despesas por Categoria</h3>
                <div className="space-y-3">
                  {Object.entries(financialReport.expensesByCategory).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">{category}</span>
                      <span className="font-semibold text-red-700 dark:text-red-300">R$ {amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeReport === 'events' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Total de Eventos</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{eventsReport.totalEvents}</p>
                  </div>
                  <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">Próximos</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{eventsReport.upcomingEvents}</p>
                  </div>
                  <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Realizados</p>
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{eventsReport.pastEvents}</p>
                  </div>
                  <BarChart3 className="text-gray-600 dark:text-gray-400" size={24} />
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Média Participantes</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{eventsReport.averageParticipants}</p>
                  </div>
                  <Users className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Eventos por Tipo</h3>
              <div className="space-y-3">
                {Object.entries(eventsReport.eventsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">{getEventTypeLabel(type)}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}