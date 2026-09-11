import React from 'react';
import { Wifi, Battery, Signal, ArrowLeft, Home } from 'lucide-react';
import { PlatformMode } from '../types';

interface DeviceFrameProps {
  platformMode: PlatformMode;
  children: React.ReactNode;
  onBack?: () => void;
  canGoBack?: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  platformMode,
  children,
  onBack,
  canGoBack = false
}) => {
  if (platformMode === 'web') {
    return (
      <div className="w-full min-h-[calc(100vh-50px)] bg-slate-950 text-slate-100 flex flex-col">
        {children}
      </div>
    );
  }

  const isIOS = platformMode === 'ios';

  return (
    <div className="w-full min-h-[calc(100vh-50px)] bg-slate-950 py-4 sm:py-6 px-2 flex items-center justify-center">
      {/* Device Bezel */}
      <div
        className={`relative w-full max-w-[420px] h-[840px] max-h-[92vh] bg-slate-900 border-[8px] sm:border-[10px] ${
          isIOS
            ? 'border-slate-800 rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)]'
            : 'border-slate-800 rounded-[38px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.06)]'
        } overflow-hidden flex flex-col text-slate-100 select-none`}
      >
        {/* Device Status Bar */}
        <div className="relative z-30 bg-slate-950/95 backdrop-blur-md px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-300 font-medium">
          {isIOS ? (
            <>
              {/* Dynamic Island on iOS */}
              <span className="font-semibold tracking-tight text-xs">9:41</span>
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-24 h-6 bg-black rounded-full flex items-center justify-end px-2 border border-slate-800/80 shadow-inner">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/60" />
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              </div>
            </>
          ) : (
            <>
              {/* Android Punch Hole & Status Icons */}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-slate-200">10:00</span>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-4 h-4 bg-black rounded-full border border-slate-800" />
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-[10px] font-bold tracking-wider text-emerald-400">5G</span>
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              </div>
            </>
          )}
        </div>

        {/* Device Inner Screen Container */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative bg-slate-950">
          {children}
        </div>

        {/* Device Bottom Indicator Bar */}
        <div className="bg-slate-950 px-6 py-2 flex items-center justify-center relative z-30">
          {isIOS ? (
            <div className="w-32 h-1 bg-slate-600 rounded-full hover:bg-slate-400 transition-colors" />
          ) : (
            <div className="flex items-center justify-around w-full max-w-[200px] text-slate-500 py-1">
              <button
                onClick={onBack}
                disabled={!canGoBack}
                className={`p-1 hover:text-slate-300 transition-colors ${!canGoBack ? 'opacity-30' : ''}`}
                title="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-3.5 h-3.5 rounded-full border border-slate-500" />
              <div className="w-3.5 h-3.5 rounded-sm border border-slate-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
