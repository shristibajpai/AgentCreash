import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  PlayCircle,
  AlertOctagon,
  FileCheck2,
  BarChart3,
  Settings,
  ChevronDown,
  Layers,
  Sun,
  Moon,
} from 'lucide-react';
import { ScreenId } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  failureCount?: number;
  regressionCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  failureCount = 12,
  regressionCount = 15,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const navItems = [
    {
      id: 'overview' as ScreenId,
      label: 'Overview',
      icon: LayoutDashboard,
      active: currentScreen === 'overview',
    },
    {
      id: 'projects' as any,
      label: 'Projects',
      icon: FolderGit2,
      active: false,
      onClick: () => onNavigate('overview'),
    },
    {
      id: 'new_test_run' as ScreenId,
      label: 'Test Runs',
      icon: PlayCircle,
      active:
        currentScreen === 'new_test_run' ||
        currentScreen === 'fault_config' ||
        currentScreen === 'execution_trace',
    },
    {
      id: 'failures' as ScreenId,
      label: 'Failures',
      icon: AlertOctagon,
      active:
        currentScreen === 'failures' ||
        currentScreen === 'failure_detail' ||
        currentScreen === 'fault_minimization',
      badge: failureCount,
    },
    {
      id: 'regression_tests' as ScreenId,
      label: 'Regression Tests',
      icon: FileCheck2,
      active: currentScreen === 'regression_tests',
      badge: regressionCount,
    },
    {
      id: 'benchmarks' as ScreenId,
      label: 'Benchmarks',
      icon: BarChart3,
      active: currentScreen === 'benchmarks',
    },
    {
      id: 'settings' as ScreenId,
      label: 'Settings',
      icon: Settings,
      active: currentScreen === 'settings',
    },
  ];

  return (
    <aside
      className={`w-64 border-r flex flex-col justify-between shrink-0 h-screen select-none transition-colors duration-200 ${
        isLight
          ? 'bg-white border-[#e2ebe3] text-[#17221b]'
          : 'bg-[#101713] border-[#1e2a22] text-slate-100'
      }`}
    >
      {/* Top Brand */}
      <div>
        <div
          className={`h-16 px-5 flex items-center justify-between border-b transition-colors ${
            isLight ? 'border-[#e2ebe3]' : 'border-[#1e2a22]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3e4d3a] via-[#5c7057] to-[#829a7d] flex items-center justify-center shadow-md shadow-[#5c7057]/20 text-white font-bold">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 2 22 22 22" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <div className="font-bold text-base tracking-tight flex items-center gap-1.5">
                <span className={isLight ? 'text-[#17221b]' : 'text-white'}>AgentCrash</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#5c7057]/20 text-[#4c6547] border border-[#5c7057]/30 font-semibold">
                  SAGE
                </span>
              </div>
              <p className={`text-[11px] ${isLight ? 'text-[#5f7464]' : 'text-slate-400'}`}>
                Agent Fault Injection
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isItemActive = item.active;

            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isItemActive
                    ? isLight
                      ? 'bg-[#5c7057]/15 text-[#243526] border border-[#5c7057]/35 shadow-sm font-semibold'
                      : 'bg-[#5c7057]/25 text-[#d0e9d3] border border-[#5c7057]/45 shadow-sm shadow-[#5c7057]/10'
                    : isLight
                    ? 'text-[#4e6052] hover:text-[#17221b] hover:bg-[#f0f5f1] border border-transparent'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#16211b] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isItemActive
                        ? isLight
                          ? 'text-[#455d41]'
                          : 'text-[#a4bba0]'
                        : isLight
                        ? 'text-slate-400 group-hover:text-slate-600'
                        : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono tabular-nums ${
                      isItemActive
                        ? isLight
                          ? 'bg-[#5c7057]/20 text-[#243526] font-semibold'
                          : 'bg-[#5c7057]/40 text-[#d0e9d3] font-semibold'
                        : isLight
                        ? 'bg-[#edf3ee] text-[#4e6052] border border-[#d8e4da]'
                        : 'bg-[#18231d] text-slate-400 border border-[#233128]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom workspace, theme toggle & user info */}
      <div
        className={`p-3 border-t space-y-2 transition-colors ${
          isLight ? 'border-[#e2ebe3]' : 'border-[#1e2a22]'
        }`}
      >
        {/* Workspace selector */}
        <div
          className={`px-3 py-2 transition-colors rounded-lg border cursor-pointer flex items-center justify-between text-xs ${
            isLight
              ? 'bg-[#f5f8f5] hover:bg-[#edf3ee] border-[#d8e4da]'
              : 'bg-[#141d17] hover:bg-[#19241d] border-[#233128]'
          }`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Layers className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-[#5c7057]' : 'text-[#a4bba0]'}`} />
            <div className="truncate">
              <div className={`font-medium truncate ${isLight ? 'text-[#17221b]' : 'text-slate-200'}`}>
                E-commerce Agent
              </div>
              <div className={`text-[10px] ${isLight ? 'text-[#5f7464]' : 'text-slate-400'}`}>
                Sandbox (isolated)
              </div>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </div>

        {/* User Card */}
        <div
          className={`px-3 py-2 flex items-center justify-between rounded-lg transition-colors ${
            isLight ? 'hover:bg-[#f0f5f1]' : 'hover:bg-[#16211b]'
          }`}
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#5c7057] to-[#3e4d3a] border border-[#5c7057]/40 flex items-center justify-center text-white text-xs font-semibold shadow-inner shrink-0">
              S
            </div>
            <div className="overflow-hidden">
              <div className={`text-xs font-medium truncate ${isLight ? 'text-[#17221b]' : 'text-slate-200'}`}>
                Shristi
              </div>
              <div className={`text-[10px] truncate ${isLight ? 'text-[#5f7464]' : 'text-slate-400'}`}>
                shristi@dev.com
              </div>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            title={isLight ? 'Switch to Dark View' : 'Switch to Light View'}
            className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
              isLight
                ? 'bg-[#edf3ee] border-[#d8e4da] text-[#4e6052] hover:text-[#17221b]'
                : 'bg-[#141d17] border-[#233128] text-slate-400 hover:text-white'
            }`}
          >
            {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-300" />}
          </button>
        </div>
      </div>
    </aside>
  );
};
