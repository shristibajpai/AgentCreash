import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import { ScreenId } from '../../types';
import { mockFailures } from '../../data/mockData';

interface FailureExplorerProps {
  onNavigate: (screen: ScreenId, data?: any) => void;
  onSelectFailure: (failureId: string) => void;
}

export const FailureExplorer: React.FC<FailureExplorerProps> = ({
  onNavigate,
  onSelectFailure,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('All Scenarios');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSeverity, setSelectedSeverity] = useState('All Severities');

  const filteredFailures = useMemo(() => {
    return mockFailures.filter((f) => {
      const matchesSearch =
        f.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.scenario.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesScenario =
        selectedScenario === 'All Scenarios' || f.scenario === selectedScenario;

      const matchesCategory =
        selectedCategory === 'All Categories' || f.category === selectedCategory;

      const matchesSeverity =
        selectedSeverity === 'All Severities' || f.severity === selectedSeverity;

      return matchesSearch && matchesScenario && matchesCategory && matchesSeverity;
    });
  }, [searchQuery, selectedScenario, selectedCategory, selectedSeverity]);

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Title & Description */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Failures</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Explore, reproduce and analyse discovered agent failures.
        </p>
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
            placeholder="Search failures..."
            className="w-full bg-[#16211a] border border-[#233128] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#829a7d]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Scenario filter */}
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="bg-[#16211a] border border-[#233128] rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-[#829a7d]"
          >
            <option value="All Scenarios">All Scenarios</option>
            <option value="Duplicate refund">Duplicate refund</option>
            <option value="Order not cancelled">Order not cancelled</option>
            <option value="Inventory mismatch">Inventory mismatch</option>
            <option value="Conflicting tool result">Conflicting tool result</option>
            <option value="Stale payment status">Stale payment status</option>
            <option value="Duplicate order">Duplicate order</option>
            <option value="Missing notification">Missing notification</option>
          </select>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#16211a] border border-[#233128] rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-[#829a7d]"
          >
            <option value="All Categories">All Categories</option>
            <option value="State violation">State violation</option>
            <option value="Incomplete state">Incomplete state</option>
            <option value="Data inconsistency">Data inconsistency</option>
            <option value="Tool error">Tool error</option>
            <option value="State data">State data</option>
            <option value="Side effect">Side effect</option>
          </select>

          {/* Severity filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-[#16211a] border border-[#233128] rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:border-[#829a7d]"
          >
            <option value="All Severities">All Severities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Failures Table */}
      <div className="bg-[#131b16] border border-[#223026] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1e2a22] bg-[#16211a] text-slate-400 font-medium">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-4 font-semibold">Scenario</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Severity</th>
                <th className="py-3 px-4 font-semibold">Reproduced</th>
                <th className="py-3 px-4 font-semibold">Last Observed</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b261f]">
              {filteredFailures.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => {
                    onSelectFailure(item.id);
                    onNavigate('failure_detail');
                  }}
                  className="hover:bg-[#18231d] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#a4bba0] group-hover:underline">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-200">{item.scenario}</td>
                  <td className="py-3.5 px-4 text-slate-400">{item.category}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.severity === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : item.severity === 'Medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700/40 text-slate-400 border border-slate-600/30'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {item.reproduced ? (
                      <span className="inline-flex items-center gap-1.5 text-[#a4bba0] font-mono text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#829a7d]" />
                        <span>Yes</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>No</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] tabular-nums">
                    {item.lastObserved}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFailure(item.id);
                        onNavigate('failure_detail');
                      }}
                      className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[#1a2820] transition-colors"
                      title="Inspect Failure"
                    >
                      <ChevronRight className="w-4 h-4 text-[#829a7d]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#1e2a22] flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing {filteredFailures.length} of {mockFailures.length} discovered failures
          </span>
          <span className="text-[11px] font-mono text-[#a4bba0]">
            Automated cluster analysis active
          </span>
        </div>
      </div>
    </div>
  );
};
