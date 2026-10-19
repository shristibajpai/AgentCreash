import React, { useState } from 'react';
import {
  ChevronRight,
  ArrowLeft,
  Play,
  Check,
  Info,
  Database,
  CreditCard,
  ShoppingCart,
  Bot,
  User,
} from 'lucide-react';
import { ScreenId } from '../../types';

interface NewTestRunConfigProps {
  initialStep?: 1 | 2 | 3 | 4;
  onNavigate: (screen: ScreenId, data?: any) => void;
  onStartExecution: () => void;
}

export const NewTestRunConfig: React.FC<NewTestRunConfigProps> = ({
  initialStep = 1,
  onNavigate,
  onStartExecution,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  // Form State
  const [project, setProject] = useState('E-commerce Agent');
  const [agent, setAgent] = useState('Order Management Agent');
  const [scenario, setScenario] = useState('Refund order');
  const [environment, setEnvironment] = useState('Sandbox (isolated)');
  const [description, setDescription] = useState(
    'Customer requests a refund for a successfully delivered order. Agent should cancel the order, issue refund and update records.'
  );

  // Fault Configuration State
  const [selectedFaults, setSelectedFaults] = useState<Record<string, boolean>>({
    'API timeout': true,
    'Timeout after success': true,
    'State API response': false,
    'Duplicate tool response': false,
    'Partial write': false,
    'Conflicting tool result': false,
  });

  const [activeFaultType, setActiveFaultType] = useState('API timeout');
  const [injectionPoint, setInjectionPoint] = useState('Payment API call');
  const [probability, setProbability] = useState('100%');
  const [afterCalls, setAfterCalls] = useState('1');
  const [durationSecs, setDurationSecs] = useState('30');

  // Step 3 State
  const [assertions, setAssertions] = useState({
    singleRefund: true,
    orderStateCancelled: true,
    stateSyncWithDB: true,
    noPhantomShipment: true,
  });

  const toggleFault = (key: string) => {
    setSelectedFaults((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const steps = [
    { num: 1, label: 'Agent & Scenario' },
    { num: 2, label: 'Fault Configuration' },
    { num: 3, label: 'Expected Outcomes' },
    { num: 4, label: 'Review & Run' },
  ];

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Breadcrumb & Title */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <button
              onClick={() => onNavigate('overview')}
              className="hover:text-slate-300 transition-colors"
            >
              Test Runs
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-300">New Test Run</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create New Test Run</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Configure agent, scenario, fault injection and expected outcomes.
          </p>
        </div>
      </div>

      {/* Stepper Wizard Bar */}
      <div className="bg-[#131b16] border border-[#223026] p-3 rounded-xl flex items-center justify-between overflow-x-auto">
        {steps.map((st, idx) => {
          const isActive = currentStep === st.num;
          const isCompleted = currentStep > st.num;

          return (
            <React.Fragment key={st.num}>
              <button
                onClick={() => setCurrentStep(st.num)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#5c7057]/25 text-[#d0e9d3] border border-[#5c7057]/45'
                    : isCompleted
                    ? 'text-[#a4bba0] hover:text-[#d0e9d3]'
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[11px] ${
                    isActive
                      ? 'bg-[#5c7057] text-white font-bold'
                      : isCompleted
                      ? 'bg-[#5c7057]/30 text-[#d0e9d3] border border-[#5c7057]/40 font-semibold'
                      : 'bg-[#18231d] text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : st.num}
                </div>
                <span className="whitespace-nowrap">{st.label}</span>
              </button>
              {idx < steps.length - 1 && (
                <div className="w-8 h-[1px] bg-[#223026] hidden sm:block shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP 1: Agent & Scenario */}
      {currentStep === 1 && (
        <div className="bg-[#131b16] border border-[#223026] rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Project */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-[#16211a] border border-[#233128] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#829a7d]"
              >
                <option value="E-commerce Agent">E-commerce Agent</option>
                <option value="Customer Support Bot">Customer Support Bot</option>
                <option value="Inventory Auto-Replenish">Inventory Auto-Replenish</option>
              </select>
            </div>

            {/* Agent */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Agent</label>
              <select
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                className="w-full bg-[#16211a] border border-[#233128] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#829a7d]"
              >
                <option value="Order Management Agent">Order Management Agent</option>
                <option value="Inventory Sync Agent">Inventory Sync Agent</option>
                <option value="Checkout Flow Agent">Checkout Flow Agent</option>
              </select>
            </div>

            {/* Scenario */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Scenario</label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full bg-[#16211a] border border-[#233128] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#829a7d]"
              >
                <option value="Refund order">Refund order</option>
                <option value="Cancel order">Cancel order</option>
                <option value="Update inventory">Update inventory</option>
                <option value="Place order">Place order</option>
              </select>
            </div>

            {/* Environment */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full bg-[#16211a] border border-[#233128] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#829a7d]"
              >
                <option value="Sandbox (isolated)">Sandbox (isolated)</option>
                <option value="Staging Mirror">Staging Mirror</option>
                <option value="Local Mock Engine">Local Mock Engine</option>
              </select>
            </div>
          </div>

          {/* Scenario Description */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Scenario Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#16211a] border border-[#233128] rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-[#829a7d] leading-relaxed font-sans"
            />
          </div>

          {/* System Architecture Diagram with Sage Palette Accent */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-400">System Diagram</label>
              <span className="text-[11px] text-[#a4bba0] font-mono">
                Interactive tool node map
              </span>
            </div>

            <div className="p-6 bg-[#0e1411] border border-[#223026] rounded-xl flex items-center justify-center overflow-x-auto">
              <div className="flex items-center gap-3 sm:gap-6 min-w-[650px] py-4">
                {/* Node 1: Customer Request */}
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-[#18231d] border border-pink-500/30 text-xs">
                  <div className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-pink-400 font-mono">01</div>
                    <div className="font-semibold text-white">Customer Request</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center text-slate-600">
                  <div className="w-6 sm:w-10 h-[1.5px] bg-[#293c30]"></div>
                  <ChevronRight className="w-4 h-4 -ml-2 text-[#5c7057]" />
                </div>

                {/* Node 2: Agent Harmonia (Sage Highlighted) */}
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg bg-[#1a2820] border-2 border-[#829a7d] shadow-lg shadow-[#5c7057]/20 text-xs relative">
                  <div className="absolute -top-2.5 left-3 px-1.5 py-0.2 bg-[#5c7057] text-[9px] font-bold text-white rounded">
                    ACTIVE
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#5c7057]/30 text-[#d0e9d3] flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Agent</div>
                    <div className="text-[10px] text-[#a4bba0] font-mono">harmonia</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center text-slate-600">
                  <div className="w-6 sm:w-10 h-[1.5px] bg-[#293c30]"></div>
                  <ChevronRight className="w-4 h-4 -ml-2 text-[#5c7057]" />
                </div>

                {/* Node 3: Order API */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#18231d] border border-[#5c7057]/40 text-xs">
                  <ShoppingCart className="w-3.5 h-3.5 text-[#a4bba0]" />
                  <span className="font-medium text-slate-200">Order API</span>
                </div>

                {/* Bi-directional Arrow */}
                <div className="flex items-center text-slate-600">
                  <div className="w-4 sm:w-8 h-[1.5px] bg-[#293c30]"></div>
                  <ChevronRight className="w-3.5 h-3.5 -ml-2 text-[#5c7057]" />
                </div>

                {/* Node 4: Payment API (Fault Injection target) */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#24211a] border-2 border-amber-500/50 text-xs shadow-md shadow-amber-500/10">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <div>
                    <span className="font-semibold text-amber-200">Payment API</span>
                    <div className="text-[9px] text-amber-400 font-mono">Target Fault</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center text-slate-600">
                  <div className="w-4 sm:w-8 h-[1.5px] bg-[#293c30]"></div>
                  <ChevronRight className="w-3.5 h-3.5 -ml-2 text-[#5c7057]" />
                </div>

                {/* Node 5: Database */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#18231d] border border-[#5c7057]/40 text-xs">
                  <Database className="w-3.5 h-3.5 text-[#829a7d]" />
                  <span className="font-medium text-slate-200">Database</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#223026] flex items-center justify-between">
            <button
              onClick={() => onNavigate('overview')}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2 bg-[#5c7057] hover:bg-[#6c8366] text-white rounded-lg text-xs font-semibold shadow-md shadow-[#5c7057]/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Fault Configuration</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Fault Configuration (Screen 2.b) */}
      {currentStep === 2 && (
        <div className="bg-[#131b16] border border-[#223026] rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Select Fault Types checkboxes (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <h3 className="text-sm font-semibold text-white">Select Fault Types</h3>
              <p className="text-xs text-slate-400">
                Choose the failure modes to inject during agent execution.
              </p>

              <div className="space-y-2 pt-2">
                {Object.keys(selectedFaults).map((fault) => {
                  const isChecked = selectedFaults[fault];
                  const isFocused = activeFaultType === fault;

                  return (
                    <div
                      key={fault}
                      onClick={() => {
                        setActiveFaultType(fault);
                        toggleFault(fault);
                      }}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                        isFocused
                          ? 'bg-[#18261e] border-[#5c7057]/60 shadow-sm shadow-[#5c7057]/10'
                          : 'bg-[#16211a] border-[#233128] hover:bg-[#1a2820]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-[#5c7057] text-white'
                              : 'border border-slate-600 bg-slate-800'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium text-slate-200">{fault}</span>
                      </div>

                      {isChecked && (
                        <span className="text-[10px] text-[#a4bba0] font-mono font-medium">active</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Configure API Timeout (7 cols) */}
            <div className="md:col-span-7 bg-[#16211a] border border-[#233128] rounded-xl p-5 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white">Configure API Timeout</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulate a timeout only from the selected API.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Injection Point */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Injection Point
                  </label>
                  <select
                    value={injectionPoint}
                    onChange={(e) => setInjectionPoint(e.target.value)}
                    className="w-full bg-[#18231d] border border-[#2e4135] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#829a7d]"
                  >
                    <option value="Payment API call">Payment API call</option>
                    <option value="Order DB write">Order DB write</option>
                    <option value="Notification dispatch">Notification dispatch</option>
                    <option value="Inventory allocation">Inventory allocation</option>
                  </select>
                </div>

                {/* Probability */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Probability
                  </label>
                  <select
                    value={probability}
                    onChange={(e) => setProbability(e.target.value)}
                    className="w-full bg-[#18231d] border border-[#2e4135] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#829a7d]"
                  >
                    <option value="100%">100%</option>
                    <option value="75%">75%</option>
                    <option value="50%">50%</option>
                    <option value="25%">25%</option>
                  </select>
                </div>

                {/* After calls */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    After (call count)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={afterCalls}
                      onChange={(e) => setAfterCalls(e.target.value)}
                      className="w-24 bg-[#18231d] border border-[#2e4135] rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#829a7d]"
                    />
                    <span className="text-xs text-slate-500">call(s)</span>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Duration (seconds)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={durationSecs}
                      onChange={(e) => setDurationSecs(e.target.value)}
                      className="w-24 bg-[#18231d] border border-[#2e4135] rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#829a7d]"
                    />
                    <span className="text-xs text-slate-500">seconds</span>
                  </div>
                </div>
              </div>

              {/* Notice callout */}
              <div className="p-3.5 bg-[#1b2720] border border-[#5c7057]/40 rounded-lg flex items-start gap-3">
                <Info className="w-4 h-4 text-[#a4bba0] shrink-0 mt-0.5" />
                <p className="text-xs text-[#d0e9d3] leading-relaxed">
                  The tool will not respond for the specified duration, then throw a timeout error.
                  This evaluates the agent's resilience to downstream latency spikes and state
                  synchronization bugs.
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#223026] flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2 bg-[#5c7057] hover:bg-[#6c8366] text-white rounded-lg text-xs font-semibold shadow-md shadow-[#5c7057]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Expected Outcomes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Expected Outcomes */}
      {currentStep === 3 && (
        <div className="bg-[#131b16] border border-[#223026] rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white">Expected Invariants & Assertions</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify the deterministic conditions that must hold true even under fault conditions.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'singleRefund',
                title: 'No duplicate refund transaction created',
                desc: 'Under payment timeout or retry loop, exactly one refund authorization or abort record must exist.',
              },
              {
                key: 'orderStateCancelled',
                title: 'Order state must match database status',
                desc: 'If customer cancellation succeeds, the Order DB state must transition to CANCELLED atomically.',
              },
              {
                key: 'stateSyncWithDB',
                title: 'Reconciliation on transient gateway failure',
                desc: 'When payment gateway times out, agent must query transaction status before re-issuing refund charge.',
              },
              {
                key: 'noPhantomShipment',
                title: 'Inventory rollback upon refund confirmation',
                desc: 'Prevent stock allocation discrepancies across multi-region warehouse services.',
              },
            ].map((item) => {
              const checked = (assertions as any)[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() =>
                    setAssertions((prev) => ({
                      ...prev,
                      [item.key]: !(prev as any)[item.key],
                    }))
                  }
                  className="p-4 rounded-lg bg-[#16211a] border border-[#233128] hover:bg-[#1a2820] cursor-pointer flex items-start gap-3 transition-colors"
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center transition-colors ${
                      checked
                        ? 'bg-[#5c7057] text-white'
                        : 'border border-slate-600 bg-slate-800'
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{item.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#223026] flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2 bg-[#5c7057] hover:bg-[#6c8366] text-white rounded-lg text-xs font-semibold shadow-md shadow-[#5c7057]/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Next: Review & Run</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Run */}
      {currentStep === 4 && (
        <div className="bg-[#131b16] border border-[#223026] rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white">Review Test Configuration</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Confirm test parameters before launching agent execution in sandbox.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#16211a] border border-[#233128] space-y-3">
              <h4 className="text-xs font-semibold text-[#a4bba0] uppercase tracking-wider font-mono">
                Agent Target
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Project:</span>
                  <span className="text-slate-200 font-medium">{project}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Agent:</span>
                  <span className="text-slate-200 font-medium">{agent}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Scenario:</span>
                  <span className="text-slate-200 font-medium">{scenario}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Environment:</span>
                  <span className="text-slate-200 font-mono text-[11px]">{environment}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#16211a] border border-[#233128] space-y-3">
              <h4 className="text-xs font-semibold text-[#a4bba0] uppercase tracking-wider font-mono">
                Fault Injections
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Fault Type:</span>
                  <span className="text-amber-400 font-medium">{activeFaultType}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Target API:</span>
                  <span className="text-slate-200 font-medium">{injectionPoint}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Timeout Delay:</span>
                  <span className="text-slate-200 font-mono">{durationSecs}s</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Trigger Trigger:</span>
                  <span className="text-slate-200 font-mono">After {afterCalls} call</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#223026] flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              onClick={onStartExecution}
              className="px-6 py-2.5 bg-gradient-to-r from-[#3e4d3a] via-[#5c7057] to-[#718a6a] hover:from-[#495b45] hover:to-[#5c7057] text-white rounded-lg text-xs font-semibold shadow-lg shadow-[#5c7057]/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Test Run (#TR-1048)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
