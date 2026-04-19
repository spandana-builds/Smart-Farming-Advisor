import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardView from './components/dashboard/DashboardView';
import AdvisorView from './components/advisor/AdvisorView';
import HistoryView from './components/history/HistoryView';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentView={currentView} />

        <main className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView onNavigate={setCurrentView} />
          )}
          {currentView === 'advisor' && (
            <AdvisorView />
          )}
          {currentView === 'history' && (
            <HistoryView />
          )}
        </main>
      </div>
    </div>
  );
}
