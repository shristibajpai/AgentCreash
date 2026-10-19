import React, { useState } from 'react';
import {
  ChevronRight,
  RotateCcw,
  Download,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from 'lucide-react';
import { ScreenId } from '../../types';
import { mockTraceSteps } from '../../data/mockData';

interface ExecutionTraceViewerProps {
  runId?: string;
  onNavigate: (screen: ScreenId, data?: any) => void;
  onSelectFailure?: (failureId: string) => void;
}

export const ExecutionTraceViewer: React.FC<ExecutionTraceViewerProps> = ({
  runId = '#TR-1048',
  onNavigate,
  onSelectFailure,
}) => {
  const [activeTab, setActiveTab] = useState<'trace' | 'state_diff' | 'logs' | 'assertions'>(
    'trace'
  );
  const [selectedStepNum, setSelectedStepNum] = useState<number>(4);
  const [stepDetailTab, setStepDetailTab] = useState<'input' | 'output' | 'state_before' | 'state_after'>('input');
  const [isReproducing, setIsReproducing] = useState(false);

  const selectedStep =
    mockTraceSteps.find((s) => s.number === selectedStepNum) || mockTraceSteps[3];

  const handleReproduce = () => {
    setIsReproducing(true);
    setTimeout(() => {
      setIsReproducing(false);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Breadcrumb & Run Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <button
              onClick={() => onNavigate('overview')}
              className="hover:text-slate-300 transition-colors"
            >
              Test Runs
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-300">{runId}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>Run {runId}</span>
              <span className="text-xs px-2.5 py-0.5 rounded font-mono font-medium bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Failed
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Refund order — API timeout during payment call
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReproduce}
            disabled={isReproducing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18231d] hover:bg-[#1f2e26] border border-[#293d31] text-xs font-semibold text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 text-[#a4bba0] ${isReproducing ? 'animate-spin' : ''}`} />
            <span>{isReproducing ? 'Reproducing...' : 'Reproduce'}</span>
          </button>

          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mockTraceSteps, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `trace_${runId}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18231d] hover:bg-[#1f2e26] border border-[#293d31] text-xs font-semibold text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export</span>
          </button>

          <button
            onClick={() => {
              if (onSelectFailure) onSelectFailure('#F-021');
              onNavigate('failure_detail');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#5c7057] hover:bg-[#6c8366] text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer shadow-sm shadow-[#5c7057]/20"
          >
            <span>View Failure #F-021</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="border-b border-[#223026] flex items-center gap-6 text-xs font-medium">
        {[
          { id: 'trace', label: 'Execution Trace' },
          { id: 'state_diff', label: 'State Comparison' },
          { id: 'logs', label: 'Logs' },
          { id: 'assertions', label: 'Assertions' },
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

      {/* Tab 1: Execution Trace (Matching Screen 3) */}
      {activeTab === 'trace' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Trace Step Timeline (5 cols) */}
          <div className="lg:col-span-5 bg-[#131b16] border border-[#223026] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-[#1e2a22] text-xs font-medium text-slate-400">
              <span>Step Execution Sequence</span>
              <span className="font-mono text-[11px] text-[#a4bba0]">7 Total Steps</span>
            </div>

            <div className="space-y-1.5 pt-1">
              {mockTraceSteps.map((step) => {
                const isSelected = step.number === selectedStepNum;
                const isFailed = step.status === 'Failed';

                return (
                  <div
                    key={step.number}
                    onClick={() => setSelectedStepNum(step.number)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? isFailed
                          ? 'bg-[#281519] border-rose-500/50 shadow-sm shadow-rose-500/10'
                          : 'bg-[#18261e] border-[#5c7057]/50 shadow-sm shadow-[#5c7057]/10'
                        : 'bg-[#16211a] border-[#233128] hover:bg-[#1a2820]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-slate-500 w-4">
                        {step.number}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          isSelected ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                        {step.duration}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                          isFailed
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-[#5c7057]/20 text-[#d0e9d3] border border-[#5c7057]/30'
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Step Inspection Panel (7 cols) */}
          <div className="lg:col-span-7 bg-[#131b16] border border-[#223026] rounded-xl p-5 space-y-4">
            {/* Step Header & Subtabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1e2a22] gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Step {selectedStep.number}: {selectedStep.name}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                  <span>Duration: {selectedStep.duration}</span>
                  <span>•</span>
                  <span>Timestamp: {selectedStep.timestamp}</span>
                </div>
              </div>

              {/* Subtabs */}
              <div className="flex items-center gap-1 bg-[#16211a] border border-[#233128] p-1 rounded-lg">
                {[
                  { id: 'input', label: 'Input' },
                  { id: 'output', label: 'Output' },
                  { id: 'state_before', label: 'State Before' },
                  { id: 'state_after', label: 'State After' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStepDetailTab(st.id as any)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      stepDetailTab === st.id
                        ? 'bg-[#5c7057] text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Injected Fault Card if present */}
            {selectedStep.faultInjected && (
              <div className="p-3.5 rounded-lg bg-[#24171a] border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-rose-300 font-semibold">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Injected Fault: {selectedStep.faultInjected.type}</span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded border border-rose-500/30">
                    Synthetic Fault
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                  <div className="bg-[#1b1214] p-2 rounded border border-rose-900/40">
                    <div className="text-[10px] text-slate-400">Target</div>
                    <div className="text-white font-mono text-[11px]">
                      {selectedStep.faultInjected.target}
                    </div>
                  </div>
                  <div className="bg-[#1b1214] p-2 rounded border border-rose-900/40">
                    <div className="text-[10px] text-slate-400">Trigger</div>
                    <div className="text-white font-mono text-[11px]">
                      {selectedStep.faultInjected.trigger}
                    </div>
                  </div>
                  <div className="bg-[#1b1214] p-2 rounded border border-rose-900/40">
                    <div className="text-[10px] text-slate-400">Duration</div>
                    <div className="text-white font-mono text-[11px]">
                      {selectedStep.faultInjected.duration}
                    </div>
                  </div>
                  <div className="bg-[#1b1214] p-2 rounded border border-rose-900/40">
                    <div className="text-[10px] text-slate-400">Probability</div>
                    <div className="text-white font-mono text-[11px]">
                      {selectedStep.faultInjected.probability}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payload JSON Inspector in Sage Mint */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                {stepDetailTab === 'input' && 'Request Payload (JSON)'}
                {stepDetailTab === 'output' && 'Tool Response Payload (JSON)'}
                {stepDetailTab === 'state_before' && 'Agent State Before Step (JSON)'}
                {stepDetailTab === 'state_after' && 'Agent State After Step (JSON)'}
              </div>

              <div className="bg-[#0e1411] border border-[#223026] rounded-lg p-4 font-mono text-xs overflow-x-auto text-[#a4bba0]">
                <pre>
                  {JSON.stringify(
                    stepDetailTab === 'input'
                      ? selectedStep.input || {}
                      : stepDetailTab === 'output'
                      ? selectedStep.output || { error: 'No output generated due to fatal timeout' }
                      : stepDetailTab === 'state_before'
                      ? selectedStep.stateBefore || {}
                      : selectedStep.stateAfter || {},
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>

            {/* Error Message Box */}
            {selectedStep.errorMessage && (
              <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-lg flex items-start gap-2.5 text-xs text-rose-300">
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-rose-200">Execution Error Caught</div>
                  <div className="mt-0.5 font-mono text-xs">{selectedStep.errorMessage}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: State Comparison */}
      {activeTab === 'state_diff' && (
        <div className="bg-[#131b16] border border-[#223026] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Expected State vs. Actual State</h3>
          <p className="text-xs text-slate-400">
            Detected state violation during recovery execution from payment timeout.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-[#16211a] border border-[#5c7057]/40 space-y-2">
              <div className="text-xs font-bold text-[#a4bba0] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Expected State (Invariants Kept)</span>
              </div>
              <pre className="bg-[#0e1411] p-3 rounded font-mono text-xs text-[#d0e9d3] overflow-x-auto">
{`{
  "order_status": "CANCELLED",
  "refund_count": 1,
  "refund_status": "PENDING_VERIFIED",
  "gateway_transaction_id": "tx_orig_819",
  "duplicate_drafts": 0
}`}
              </pre>
            </div>

            <div className="p-4 rounded-lg bg-[#261619] border border-rose-500/30 space-y-2">
              <div className="text-xs font-bold text-rose-400 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                <span>Actual Corrupted State (State Violation)</span>
              </div>
              <pre className="bg-[#0e1411] p-3 rounded font-mono text-xs text-rose-300 overflow-x-auto">
{`{
  "order_status": "CANCELLED",
  "refund_count": 2, // VIOLATION: Duplicate draft created
  "refund_status": "DUPLICATE_VIOLATION",
  "gateway_transaction_id": null,
  "duplicate_drafts": 1
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Logs */}
      {activeTab === 'logs' && (
        <div className="bg-[#131b16] border border-[#223026] rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400">Agent Scratchpad & Tool Execution Log</span>
            <span className="text-[#a4bba0] font-mono">Real-time Stream Captured</span>
          </div>
          <div className="bg-[#0e1411] border border-[#223026] rounded-lg p-4 font-mono text-xs text-slate-300 space-y-1.5 h-72 overflow-y-auto">
            <div>[14:32:01.102] INFO harmonia-agent: Received user intent: refund_request for ORD-2381</div>
            <div>[14:32:02.320] DEBUG tool-order-db: Retrieved record ORD-2381 (Status: DELIVERED, Amount: 1299 INR)</div>
            <div>[14:32:03.540] INFO harmonia-agent: Mutating order state to CANCELLED in DB</div>
            <div className="text-[#a4bba0]">[14:32:04.210] SUCCESS tool-order-db: Order ORD-2381 updated successfully</div>
            <div className="text-amber-400">[14:32:11.451] WARN fault-injector: Injecting 30s timeout on Payment API call</div>
            <div className="text-rose-400">[14:32:41.451] ERROR tool-payment: Gateway timeout: Request took &gt; 30000ms</div>
            <div className="text-rose-400">[14:32:41.490] WARN harmonia-agent: Unhandled timeout caught. Retrying without state probe...</div>
            <div className="text-rose-400">[14:32:41.500] ERROR idempotency-guard: Conflict! Duplicate refund transaction attempted for ORD-2381</div>
            <div>[14:32:46.800] INFO tool-order-db: Appended fallback incident note</div>
            <div className="text-[#a4bba0]">[14:32:48.200] SUCCESS tool-notifier: Customer acknowledgement dispatched</div>
          </div>
        </div>
      )}

      {/* Tab 4: Assertions */}
      {activeTab === 'assertions' && (
        <div className="bg-[#131b16] border border-[#223026] rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Invariant Evaluation Report</h3>
          <div className="space-y-2">
            {[
              { name: 'ASSERT_IDEMPOTENT_REFUND', status: 'Failed', desc: 'Expected <= 1 refund receipt; found 2' },
              { name: 'ASSERT_ORDER_CANCELLED_STATE', status: 'Passed', desc: 'Order status marked CANCELLED in DB' },
              { name: 'ASSERT_GATEWAY_PROBE_BEFORE_RETRY', status: 'Failed', desc: 'Agent re-attempted transaction without checking unsettled charges' },
              { name: 'ASSERT_CUSTOMER_NOTIFIED', status: 'Passed', desc: 'Customer received status notification within timeout window' },
            ].map((a, i) => (
              <div key={i} className="p-3 bg-[#16211a] border border-[#233128] rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {a.status === 'Passed' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#a4bba0] shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <div className="font-mono font-semibold text-slate-200">{a.name}</div>
                    <div className="text-[11px] text-slate-400">{a.desc}</div>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                    a.status === 'Passed'
                      ? 'bg-[#5c7057]/25 text-[#d0e9d3]'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
