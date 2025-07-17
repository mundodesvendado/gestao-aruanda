import React from 'react';
import { useData } from '../contexts/DataContext';
import { Bell, Users, AlertCircle, CheckCircle, Info, X, Eye } from 'lucide-react';

export function ReadOnlyNotifications() {
  const { notifications, mediums } = useData();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      case 'error':
        return <X className="text-red-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      default:
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notificações</h1>
          <p className="text-gray-600 dark:text-gray-400">Visualização das notificações do templo</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
          <Eye size={16} className="text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Modo Consulta</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total de Notificações</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{notifications.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800">
              <Bell className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Não Lidas</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{unreadCount}</p>
            </div>
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-800">
              <AlertCircle className="text-orange-600 dark:text-orange-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Médiuns Ativos</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{mediums.filter(m => m.status === 'active').length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-800">
              <Users className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Histórico de Notificações</h3>
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-l-4 p-4 rounded-lg ${getTypeColor(notification.type)} ${
                  !notification.read ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getTypeIcon(notification.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>{new Date(notification.date).toLocaleString('pt-BR')}</span>
                        <span>
                          {notification.targetUsers.includes('all') 
                            ? 'Todos os médiuns' 
                            : `${notification.targetUsers.length} médium(s)`}
                        </span>
                        {!notification.read && (
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs">
                            Não lida
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              Nenhuma notificação encontrada
            </p>
          )}
        </div>
      </div>
    </div>
  );
}