import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { FileText, Download, Calendar, Users, DollarSign, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

export function Reports() {
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

    const monthlyData = filteredRecords.reduce((acc, record) => {
      const month = new Date(record.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
      if (!acc[month]) {
        acc[month] = { income: 0, expenses: 0 };
      }
      if (record.type === 'income') {
        acc[month].income += record.amount;
      } else {
        acc[month].expenses += record.amount;
      }
      return acc;
    }, {} as Record<string, { income: number; expenses: number }>);

    return {
      totalIncome,
      totalExpenses,
      balance,
      incomeByCategory,
      expensesByCategory,
      monthlyData,
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

    const monthlyEvents = filteredEvents.reduce((acc, event) => {
      const month = new Date(event.date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });
      acc[month] = (acc[month] || 0) + 1;
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
      monthlyEvents,
      averageParticipants: Math.round(averageParticipants * 10) / 10
    };
  };

  const exportToExcel = (reportType: string) => {
    let data: any;
    let filename: string;
    let worksheetData: any[] = [];

    switch (reportType) {
      case 'mediums':
        data = generateMediumsReport();
        filename = 'relatorio_mediums.xlsx';
        worksheetData = [
          ['Relatório de Médiuns'],
          [''],
          ['Total de Médiuns', data.totalMediums],
          ['Médiuns Ativos', data.activeMediums],
          ['Médiuns Inativos', data.inactiveMediums],
          ['Administradores', data.adminCount],
          [''],
          ['Distribuição por Categoria'],
          ...Object.entries(data.categoryStats).map(([category, count]) => [getCategoryLabel(category), count]),
          [''],
          ['Distribuição por Cidade'],
          ...Object.entries(data.cityStats).map(([city, count]) => [city, count])
        ];
        break;
      case 'financial':
        data = generateFinancialReport();
        filename = 'relatorio_financeiro.xlsx';
        worksheetData = [
          ['Relatório Financeiro'],
          ['Período:', `${dateRange.start} até ${dateRange.end}`],
          [''],
          ['Resumo'],
          ['Total de Receitas', `R$ ${data.totalIncome.toFixed(2)}`],
          ['Total de Despesas', `R$ ${data.totalExpenses.toFixed(2)}`],
          ['Saldo', `R$ ${data.balance.toFixed(2)}`],
          ['Total de Transações', data.recordCount],
          [''],
          ['Receitas por Categoria'],
          ...Object.entries(data.incomeByCategory).map(([category, amount]) => [category, `R$ ${amount.toFixed(2)}`]),
          [''],
          ['Despesas por Categoria'],
          ...Object.entries(data.expensesByCategory).map(([category, amount]) => [category, `R$ ${amount.toFixed(2)}`])
        ];
        break;
      case 'events':
        data = generateEventsReport();
        filename = 'relatorio_eventos.xlsx';
        worksheetData = [
          ['Relatório de Eventos'],
          ['Período:', `${dateRange.start} até ${dateRange.end}`],
          [''],
          ['Resumo'],
          ['Total de Eventos', data.totalEvents],
          ['Próximos Eventos', data.upcomingEvents],
          ['Eventos Realizados', data.pastEvents],
          ['Média de Participantes', data.averageParticipants],
          [''],
          ['Eventos por Tipo'],
          ...Object.entries(data.eventsByType).map(([type, count]) => [getEventTypeLabel(type), count])
        ];
        break;
      default:
        return;
    }

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    XLSX.writeFile(workbook, filename);
  };

  const exportToPDF = (reportType: string) => {
    const pdf = new jsPDF();
    let data: any;
    let title: string;

    switch (reportType) {
      case 'mediums':
        data = generateMediumsReport();
        title = 'Relatório de Médiuns';
        
        pdf.setFontSize(20);
        pdf.text(title, 20, 20);
        
        pdf.setFontSize(12);
        pdf.text(`Total de Médiuns: ${data.totalMediums}`, 20, 40);
        pdf.text(`Médiuns Ativos: ${data.activeMediums}`, 20, 50);
        pdf.text(`Médiuns Inativos: ${data.inactiveMediums}`, 20, 60);
        pdf.text(`Administradores: ${data.adminCount}`, 20, 70);

        const categoryData = Object.entries(data.categoryStats).map(([category, count]) => [
          getCategoryLabel(category), count.toString()
        ]);
        
        (pdf as any).autoTable({
          head: [['Categoria', 'Quantidade']],
          body: categoryData,
          startY: 90,
        });
        
        pdf.save('relatorio_mediums.pdf');
        break;
        
      case 'financial':
        data = generateFinancialReport();
        title = 'Relatório Financeiro';
        
        pdf.setFontSize(20);
        pdf.text(title, 20, 20);
        
        pdf.setFontSize(12);
        pdf.text(`Período: ${dateRange.start} até ${dateRange.end}`, 20, 35);
        pdf.text(`Total de Receitas: R$ ${data.totalIncome.toFixed(2)}`, 20, 50);
        pdf.text(`Total de Despesas: R$ ${data.totalExpenses.toFixed(2)}`, 20, 60);
        pdf.text(`Saldo: R$ ${data.balance.toFixed(2)}`, 20, 70);
        
        const incomeData = Object.entries(data.incomeByCategory).map(([category, amount]) => [
          category, `R$ ${amount.toFixed(2)}`
        ]);
        
        (pdf as any).autoTable({
          head: [['Categoria de Receita', 'Valor']],
          body: incomeData,
          startY: 85,
        });
        
        pdf.save('relatorio_financeiro.pdf');
        break;
        
      case 'events':
        data = generateEventsReport();
        title = 'Relatório de Eventos';
        
        pdf.setFontSize(20);
        pdf.text(title, 20, 20);
        
        pdf.setFontSize(12);
        pdf.text(`Período: ${dateRange.start} até ${dateRange.end}`, 20, 35);
        pdf.text(`Total de Eventos: ${data.totalEvents}`, 20, 50);
        pdf.text(`Próximos Eventos: ${data.upcomingEvents}`, 20, 60);
        pdf.text(`Eventos Realizados: ${data.pastEvents}`, 20, 70);
        
        const eventsData = Object.entries(data.eventsByType).map(([type, count]) => [
          getEventTypeLabel(type), count.toString()
        ]);
        
        (pdf as any).autoTable({
          head: [['Tipo de Evento', 'Quantidade']],
          body: eventsData,
          startY: 85,
        });
        
        pdf.save('relatorio_eventos.pdf');
        break;
    }
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
          
          <button
            onClick={() => exportToExcel(activeReport)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Excel</span>
          </button>
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

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Movimentação Mensal</h3>
              <div className="space-y-3">
                {Object.entries(financialReport.monthlyData).map(([month, data]) => (
                  <div key={month} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{month}</span>
                      <span className={`font-semibold ${(data.income - data.expenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {(data.income - data.expenses).toFixed(2)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-green-600 dark:text-green-400">
                        Receitas: R$ {data.income.toFixed(2)}
                      </div>
                      <div className="text-red-600 dark:text-red-400">
                        Despesas: R$ {data.expenses.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Eventos por Mês</h3>
                <div className="space-y-3">
                  {Object.entries(eventsReport.monthlyEvents).map(([month, count]) => (
                    <div key={month} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-700 dark:text-gray-300">{month}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}