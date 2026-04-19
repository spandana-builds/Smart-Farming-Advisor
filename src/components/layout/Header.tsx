import { Bell, RefreshCw } from 'lucide-react';
import { View } from '../../types';

const titles: Record<View, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Overview of your farming conditions' },
  advisor: { title: 'Crop Advisor', subtitle: 'Get personalized farming recommendations' },
  history: { title: 'Session History', subtitle: 'Review your past advisory sessions' },
};

interface HeaderProps {
  currentView: View;
  onRefresh?: () => void;
}

export default function Header({ currentView, onRefresh }: HeaderProps) {
  const { title, subtitle } = titles[currentView];
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden md:block text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          {dateStr}
        </span>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        )}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
