import React, { useState } from 'react';
import {
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  Check,
  ArrowRight,
  Minimize2,
} from 'lucide-react';
import { ScreenId } from '../../types';
import {
  mockOriginalMinimizationEvents,
  mockMinimizationAttempts,
  mockMinimizedEvents,
} from '../../data/mockData';

interface FaultMinimizationProps {
  failureId?: string;
  onNavigate: (screen: ScreenId, data?: any) => void;
}

export const FaultMinimization: React.FC<FaultMinimizationProps> = ({
  failureId = '#F-021',
  onNavigate,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeAttemptIndex, setActiveAttemptIndex] = useState(mockMinimizationAttempts.length);

  const startMinimization = () => {
    setIsRunning(true);
    setActiveAttemptIndex(1);

    const interval = setInterval(() => {
      setActiveAttemptIndex((prev) => {
        if (prev >= mockMinimizationAttempts.length) {
          clearInterval(interval);
          setIsRunning(false);
          return mockMinimizationAttempts.length;
        }
        return prev + 1;
      });
    }, 450);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <button
              onClick={() => onNavigate('failures')}
              className="hover:text-slate-300 transition-colors"
            >
              Failures
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button
              onClick={() => onNavigate('failure_detail')}
              className="hover:text-slate-300 transition-colors"
            >
              {failureId}
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-300">Fault Minimization</span>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">
            Fault Sequence Minimization
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Reduce the failing sequence to the smallest reproducible set of fault events.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={startMinimization}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-[#5c7057] hover:bg-[#6c8366] text-white rounded-lg text-xs font-semibold shadow-md shadow-[#5c7057]/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          {isRunning ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Minimizing (Attempt {activeAttemptIndex}/7)...</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-4 h-4" />
              <span>Run Minimization</span>
            </>
          )}
        </button>
      </div>

      {/* 3-Column Layout: Original -> Process -> Minimized */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Original Sequence (8 events) - 4 cols */}
        <div className="lg:col-span-4 bg-[#131b16] border border-[#223026] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e2a22]">
            <h3 className="text-sm font-semibold text-white">Original Sequence</h3>
            <span className="text-xs font-mono text-slate-400">8 events</span>
          </div>

          <div className="space-y-2">
            {mockOriginalMinimizationEvents.map((evt) => {
              const isKeptInFinal = evt.retained;

              return (
                <div
                  key={evt.id}
                  className={`p-3 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                    isKeptInFinal
                      ? 'bg-[#18261e] border-[#5c7057]/50 text-white'
                      : 'bg-[#141d17] border-[#233128] text-slate-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-[#1b271f] border border-[#2e4135] font-mono text-[11px] flex items-center justify-center font-semibold text-[#a4bba0]">
                      {evt.id}
                    </span>
                    <div>
                      <div className="font-medium text-slate-200">{evt.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">({evt.target})</div>
                    </div>
                  </div>

                  {isKeptInFinal ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#5c7057]/30 text-[#d0e9d3] font-mono">
                      kept
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-600 font-mono">pruned</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Minimization Process Table (4 cols) */}
        <div className="lg:col-span-4 bg-[#131b16] border border-[#223026] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e2a22]">
            <h3 className="text-sm font-semibold text-white">Minimization Process</h3>
            <span className="text-xs font-mono text-slate-400">Delta Debugging</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#1e2a22] text-slate-400 font-medium">
                  <th className="pb-2.5 font-semibold">Attempt</th>
                  <th className="pb-2.5 font-semibold">Removed Event</th>
                  <th className="pb-2.5 font-semibold text-right">Reproduced?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b261f]">
                {mockMinimizationAttempts.slice(0, activeAttemptIndex).map((att) => (
                  <tr key={att.attempt} className="hover:bg-[#18231d] transition-colors">
                    <td className="py-2.5 font-mono text-slate-400">{att.attempt}</td>
                    <td className="py-2.5 font-mono text-slate-200">{att.removedEvent}</td>
                    <td className="py-2.5 text-right">
                      {att.reproduced ? (
                        <span className="inline-flex items-center gap-1 text-[#a4bba0] font-mono text-[11px]">
                          <Check className="w-3.5 h-3.5 text-[#829a7d]" />
                          <span>Yes</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                          <span>No</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isRunning && (
            <div className="p-3 bg-[#19271e] border border-[#5c7057]/40 rounded-lg text-xs text-[#d0e9d3] font-mono animate-pulse">
              Testing candidate fault partition...
            </div>
          )}
        </div>

        {/* Column 3: Minimized Sequence & Result Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#131b16] border border-[#223026] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e2a22]">
              <h3 className="text-sm font-semibold text-white">Minimized Sequence</h3>
              <span className="text-xs font-mono text-[#a4bba0] font-semibold">4 events</span>
            </div>

            <div className="space-y-2">
              {mockMinimizedEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#18261e] border border-[#5c7057]/40 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-[#5c7057]/30 text-[#d0e9d3] font-mono text-[11px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-white">{evt.name}</div>
                      <div className="text-[10px] text-[#a4bba0] font-mono">({evt.target})</div>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#829a7d]" />
                </div>
              ))}
            </div>
          </div>

          {/* Result Card in Sage Green Accent */}
          <div className="bg-[#14231b] border border-[#5c7057]/50 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#a4bba0] font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#829a7d]" />
              <span>Result</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="text-[#d0e9d3] font-medium leading-relaxed">
                Failure reproduced with 4 events (50% reduction).
              </div>
              <div className="text-[#a4bba0]/90 font-mono text-[11px]">
                Reproduction rate: <span className="font-bold text-[#d0e9d3]">100%</span> (10/10 runs)
              </div>
            </div>

            <button
              onClick={() => onNavigate('regression_tests')}
              className="mt-2 w-full py-2 bg-[#5c7057] hover:bg-[#6c8366] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Convert to Regression Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
