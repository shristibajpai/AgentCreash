import React, { useState } from 'react';
import {
  Search,
  Plus,
  Play,
  RotateCcw,
} from 'lucide-react';
import { ScreenId, RegressionTestItem } from '../../types';
import { mockRegressionTests } from '../../data/mockData';

interface RegressionTestsProps {
  onNavigate: (screen: ScreenId, data?: any) => void;
  onSelectFailure: (failureId: string) => void;
}

export const RegressionTests: React.FC<RegressionTestsProps> = ({
  onNavigate,
  onSelectFailure,
}) => {
  const [tests, setTests] = useState<RegressionTestItem[]>(mockRegressionTests);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState('All Results');
  const [versionFilter, setVersionFilter] = useState('All Versions');
  const [runningId, setRunningId] = useState<string | null>(null);

  const filteredTests = tests.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.scenario.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sourceFailure.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesResult =
      resultFilter === 'All Results' || t.result === resultFilter;

    const matchesVersion =
      versionFilter === 'All Versions' || t.version === versionFilter;

    return matchesSearch && matchesResult && matchesVersion;
  });

  const handleRunTest = (id: string) => {
    setRunningId(id);
    setTimeout(() => {
      setTests((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              lastRun: 'Just now',
              result: 'Passed',
            };
          }
          return t;
        })
      );
      setRunningId(null);
    }, 1200);
  };

  const handleRunAll = () => {
    setRunningId('all');
    setTimeout(() => {
      setTests((prev) =>
        prev.map((t) => ({
          ...t,
          lastRun: 'Just now',
          result: 'Passed',
        }))
      );
      setRunningId(null);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Regression Tests</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage automatically generated tests from discovered failures.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAll}
            disabled={runningId === 'all'}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#18231d] hover:bg-[#1f2e26] border border-[#293d31] text-xs font-semibold text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#a4bba0] ${runningId === 'all' ? 'animate-spin' : ''}`} />
            <span>{runningId === 'all' ? 'Running Suite...' : 'Run All Tests'}</span>
          </button>

          <button
            onClick={() => onNavigate('new_test_run')}
            className="flex items-center gap-2 px-4 py-2 bg-[#5c7057] hover:bg-[#6c8366] text-white rounded-lg text-xs font-semibold shadow-md shadow-[#5c7057]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Test</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#131b16] border border-[#223026] p-3 rounded-xl flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tests..."
            className="w-full bg-[#16211a] border border-[#233128] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#829a7d]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="bg-[#16211a] border border-[#233128] rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-[#829a7d]"
          >
            <option value="All Results">All Results</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
          </select>

          <select
            value={versionFilter}
            onChange={(e) => setVersionFilter(e.target.value)}
            className="bg-[#16211a] border border-[#233128] rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-[#829a7d]"
          >
            <option value="All Versions">All Versions</option>
            <option value="v1.1">v1.1</option>
            <option value="v1.0">v1.0</option>
            <option value="v0.9">v0.9</option>
          </select>
        </div>
      </div>

      {/* Regression Tests Table */}
      <div className="bg-[#131b16] border border-[#223026] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1e2a22] bg-[#16211a] text-slate-400 font-medium">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Source Failure</th>
                <th className="py-3 px-4 font-semibold">Scenario</th>
                <th className="py-3 px-4 font-semibold">Last Run</th>
                <th className="py-3 px-4 font-semibold">Result</th>
                <th className="py-3 px-4 font-semibold">Version</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b261f]">
              {filteredTests.map((test) => {
                const isRunningThis = runningId === test.id || runningId === 'all';

                return (
                  <tr
                    key={test.id}
                    className="hover:bg-[#18231d] transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                      {test.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <button
                        onClick={() => {
                          onSelectFailure(test.sourceFailure);
                          onNavigate('failure_detail');
                        }}
                        className="text-[#a4bba0] hover:underline font-semibold"
                      >
                        {test.sourceFailure}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{test.scenario}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] tabular-nums">
                      {test.lastRun}
                    </td>
                    <td className="py-3.5 px-4">
                      {isRunningThis ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#5c7057]/30 text-[#d0e9d3] border border-[#5c7057]/40">
                          <RotateCcw className="w-3 h-3 animate-spin" />
                          <span>Running</span>
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                            test.result === 'Passed'
                              ? 'bg-[#5c7057]/20 text-[#d0e9d3] border border-[#5c7057]/35'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {test.result}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {test.version}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRunTest(test.id)}
                        disabled={isRunningThis}
                        className="px-2.5 py-1 bg-[#18231d] hover:bg-[#1f2e26] text-slate-300 hover:text-white rounded text-[11px] font-medium border border-[#293d31] transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-slate-300" />
                        <span>Run</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-[#1e2a22] flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredTests.length} tests active in continuous integration</span>
          <span className="font-mono text-[#a4bba0] text-[11px]">Target Branch: main</span>
        </div>
      </div>
    </div>
  );
};
