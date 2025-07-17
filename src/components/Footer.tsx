import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Desenvolvido por{' '}
          <a 
            href="https://pedroscarabelo.com.br" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
          >
            Pedro Scarabelo
          </a>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-500">
          Todos os direitos reservados 2025 versão 1.0
        </div>
      </div>
    </footer>
  );
}