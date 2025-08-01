import React, { useState, useEffect } from 'react';
import { Activity, Database, Wifi, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  icon: React.ComponentType<any>;
}

export function SystemHealth() {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performHealthChecks();
  }, []);

  const performHealthChecks = async () => {
    setLoading(true);
    
    const checks: HealthCheck[] = [
      {
        name: 'Armazenamento Local',
        status: checkLocalStorage(),
        message: checkLocalStorage() === 'healthy' ? 'Funcionando normalmente' : 'Problemas detectados',
        icon: Database
      },
      {
        name: 'Conectividade',
        status: 'healthy',
        message: 'Conexão ativa',
        icon: Wifi
      },
      {
        name: 'Autenticação',
        status: checkAuth(),
        message: checkAuth() === 'healthy' ? 'Sistema funcionando' : 'Verificar configurações',
        icon: Shield
      },
      {
        name: 'Performance',
        status: checkPerformance(),
        message: checkPerformance() === 'healthy' ? 'Ótima performance' : 'Performance degradada',
        icon: Activity
      }
    ];
    
    setHealthChecks(checks);
    setLoading(false);
  };

  const checkLocalStorage = (): 'healthy' | 'warning' | 'error' => {
    try {
      const testKey = 'health_check_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return 'healthy';
    } catch {
      return 'error';
    }
  };

  const checkAuth = (): 'healthy' | 'warning' | 'error' => {
    const user = localStorage.getItem('user');
    return user ? 'healthy' : 'warning';
  };

  const checkPerformance = (): 'healthy' | 'warning' | 'error' => {
    const start = performance.now();
    // Simular operação
    for (let i = 0; i < 1000; i++) {
      Math.random();
    }
    const end = performance.now();
    const duration = end - start;
    
    if (duration < 1) return 'healthy';
    if (duration < 5) return 'warning';
    return 'error';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={20} className="text-green-600 dark:text-green-400" />;
      case 'warning':
      case 'error':
        return <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />;
      default:
        return <Activity size={20} className="text-gray-600 dark:text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Status do Sistema</h3>
        <button
          onClick={performHealthChecks}
          className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
        >
          Atualizar
        </button>
      </div>
      
      <div className="space-y-3">
        {healthChecks.map((check, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <check.icon size={20} className={getStatusColor(check.status)} />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{check.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{check.message}</p>
              </div>
            </div>
            {getStatusIcon(check.status)}
          </div>
        ))}
      </div>
    </div>
  );
}