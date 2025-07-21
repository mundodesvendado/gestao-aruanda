import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { MasterAdminPanel } from './components/MasterAdminPanel';
import { ReadOnlyDashboard } from './components/ReadOnlyDashboard';
import { UserSettings } from './components/UserSettings';
import { MediumsManager } from './components/MediumsManager';
import { ReadOnlyMediums } from './components/ReadOnlyMediums';
import { ReadOnlySuppliers } from './components/ReadOnlySuppliers';
import { ReadOnlyFinancial } from './components/ReadOnlyFinancial';
import { ReadOnlyEvents } from './components/ReadOnlyEvents';
import { ReadOnlyNotifications } from './components/ReadOnlyNotifications';
import { ReadOnlyReports } from './components/ReadOnlyReports';
import { FinancialManager } from './components/FinancialManager';
import { EventsCalendar } from './components/EventsCalendar';
import { Settings } from './components/Settings';
import { LoginForm } from './components/LoginForm';
import { NotificationCenter } from './components/NotificationCenter';
import { Footer } from './components/Footer';
import { Reports } from './components/Reports';
import { SuppliersManager } from './components/SuppliersManager';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  const { user, isAdmin, isMasterAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    // Master admin gets special panel
    if (isMasterAdmin() && activeTab === 'dashboard') {
      return <MasterAdminPanel />;
    }
    
    switch (activeTab) {
      case 'dashboard':
        return isAdmin() ? <Dashboard /> : <ReadOnlyDashboard />;
      case 'mediums':
        return isAdmin() ? <MediumsManager /> : <ReadOnlyMediums />;
      case 'suppliers':
        return isAdmin() ? <SuppliersManager /> : <ReadOnlySuppliers />;
      case 'financial':
        return isAdmin() ? <FinancialManager /> : <ReadOnlyFinancial />;
      case 'events':
        return isAdmin() ? <EventsCalendar /> : <ReadOnlyEvents />;
      case 'notifications':
        return isAdmin() ? <NotificationCenter /> : <ReadOnlyNotifications />;
      case 'reports':
        return isAdmin() ? <Reports /> : <ReadOnlyReports />;
      case 'settings':
        return isAdmin() ? <Settings /> : <UserSettings />;
      default:
        return isAdmin() ? <Dashboard /> : <ReadOnlyDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          sidebarOpen={sidebarOpen}
        />
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'} pt-16`}>
          <div className="p-6">
            {renderContent()}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;