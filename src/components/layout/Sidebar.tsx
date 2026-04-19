import { LayoutDashboard, Sprout, History, Leaf, X, Menu } from 'lucide-react';
import { View } from '../../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navItems: { view: View; label: string; icon: typeof LayoutDashboard }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { view: 'advisor', label: 'Crop Advisor', icon: Sprout },
  { view: 'history', label: 'History', icon: History },
];

export default function Sidebar({ currentView, onViewChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-30 bg-[#0f2417] flex flex-col
          transition-transform duration-300 ease-in-out w-64
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <Leaf size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Smart Farming</p>
              <p className="text-green-400 text-xs">Advisor</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map(({ view, label, icon: Icon }) => (
            <button
              key={view}
              onClick={() => { onViewChange(view); if (window.innerWidth < 1024) onToggle(); }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200
                ${currentView === view
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'}
              `}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <div className="px-4 pb-5">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <p className="text-green-400 text-xs font-semibold mb-1">Pro Tip</p>
            <p className="text-white/60 text-xs leading-relaxed">
              Scout your fields every 5–7 days for early pest and disease detection.
            </p>
          </div>
        </div>
      </aside>

      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-40 bg-[#0f2417] text-white p-2 rounded-lg shadow-lg border border-white/10"
      >
        <Menu size={20} />
      </button>
    </>
  );
}
