import React from 'react';
import { Smartphone, Monitor, ShieldCheck, Sparkles } from 'lucide-react';
import { PlatformMode } from '../types';

interface PlatformBarProps {
  platformMode: PlatformMode;
  onPlatformChange: (mode: PlatformMode) => void;
}

export const PlatformBar: React.FC<PlatformBarProps> = ({
  platformMode,
  onPlatformChange
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-200 px-3 py-2 flex flex-wrap items-center justify-between gap-2 z-40 sticky top-0 backdrop-blur-md bg-slate-900/90">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>React Native Universal</span>
        </div>
        <span className="hidden sm:inline text-xs text-slate-400 border-l border-slate-700 pl-2">
          Runs on iOS, Android &amp; Responsive Web
        </span>
      </div>

      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
        <button
          id="btn-platform-ios"
          onClick={() => onPlatformChange('ios')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
            platformMode === 'ios'
              ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Simulate iOS Native iPhone Experience"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>iOS (iPhone)</span>
        </button>

        <button
          id="btn-platform-android"
          onClick={() => onPlatformChange('android')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
            platformMode === 'android'
              ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Simulate Android Pixel Native Experience"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android</span>
        </button>

        <button
          id="btn-platform-web"
          onClick={() => onPlatformChange('web')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-all font-medium ${
            platformMode === 'web'
              ? 'bg-emerald-500 text-slate-950 shadow-sm font-semibold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Full Responsive Web Mode"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Web View</span>
        </button>
      </div>

      <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Vetted Trainers • Stripe Secured</span>
      </div>
    </header>
  );
};
