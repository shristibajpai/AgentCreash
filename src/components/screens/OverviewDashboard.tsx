import React from 'react';
import {
  Plus,
  ChevronRight,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { ScreenId } from '../../types';
import { mockTestRuns, mockFailures, mockFailureTrendDays } from '../../data/mockData';

interface OverviewDashboardProps {
  onNavigate: (screen: ScreenId, data?: any) => void;
  onSelectRun: (runId: string) => void;
  onSelectFailure: (failureId: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigate,
  onSelectRun,
  onSelectFailure,
}) => {
  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Test. Break. Understand. Build reliable AI agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#131c16] border border-[#233128] rounded-lg text-xs text-slate-300 font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>1 Oct, 2026 – 26 Oct, 2026</span>
          </div>

          <button
            onClick={() => onNavigate('new_test_run')}
            className="flex items-center gap-2 px-4 py-2 bg-[#5c7057] hover:bg-[#6c8366] text-white rounded-lg text-xs font-semibold shadow-md shadow-[#5c7057]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Test Run</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Runs */}
        <div className="p-5 rounded-xl bg-[#131b16] border border-[#223026] hover:border-[#35483b] transition-colors">
          <div className="text-xs text-slate-400 font-medium">Total Runs</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono tabular-nums">48</span>
            <span className="text-xs font-medium text-[#a4bba0] flex items-center gap-0.5">
              <span>↑</span> 12%
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Across 3 agent environments</div>
        </div>

        {/* Unique Failures */}
        <div className="p-5 rounded-xl bg-[#131b16] border border-[#223026] hover:border-[#35483b] transition-colors">
          <div className="text-xs text-slate-400 font-medium">Unique Failures</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono tabular-nums">12</span>
            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/25">
              3 new
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">4 state violations, 5 tool errors</div>
        </div>

        {/* Reproduced */}
        <div className="p-5 rounded-xl bg-[#131b16] border border-[#223026] hover:border-[#35483b] transition-colors">
          <div className="text-xs text-slate-400 font-medium">Reproduced</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono tabular-nums">9</span>
            <span className="text-xs font-medium text-[#829a7d]">75% success</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Deterministic fault reproduction</div>
        </div>

        {/* Regression Tests */}
        <div className="p-5 rounded-xl bg-[#131b16] border border-[#223026] hover:border-[#35483b] transition-colors">
          <div className="text-xs text-slate-400 font-medium">Regression Tests</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono tabular-nums">15</span>
            <span className="text-xs font-medium text-[#a4bba0]">4 this week</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">Automated guards active in CI</div>
        </div>
      </div>

      {/* Main Content Grid: Recent Test Runs & Failure Trend / Recent Failures */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recent Test Runs Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#131b16] border border-[#223026] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Recent Test Runs</h2>
              <button
                onClick={() => onNavigate('new_test_run')}
                className="text-xs text-[#a4bba0] hover:text-[#d0e9d3] font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1e2a22] text-slate-400 font-medium">
                    <th className="pb-3 font-semibold">Run ID</th>
                    <th className="pb-3 font-semibold">Scenario</th>
                    <th className="pb-3 font-semibold">Fault</th>
                    <th className="pb-3 font-semibold">Result</th>
                    <th className="pb-3 font-semibold">Duration</th>
                    <th className="pb-3 font-semibold text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b261f]">
                  {mockTestRuns.map((run) => (
                    <tr
                      key={run.id}
                      onClick={() => {
                        onSelectRun(run.id);
                        onNavigate('execution_trace');
                      }}
                      className="hover:bg-[#18231d] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 font-mono text-[#a4bba0] font-semibold group-hover:underline">
                        {run.id}
                      </td>
                      <td className="py-3 text-slate-200">{run.scenario}</td>
                      <td className="py-3 text-slate-400">{run.fault}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium font-mono ${
                            run.result === 'Failed'
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/25'
                              : 'bg-[#5c7057]/20 text-[#d0e9d3] border border-[#5c7057]/40'
                          }`}
                        >
                          {run.result}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-slate-400 tabular-nums">{run.duration}</td>
                      <td className="py-3 text-slate-400 text-right font-mono text-[11px]">
                        {run.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1e2a22] flex items-center justify-between text-xs text-slate-400">
            <span>Showing 5 of 48 total runs</span>
            <button
              onClick={() => onNavigate('new_test_run')}
              className="text-[#a4bba0] hover:text-[#d0e9d3] font-medium flex items-center gap-1"
            >
              <span>Configure new test scenario</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Failure Trend & Recent Failures (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Failure Trend Bar Chart with Sage (#5C7057) & Pale Mint (#A4BBA0) */}
          <div className="bg-[#131b16] border border-[#223026] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">Failure Trend</h2>
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#5c7057]"></span>
                  <span>Unique Failures</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#a4bba0]"></span>
                  <span>Reproduced</span>
                </div>
              </div>
            </div>

            {/* Simulated bar chart representation */}
            <div className="h-32 flex items-end justify-between gap-1.5 pt-4 px-1">
              {mockFailureTrendDays.map((item, idx) => {
                const maxVal = 10;
                const h1 = (item.unique / maxVal) * 90;
                const h2 = (item.reproduced / maxVal) * 90;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-[#0d1310] border border-[#2e4337] px-2 py-1 rounded text-[10px] text-white z-20 whitespace-nowrap shadow-md pointer-events-none">
                      Oct {item.day}: {item.unique} fails, {item.reproduced} repro
                    </div>

                    <div className="w-full flex items-end justify-center gap-0.5">
                      <div
                        style={{ height: `${h1}px` }}
                        className="w-1.5 sm:w-2 bg-[#5c7057] rounded-t transition-all group-hover:bg-[#6c8366]"
                      />
                      <div
                        style={{ height: `${h2}px` }}
                        className="w-1.5 sm:w-2 bg-[#a4bba0] rounded-t transition-all group-hover:bg-[#d0e9d3]"
                      />
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Failures List */}
          <div className="bg-[#131b16] border border-[#223026] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">Recent Failures</h2>
              <button
                onClick={() => onNavigate('failures')}
                className="text-xs text-[#a4bba0] hover:text-[#d0e9d3] font-medium"
              >
                View all &gt;
              </button>
            </div>

            <div className="space-y-2">
              {mockFailures.slice(0, 4).map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    onSelectFailure(f.id);
                    onNavigate('failure_detail');
                  }}
                  className="p-3 bg-[#16211a] hover:bg-[#1c2a21] border border-[#233128] rounded-lg flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-[#a4bba0]">
                      {f.id}
                    </span>
                    <div>
                      <div className="text-xs font-medium text-slate-200 group-hover:text-white">
                        {f.scenario}
                      </div>
                      <div className="text-[10px] text-slate-400">{f.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        f.severity === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {f.severity}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
