import React, { useState } from 'react';
import {
  ChevronRight,
  RotateCcw,
  Sparkles,
  FileCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { ScreenId } from '../../types';
import { mockFailures } from '../../data/mockData';

interface FailureDetailProps {
  failureId?: string;
  onNavigate: (screen: ScreenId, data?: any) => void;
  onSelectRun?: (runId: string) => void;
  onGenerateRegression?: (failureId: string) => void;
}

export const FailureDetail: React.FC<FailureDetailProps> = ({
  failureId = '#F-021',
  onNavigate,
  onSelectRun,
  onGenerateRegression,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'trace' | 'state_diff' | 'reproduction' | 'test'>('summary');
  const [isResolved, setIsResolved] = useState(false);
  const [isReproducing, setIsReproducing] = useState(false);
  const [reproOutput, setReproOutput] = useState<string | null>(null);

  const failure = mockFailures.find((f) => f.id === failureId) || mockFailures[0];

  const handleReproduce = () => {
    setIsReproducing(true);
    setReproOutput(null);
    setTimeout(() => {
      setIsReproducing(false);
      setReproOutput('Failure deterministically reproduced with exit code 1 (State invariant assertion failed).');
    }, 1200);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
          <button
            onClick={() => onNavigate('failures')}
            className="hover:text-slate-300 transition-colors"
          >
            Failures
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-300">{failure.id}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">Failure {failure.id}</h1>
          <span
            className={`text-xs px-2.5 py-0.5 rounded font-mono font-semibold ${
              failure.severity === 'High'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {failure.severity}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded font-mono font-medium bg-[#5c7057]/20 text-[#d0e9d3] border border-[#5c7057]/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#829a7d]" />
            <span>Reproduced</span>
          </span>
          {isResolved && (
            <span className="text-xs px-2.5 py-0.5 rounded font-mono font-medium bg-[#5c7057]/30 text-[#d0e9d3] border border-[#5c7057]/50">
              Resolved in PR #42
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Duplicate refund created during payment recovery
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#223026] flex items-center gap-6 text-xs font-medium">
        {[
          { id: 'summary', label: 'Summary' },
          { id: 'trace', label: 'Execution Trace' },
          { id: 'state_diff', label: 'State Difference' },
          { id: 'reproduction', label: 'Reproduction' },
          { id: 'test', label: 'Generated Test' },
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

      {/* Grid: Details Left (8 cols) and Actions Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'summary' && (
            <>
              {/* Overview Metadata Grid */}
              <div className="bg-[#131b16] border border-[#223026] rounded-xl p-5">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-4">
                  Overview
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-slate-500 text-[11px]">Scenario</div>
                    <div className="text-slate-200 font-medium mt-0.5">{failure.scenario}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[11px]">Category</div>
                    <div className="text-slate-200 font-medium mt-0.5">{failure.category}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[11px]">Severity</div>
                    <div className="text-rose-400 font-medium mt-0.5">{failure.severity}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[11px]">Reproduction Status</div>
                    <div className="text-[#a4bba0] font-medium mt-0.5">Reproduced</div>
                  </div>

                  <div>
                    <div className="text-slate-500 text-[11px]">First Observed</div>
                    <div className="text-slate-300 font-mono text-[11px] mt-0.5">
                      {failure.firstObserved}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[11px]">Last Reproduced</div>
                    <div className="text-slate-300 font-mono text-[11px] mt-0.5">
                      {failure.lastReproduced}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[11px]">Linked Run</div>
                    <button
                      onClick={() => {
                        if (onSelectRun) onSelectRun(failure.linkedRun);
                        onNavigate('execution_trace');
                      }}
                      className="text-[#a4bba0] hover:underline font-mono text-[11px] mt-0.5 block"
                    >
                      {failure.linkedRun}
                    </button>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[11px]">Affected Tools</div>
                    <div className="text-slate-200 font-mono text-[11px] mt-0.5">
                      {failure.affectedTools.join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#131b16] border border-[#223026] rounded-xl p-5">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-2">
                  Description
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">{failure.description}</p>
              </div>

              {/* Root Cause Hypothesis */}
              <div className="bg-[#131b16] border border-[#223026] rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                  Root Cause Hypothesis
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {failure.rootCauses.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#829a7d] mt-1.5 shrink-0" />
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {activeTab === 'trace' && (
            <div className="bg-[#131b16] border border-[#223026] rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Execution Trace Quickview</h3>
                <button
                  onClick={() => onNavigate('execution_trace')}
                  className="text-xs text-[#a4bba0] hover:text-[#d0e9d3] font-medium flex items-center gap-1"
                >
                  <span>Open Full Trace Viewer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3 bg-[#0e1411] rounded-lg font-mono text-xs text-slate-300 space-y-1">
                <div>[Step 1] Parse customer request — 0.5s Passed</div>
                <div>[Step 2] Fetch order details — 1.2s Passed</div>
                <div>[Step 3] Cancel order — 1.1s Passed</div>
                <div className="text-rose-400 font-semibold">[Step 4] Call payment API — 30.0s Failed (Timeout)</div>
                <div className="text-rose-400 font-semibold">[Step 5] Retry payment API — 5.1s Failed (Conflict: Duplicate Refund)</div>
                <div>[Step 6] Update order status — 1.3s Passed</div>
                <div>[Step 7] Send confirmation — 0.8s Passed</div>
              </div>
            </div>
          )}

          {activeTab === 'state_diff' && (
            <div className="bg-[#131b16] border border-[#223026] rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white">Corrupted State Inspection</h3>
              <p className="text-xs text-slate-400">
                Payment API returned 504 Timeout on first call. Agent unrolled a new payment attempt
                without checking gateway ledger, creating un-reconciled secondary refund ID.
              </p>
              <div className="bg-[#0e1411] p-3 rounded-lg font-mono text-xs text-rose-300">
                + refund_transaction_2: "rf_dup_9918" [UNAUTHORIZED]
                <br />- expected: single refund receipt for ORD-2381
              </div>
            </div>
          )}

          {activeTab === 'reproduction' && (
            <div className="bg-[#131b16] border border-[#223026] rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white">Deterministic Reproduction Script</h3>
              <div className="bg-[#0e1411] p-3 rounded-lg font-mono text-xs text-[#a4bba0] overflow-x-auto">
{`# Execute reproducible harness in sandbox
agentcrash repro --failure-id ${failure.id} --env sandbox --seed 42109`}
              </div>
            </div>
          )}

          {activeTab === 'test' && (
            <div className="bg-[#131b16] border border-[#223026] rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-white">Generated PyTest / Jest Invariant</h3>
              <pre className="bg-[#0e1411] p-3 rounded-lg font-mono text-xs text-[#d0e9d3] overflow-x-auto">
{`@pytest.mark.agentcrash
def test_duplicate_refund_prevention():
    agent = OrderManagementAgent(env="sandbox")
    agent.inject_fault(target="payment_api", type="timeout", duration=30)
    result = agent.execute_scenario("refund_order", order_id="ORD-2381")
    
    assert result.refunds_issued_count <= 1
    assert result.order_status == "CANCELLED"`}
              </pre>
            </div>
          )}
        </div>

        {/* Right Column: Actions & Related Runs */}
        <div className="lg:col-span-4 space-y-6">
          {/* Actions Panel */}
          <div className="bg-[#131b16] border border-[#223026] rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Actions
            </h3>

            <div className="space-y-2">
              <button
                onClick={handleReproduce}
                disabled={isReproducing}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5c7057] hover:bg-[#6c8366] text-white rounded-lg text-xs font-semibold shadow-md shadow-[#5c7057]/25 transition-all cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isReproducing ? 'animate-spin' : ''}`} />
                <span>{isReproducing ? 'Simulating Repro...' : 'Reproduce Failure'}</span>
              </button>

              <button
                onClick={() => onNavigate('fault_minimization')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#18231d] hover:bg-[#1f2e26] border border-[#293d31] text-xs font-semibold text-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#a4bba0]" />
                <span>Run Minimization</span>
              </button>

              <button
                onClick={() => {
                  if (onGenerateRegression) onGenerateRegression(failure.id);
                  onNavigate('regression_tests');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#18231d] hover:bg-[#1f2e26] border border-[#293d31] text-xs font-semibold text-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5 text-[#829a7d]" />
                <span>Generate Regression Test</span>
              </button>

              <button
                onClick={() => setIsResolved(!isResolved)}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  isResolved
                    ? 'bg-[#5c7057]/30 text-[#d0e9d3] border-[#5c7057]/50'
                    : 'bg-[#18231d] hover:bg-[#1f2e26] text-slate-300 border-[#293d31]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#a4bba0]" />
                <span>{isResolved ? 'Marked as Resolved ✓' : 'Mark as Resolved'}</span>
              </button>
            </div>

            {reproOutput && (
              <div className="p-3 bg-[#19271e] border border-[#5c7057]/40 rounded-lg text-[11px] text-[#d0e9d3] font-mono">
                {reproOutput}
              </div>
            )}
          </div>

          {/* Related Runs Card */}
          <div className="bg-[#131b16] border border-[#223026] rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Related Runs
            </h3>

            <div className="space-y-2">
              {[
                { id: '#TR-1048', result: 'Failed', time: '26 Oct 14:32' },
                { id: '#TR-1021', result: 'Failed', time: '21 Oct 09:14' },
                { id: '#TR-0987', result: 'Passed', time: '19 Oct 11:02' },
              ].map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    if (onSelectRun) onSelectRun(r.id);
                    onNavigate('execution_trace');
                  }}
                  className="p-2.5 bg-[#16211a] hover:bg-[#1a2820] border border-[#233128] rounded-lg flex items-center justify-between text-xs cursor-pointer group transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#a4bba0] font-semibold group-hover:underline">
                      {r.id}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        r.result === 'Failed'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-[#5c7057]/25 text-[#d0e9d3]'
                      }`}
                    >
                      {r.result}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{r.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
