import React from 'react';
import { Search, ShieldCheck, CreditCard, MessageSquare, ShieldAlert, Dumbbell } from 'lucide-react';
import { AppTab, PlatformMode } from '../types';

interface NavigationProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  platformMode: PlatformMode;
  unreadCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  platformMode,
  unreadCount
}) => {
  const tabs: { id: AppTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'search', label: 'Find Trainers', icon: Search },
    { id: 'vetting', label: 'How We Vet', icon: ShieldCheck },
    { id: 'plans', label: 'Plans & Pricing', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'admin', label: 'Admin', icon: ShieldAlert }
  ];

  if (platformMode === 'web') {
    return (
      <nav className="w-full bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3 sticky top-[49px] z-30 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => onSelectTab('search')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                BookATrainer
              </span>
              <span className="hidden sm:block text-[11px] text-slate-400 leading-none">
                In-Home &amp; Gym Fitness Coaches
              </span>
            </div>
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`web-nav-tab-${tab.id}`}
                  onClick={() => onSelectTab(tab.id)}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.id === 'messages' && unreadCount > 0 && (
                    <span
                      className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-slate-950 text-white' : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    );
  }

  // Mobile Bottom Tab Bar (iOS and Android)
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/90 px-1 py-1 flex items-center justify-around">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`mobile-nav-tab-${tab.id}`}
            onClick={() => onSelectTab(tab.id)}
            className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all ${
              isActive
                ? 'text-emerald-400 font-semibold scale-102'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              {tab.id === 'messages' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-extrabold flex items-center justify-center shadow">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight text-center truncate max-w-[68px]">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
