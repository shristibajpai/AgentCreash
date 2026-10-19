import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Download,
} from 'lucide-react';
import { ScreenId, BenchmarkMetric } from '../../types';
import { mockBenchmarkMetrics } from '../../data/mockData';

interface BenchmarkLabProps {
  onNavigate: (screen: ScreenId, data?: any) => void;
}

export const BenchmarkLab: React.FC<BenchmarkLabProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'results' | 'config' | 'raw'>('results');
  const [dataset, setDataset] = useState('v1.0 (Order Management)');
  const [sampleSize, setSampleSize] = useState('50');
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState<BenchmarkMetric[]>(mockBenchmarkMetrics);

  const handleRunBenchmark = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setMetrics((prev) =>
        prev.map((m) => {
          if (m.method.includes('AgentCrash')) {
            return {
              ...m,
              discoveryRate: +(m.discoveryRate + 0.01).toFixed(2),
              reproductionRate: +(m.reproductionRate + 0.01).toFixed(2),
              uniqueFailures: m.uniqueFailures + 1,
              reproducedFailures: m.reproducedFailures + 1,
            };
          }
          return m;
        })
      );
    }, 1600);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Title & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Benchmark Lab</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Compare different testing strategies and evaluate agent reliability improvements.
          </p>
        </div>

        {/* Dataset & Run Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Dataset</span>
            <select
              value={dataset}
              onChange={(e) => setDataset(e.target.value)}
              className="bg-[#16211a] border border-[#233128] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#829a7d]"
            >
              <option value="v1.0 (Order Management)">v1.0 (Order Management)</option>
              <option value="v1.1 (Customer Support)">v1.1 (Customer Support)</option>
              <option value="v2.0 (Full E-comm Suite)">v2.0 (Full E-comm Suite)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={sampleSize}
              onChange={(e) => setSampleSize(e.target.value)}
              className="w-16 bg-[#16211a] border border-[#233128] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#829a7d]"
            />
          </div>

          <button
            onClick={handleRunBenchmark}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-[#5c7057] hover:bg-[#6c8366] text-white rounded-lg text-xs font-semibold shadow-md shadow-[#5c7057]/25 transition-all cursor-pointer"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                <span>Running Benchmark...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Benchmark</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#223026] flex items-center gap-6 text-xs font-medium">
        {[
          { id: 'results', label: 'Results' },
          { id: 'config', label: 'Configuration' },
          { id: 'raw', label: 'Raw Data' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 relative transition-colors ${
              activeTab === tab.id
                ? 'text-[#a4bba0] font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5c7057]" />
            )}
          </button>
        ))}
      </div>

      {/* Main Grid: Failure Discovery Rate chart (Left) & Comparison Metrics (Right) */}
      {activeTab === 'results' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Failure Discovery Rate Bar Chart (6 cols) */}
          <div className="lg:col-span-6 bg-[#131b16] border border-[#223026] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Failure Discovery Rate</h3>
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#5c7057]"></span>
                  <span>Unique Failures</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#a4bba0]"></span>
                  <span>Reproduced Failures</span>
                </div>
              </div>
            </div>

            {/* Custom Bar Chart Canvas in Sage Palette */}
            <div className="pt-6 pb-2 px-2">
              <div className="h-64 flex items-end justify-around gap-4 border-b border-[#233128] pb-2">
                {metrics.map((m, idx) => {
                  const maxEvents = 25;
                  const h1 = (m.uniqueFailures / maxEvents) * 200;
                  const h2 = (m.reproducedFailures / maxEvents) * 200;

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-[#0d1310] border border-[#2e4337] px-2 py-1 rounded text-[10px] text-white z-20 whitespace-nowrap shadow-md pointer-events-none">
                        {m.method}: {m.uniqueFailures} unique / {m.reproducedFailures} repro
                      </div>

                      <div className="w-full flex items-end justify-center gap-1.5">
                        <div
                          style={{ height: `${h1}px` }}
                          className="w-5 sm:w-7 bg-[#5c7057] rounded-t transition-all group-hover:bg-[#6c8366]"
                        />
                        <div
                          style={{ height: `${h2}px` }}
                          className="w-5 sm:w-7 bg-[#a4bba0] rounded-t transition-all group-hover:bg-[#d0e9d3]"
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 text-center font-medium line-clamp-2 max-w-[90px]">
                        {m.method}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Y Axis Scale */}
              <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
                <span>25</span>
              </div>
            </div>
          </div>

          {/* Right: Comparison Metrics Table (6 cols) */}
          <div className="lg:col-span-6 bg-[#131b16] border border-[#223026] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Comparison Metrics</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1e2a22] text-slate-400 font-medium">
                    <th className="pb-3 font-semibold">Method</th>
                    <th className="pb-3 font-semibold text-right">Discovery Rate</th>
                    <th className="pb-3 font-semibold text-right">Reproduction Rate</th>
                    <th className="pb-3 font-semibold text-right">Avg. Execution Time</th>
                    <th className="pb-3 font-semibold text-right">Avg. Cost (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b261f]">
                  {metrics.map((row, idx) => {
                    const isAgentCrash = row.method.includes('AgentCrash');

                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          isAgentCrash
                            ? 'bg-[#5c7057]/20 font-semibold text-white'
                            : 'text-slate-300 hover:bg-[#18231d]'
                        }`}
                      >
                        <td className="py-3">
                          <span className={isAgentCrash ? 'text-[#d0e9d3] font-bold' : ''}>
                            {row.method}
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono tabular-nums">
                          {row.discoveryRate.toFixed(2)}
                        </td>
                        <td className="py-3 text-right font-mono tabular-nums">
                          {row.reproductionRate.toFixed(2)}
                        </td>
                        <td className="py-3 text-right font-mono tabular-nums text-slate-400">
                          {row.avgExecutionTime}
                        </td>
                        <td className="py-3 text-right font-mono tabular-nums text-slate-400">
                          ${row.avgCostUSD}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-[#16211a] border border-[#233128] rounded-lg text-xs space-y-1">
              <div className="text-[#a4bba0] font-medium">Key Takeaway</div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                AgentCrash sequence minimization achieves a{' '}
                <span className="text-[#d0e9d3] font-semibold">+39% increase</span> in failure
                discovery rate and <span className="text-[#a4bba0] font-semibold">89%</span>{' '}
                deterministic reproduction success compared to naive random testing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Configuration */}
      {activeTab === 'config' && (
        <div className="bg-[#131b16] border border-[#223026] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Benchmark Runner Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#16211a] p-3 rounded-lg border border-[#233128]">
              <div className="text-slate-500">Search Strategy</div>
              <div className="text-white font-medium mt-1">Hierarchical Delta-Debugging (DDMin)</div>
            </div>
            <div className="bg-[#16211a] p-3 rounded-lg border border-[#233128]">
              <div className="text-slate-500">Max Iterations per Run</div>
              <div className="text-white font-medium mt-1">50 iterations</div>
            </div>
            <div className="bg-[#16211a] p-3 rounded-lg border border-[#233128]">
              <div className="text-slate-500">Concurrency</div>
              <div className="text-white font-medium mt-1">4 parallel sandboxes</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Raw Data */}
      {activeTab === 'raw' && (
        <div className="bg-[#131b16] border border-[#223026] rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Raw JSON Experiment Outputs</h3>
            <button
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(metrics, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `benchmark_results.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              className="text-xs text-[#a4bba0] hover:text-[#d0e9d3] font-medium flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
          <pre className="bg-[#0e1411] p-4 rounded-lg font-mono text-xs text-[#a4bba0] overflow-x-auto">
            {JSON.stringify(metrics, null, 2)}
          </pre>
        </div>
      )}

      {/* Disclaimer Note */}
      <div className="text-[11px] text-slate-500 font-mono italic">
        Note: Demo data for illustrative purposes. Replace with actual experiment results when backend is connected.
      </div>
    </div>
  );
};
