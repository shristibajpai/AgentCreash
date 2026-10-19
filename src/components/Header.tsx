import React from 'react';
import {
  Calendar,
  ChevronRight,
  Sun,
  Moon,
  Settings,
} from 'lucide-react';
import { ScreenId } from '../types';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  breadcrumbs?: { label: string; screen?: ScreenId }[];
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  breadcrumbs = [],
}) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const screensList: { id: ScreenId; num: string; label: string }[] = [
    { id: 'overview', num: '1', label: 'Overview' },
    { id: 'new_test_run', num: '2', label: 'New Run' },
    { id: 'fault_config', num: '2.b', label: 'Fault Config' },
    { id: 'execution_trace', num: '3', label: 'Trace' },
    { id: 'failures', num: '4', label: 'Failures' },
    { id: 'failure_detail', num: '5', label: 'Detail' },
    { id: 'fault_minimization', num: '6', label: 'Minimization' },
    { id: 'regression_tests', num: '7', label: 'Regression' },
    { id: 'benchmarks', num: '8', label: 'Benchmark' },
  ];

  return (
    <header
      className={`h-14 backdrop-blur-md border-b px-6 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors duration-200 ${
        isLight
          ? 'bg-white/90 border-[#dbe6dc] text-[#17221b]'
          : 'bg-[#101713]/90 border-[#1e2a22] text-slate-100'
      }`}
    >
      {/* Left zone: Breadcrumb */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => onNavigate('overview')}
          className={`transition-colors font-medium flex items-center gap-1.5 ${
            isLight
              ? 'text-[#4e6052] hover:text-[#17221b]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>AgentCrash</span>
        </button>

        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight
              className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-600'}`}
            />
            {crumb.screen ? (
              <button
                onClick={() => onNavigate(crumb.screen!)}
                className={`transition-colors font-medium ${
                  isLight
                    ? 'text-[#4e6052] hover:text-[#17221b]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {crumb.label}
              </button>
            ) : (
              <span className={`font-semibold ${isLight ? 'text-[#17221b]' : 'text-slate-200'}`}>
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Center zone: Screen Switcher Showcase (1 to 8 as per design sheet) */}
      <div
        className={`hidden lg:flex items-center p-1 rounded-lg border transition-colors ${
          isLight
            ? 'bg-[#edf3ee] border-[#d8e4da]'
            : 'bg-[#131c16] border-[#233128]'
        }`}
      >
        <span
          className={`text-[10px] uppercase font-mono px-2 py-0.5 tracking-wider ${
            isLight ? 'text-[#5f7464]' : 'text-slate-500'
          }`}
        >
          Views:
        </span>
        <div className="flex items-center gap-0.5">
          {screensList.map((s) => {
            const isActive = currentScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onNavigate(s.id)}
                title={`${s.num}. ${s.label}`}
                className={`px-2 py-1 rounded text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-[#5c7057] text-white shadow-sm font-semibold'
                    : isLight
                    ? 'text-[#4e6052] hover:text-[#17221b] hover:bg-[#dbe6dc]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a251e]'
                }`}
              >
                <span className="font-mono text-[10px] opacity-75">{s.num}.</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right zone: Environment status, Theme Mode Toggle & Settings */}
      <div className="flex items-center gap-2.5">
        {/* Light / Dark Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${isLight ? 'Dark' : 'Light'} view`}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
            isLight
              ? 'bg-[#edf3ee] border-[#d8e4da] text-[#2c3d2e] hover:bg-[#e2ebe4] shadow-sm'
              : 'bg-[#141d17] border-[#233128] text-slate-300 hover:text-white hover:bg-[#1a251e]'
          }`}
        >
          {isLight ? (
            <>
              <Moon className="w-3.5 h-3.5 text-[#5c7057]" />
              <span className="hidden sm:inline font-mono text-[11px]">Dark View</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline font-mono text-[11px]">Light View</span>
            </>
          )}
        </button>

        {/* Palette Theme Badge */}
        <div
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs ${
            isLight
              ? 'bg-[#edf3ee] border-[#d8e4da]'
              : 'bg-[#141d17] border-[#233128]'
          }`}
        >
          <span className="w-3 h-3 rounded-full bg-[#5c7057] border border-[#829a7d]/40"></span>
          <span
            className={`font-mono text-[11px] font-medium ${
              isLight ? 'text-[#384d34]' : 'text-[#a4bba0]'
            }`}
          >
            #5C7057 Sage
          </span>
        </div>

        <div
          className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs ${
            isLight
              ? 'bg-[#edf3ee] border-[#d8e4da] text-[#2c3d2e]'
              : 'bg-[#141d17] border-[#233128] text-slate-300'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#5c7057] animate-pulse"></span>
          <span className={`font-mono text-[11px] ${isLight ? 'text-[#384d34]' : 'text-[#d0e9d3]'}`}>
            Sandbox Ready
          </span>
        </div>

        <div
          className={`hidden xl:flex items-center gap-2 text-xs border px-2.5 py-1 rounded-md ${
            isLight
              ? 'bg-[#edf3ee] border-[#d8e4da] text-[#4e6052]'
              : 'bg-[#141d17] border-[#233128] text-slate-400'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className={`font-mono text-[11px] ${isLight ? 'text-[#2c3d2e]' : 'text-slate-300'}`}>
            1 Oct – 26 Oct, 2026
          </span>
        </div>

        {/* Settings button in header */}
        <button
          onClick={() => onNavigate('settings')}
          title="Open Settings"
          className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
            currentScreen === 'settings'
              ? 'bg-[#5c7057] text-white border-[#5c7057]'
              : isLight
              ? 'bg-[#edf3ee] border-[#d8e4da] text-[#4e6052] hover:text-[#17221b] hover:bg-[#dbe6dc]'
              : 'bg-[#141d17] border-[#233128] text-slate-400 hover:text-white hover:bg-[#1a251e]'
          }`}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
