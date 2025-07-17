import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Calendar, Clock, Users, Search, Eye } from 'lucide-react';

export function ReadOnlyEvents() {
  const { events, mediums } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeLabel = (type: string) => {
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

  const getTypeColor = (type: string) => {
    const colors = {
      gira: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
      meeting: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
      ceremony: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
      event: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
      lecture: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
      festivity: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300',
      external: 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300';
  };

  const upcomingEvents = events.filter(event => new Date(event.date) > new Date());
  const pastEvents = events.filter(event => new Date(event.date) <= new Date());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendário de Eventos</h1>
          <p className="text-gray-600 dark:text-gray-400">Visualização de giras, reuniões e cerimônias</p>
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
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Próximos Eventos</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{upcomingEvents.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-800">
              <Calendar className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Eventos Realizados</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{pastEvents.length}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-800">
              <Clock className="text-green-600 dark:text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Participantes Ativos</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{mediums.filter(m => m.status === 'active').length}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-800">
              <Users className="text-purple-600 dark:text-purple-400" size={24} />
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
                placeholder="Buscar evento..."
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
              <option value="all">Todos</option>
              <option value="gira">Giras</option>
              <option value="meeting">Reuniões</option>
              <option value="ceremony">Cerimônias</option>
              <option value="event">Eventos</option>
              <option value="lecture">Palestras</option>
              <option value="festivity">Festividades</option>
              <option value="external">Eventos Externos</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredEvents.length} eventos encontrados
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{event.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(event.type)}`}>
                  {getTypeLabel(event.type)}
                </span>
                <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <Users size={16} />
                  <span>{event.participants.length} participantes</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}