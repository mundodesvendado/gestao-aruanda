import React from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Users, DollarSign, Calendar, TrendingUp, Star, Moon, UserCheck, UserX, Clock } from 'lucide-react';

export function Dashboard() {
  const { mediums, financialRecords, events, suppliers } = useData();
  const { getTempleUsers, approveUser, rejectUser, isAdmin } = useAuth();

  // Usuários pendentes de aprovação
  const pendingUsers = getTempleUsers().filter(u => !u.active && u.role === 'user');

  // Aniversariantes do mês
  const currentMonth = new Date().getMonth();
  const birthdayMediums = mediums.filter(medium => {
    if (!medium.birthDate) return false;
    const birthMonth = new Date(medium.birthDate).getMonth();
    return birthMonth === currentMonth && medium.status === 'active';
  });

  const activeMediums = mediums.filter(m => m.status === 'active').length;
  const totalIncome = financialRecords
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = financialRecords
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);
  const balance = totalIncome - totalExpenses;
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length;

  const stats = [
    {
      title: 'Médiuns Ativos',
      value: activeMediums,
      icon: Users,
      color: 'from-blue-500 to-purple-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Saldo Atual',
      value: `R$ ${balance.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Próximos Eventos',
      value: upcomingEvents,
      icon: Calendar,
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'Receitas do Mês',
      value: `R$ ${totalIncome.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const recentActivities = [
    ...financialRecords.slice(-2).reverse().map(record => ({
      text: `${record.type === 'income' ? 'Receita' : 'Despesa'}: ${record.description}`,
      time: `${Math.floor((Date.now() - new Date(record.date).getTime()) / (1000 * 60 * 60 * 24))} dias atrás`,
      type: record.type
    })),
    ...events.slice(-2).reverse().map(event => ({
      text: `Evento agendado: ${event.title}`,
      time: `${Math.floor((new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} dias`,
      type: 'event'
    })),
    ...mediums.slice(-1).map(medium => ({
      text: `Novo médium: ${medium.name}`,
      time: `${Math.floor((Date.now() - new Date(medium.joinDate).getTime()) / (1000 * 60 * 60 * 24))} dias atrás`,
      type: 'member'
    }))
  ];

  // Próximos eventos (últimos agendamentos)
  const upcomingEventsData = events
    .filter(e => new Date(e.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const handleApproveUser = async (userId: string) => {
    try {
      await approveUser(userId);
      alert('Usuário aprovado com sucesso!');
    } catch (error) {
      alert('Erro ao aprovar usuário: ' + (error as Error).message);
    }
  };

  const handleRejectUser = async (userId: string) => {
    if (window.confirm('Tem certeza que deseja rejeitar este usuário? Esta ação não pode ser desfeita.')) {
      try {
        await rejectUser(userId);
        alert('Usuário rejeitado com sucesso!');
      } catch (error) {
        alert('Erro ao rejeitar usuário: ' + (error as Error).message);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Visão geral do templo</p>
        </div>
        <div className="flex items-center space-x-2 text-yellow-600">
          <Star size={24} />
          <Moon size={24} />
        </div>
      </div>

      {/* Usuários Pendentes de Aprovação */}
      {isAdmin() && pendingUsers.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Clock size={20} className="text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300">
              Usuários Pendentes de Aprovação ({pendingUsers.length})
            </h3>
          </div>
          <div className="space-y-3">
            {pendingUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Cadastrado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApproveUser(user.id)}
                    className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all transform hover:scale-110"
                    title="Aprovar usuário"
                  >
                    <UserCheck size={16} />
                  </button>
                  <button
                    onClick={() => handleRejectUser(user.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all transform hover:scale-110"
                    title="Rejeitar usuário"
                  >
                    <UserX size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className={`${stat.bgColor} p-6 rounded-xl border border-gray-200 dark:border-gray-700`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Atividades Recentes</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'income' ? 'bg-green-500' :
                  activity.type === 'expense' ? 'bg-red-500' :
                  activity.type === 'event' ? 'bg-blue-500' : 'bg-purple-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{activity.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Aniversariantes do Mês</h3>
          <div className="space-y-3">
            {birthdayMediums.length > 0 ? (
              birthdayMediums.map((medium) => (
                <div key={medium.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {medium.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{medium.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(medium.birthDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum aniversariante este mês</p>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Próximos Eventos</h3>
          <div className="space-y-3">
            {upcomingEventsData.length > 0 ? (
              upcomingEventsData.map((event) => (
                <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{event.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.type === 'gira' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                      event.type === 'meeting' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                      event.type === 'ceremony' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                      event.type === 'lecture' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                      'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300'
                    }`}>
                      {event.type === 'gira' ? 'Gira' :
                       event.type === 'meeting' ? 'Reunião' :
                       event.type === 'ceremony' ? 'Cerimônia' :
                       event.type === 'lecture' ? 'Palestra' :
                       event.type === 'festivity' ? 'Festividade' :
                       event.type === 'external' ? 'Externo' : 'Evento'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum evento agendado</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumo Financeiro</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Receitas</p>
            <p className="text-2xl font-bold text-green-600">R$ {totalIncome.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Despesas</p>
            <p className="text-2xl font-bold text-red-600">R$ {totalExpenses.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Saldo</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {balance.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}