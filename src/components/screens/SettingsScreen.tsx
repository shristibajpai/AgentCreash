import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  Sliders,
  ShieldAlert,
  Webhook,
  Palette,
  CheckCircle2,
  Terminal,
  Database,
  Globe,
  Bell,
  Cpu,
  Check,
  Sun,
  Moon,
} from 'lucide-react';
import { ScreenId } from '../../types';
import { useTheme } from '../../context/ThemeContext';


interface SettingsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'general' | 'faults' | 'integrations' | 'theme'>('general');
  const [savedSuccess, setSavedSuccess] = useState(false);


  // General Settings State
  const [sandboxMode, setSandboxMode] = useState('isolated');
  const [maxTimeout, setMaxTimeout] = useState('60');
  const [autoReproCount, setAutoReproCount] = useState('10');
  const [minimizationStrategy, setMinimizationStrategy] = useState('ddmin');
  const [enableDetailedTracing, setEnableDetailedTracing] = useState(true);

  // Fault Engine State
  const [latencyModel, setLatencyModel] = useState('gaussian');
  const [defaultDuration, setDefaultDuration] = useState('30');
  const [interceptOrderDb, setInterceptOrderDb] = useState(true);
  const [interceptPaymentApi, setInterceptPaymentApi] = useState(true);
  const [interceptNotification, setInterceptNotification] = useState(true);

  // Integrations State
  const [githubRepo, setGithubRepo] = useState('org-commerce/order-agent');
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T00/B00/agentcrash-alerts');
  const [alertOnSeverity, setAlertOnSeverity] = useState('high_medium');
  const [autoCreatePrIssues, setAutoCreatePrIssues] = useState(true);

  // Theme State
  const [density, setDensity] = useState<'compact' | 'comfortable'>('comfortable');

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  const handleReset = () => {
    setSandboxMode('isolated');
    setMaxTimeout('60');
    setAutoReproCount('10');
    setMinimizationStrategy('ddmin');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Settings</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Configure agent sandbox environments, fault engine defaults, and CI/CD triggers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#18231d] hover:bg-[#1f2e26] border border-[#293d31] text-xs font-semibold text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#a4bba0]" />
            <span>Reset to Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#5c7057] hover:bg-[#6c8366] text-white rounded-lg text-xs font-semibold shadow-md shadow-[#5c7057]/25 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-[#16271c] border border-[#5c7057]/60 rounded-xl flex items-center gap-2.5 text-xs text-[#d0e9d3] transition-all">
          <CheckCircle2 className="w-4 h-4 text-[#829a7d] shrink-0" />
          <span>Settings saved successfully and applied to active sandbox session.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-[#223026] flex items-center gap-6 text-xs font-medium">
        {[
          { id: 'general', label: 'General & Sandbox', icon: Sliders },
          { id: 'faults', label: 'Fault Injection Engine', icon: ShieldAlert },
          { id: 'integrations', label: 'CI/CD & Notifications', icon: Webhook },
          { id: 'theme', label: 'Palette & Display', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 relative transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-[#a4bba0] font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5c7057]" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: General & Sandbox */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-[#131b16] border border-[#223026] rounded-xl p-6 space-y-5">
            <h3 className="text-sm font-semibold text-white">Execution Sandbox Defaults</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Isolation Mode */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Sandbox Environment Isolation
                </label>
                <select
                  value={sandboxMode}
                  onChange={(e) => setSandboxMode(e.target.value)}
                  className="w-full bg-[#16211a] border border-[#233128] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#829a7d]"
                >
                  <option value="isolated">Isolated Container (Hermetic RAM overlay)</option>
                  <option value="staging">Staging Database Shadow Mirror</option>
                  <option value="mock">Local Deterministic Mock Engine</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Controls whether agent tool actions mutate an ephemeral scratchpad or mock endpoints.
                </p>
              </div>

              {/* Max Timeout */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Max Scenario Execution Timeout
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={maxTimeout}
                    onChange={(e) => setMaxTimeout(e.target.value)}
                    className="w-24 bg-[#16211a] border border-[#233128] rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#829a7d]"
                  />
                  <span className="text-xs text-slate-400">seconds (hard kill deadline)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Prevents infinite loops when agents become stuck in unhandled retry traps.
                </p>
              </div>

              {/* Automated Repro Count */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Automated Reproduction Sample Runs
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={autoReproCount}
                    onChange={(e) => setAutoReproCount(e.target.value)}
                    className="w-24 bg-[#16211a] border border-[#233128] rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#829a7d]"
                  />
                  <span className="text-xs text-slate-400">iterations for statistical certainty</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Number of repeat runs required to mark a failure as deterministic (e.g. 10/10).
                </p>
              </div>

              {/* Minimization Algorithm */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Delta Debugging Strategy
                </label>
                <select
                  value={minimizationStrategy}
                  onChange={(e) => setMinimizationStrategy(e.target.value)}
                  className="w-full bg-[#16211a] border border-[#233128] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#829a7d]"
                >
                  <option value="ddmin">Hierarchical DDMin (Optimal 1-minimal subset)</option>
                  <option value="binary">Binary Elimination Partition</option>
                  <option value="greedy">Greedy Single-Event Pass</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Algorithm used in Screen 6 to reduce complex event sequences into minimal triggers.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#131b16] border border-[#223026] rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">Diagnostics & Telemetry Depth</h3>
            <div
              onClick={() => setEnableDetailedTracing(!enableDetailedTracing)}
              className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-[#16211a] transition-colors"
            >
              <div
                className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center transition-colors ${
                  enableDetailedTracing ? 'bg-[#5c7057] text-white' : 'border border-slate-600 bg-slate-800'
                }`}
              >
                {enableDetailedTracing && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">
                  Capture deep pre/post state snapshots on every tool invocation
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Stores full JSON diffs before and after every agent action to expose memory corruption and race conditions.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Fault Injection Engine */}
      {activeTab === 'faults' && (
        <div className="bg-[#131b16] border border-[#223026] rounded-xl p-6 space-y-6">
          <h3 className="text-sm font-semibold text-white">Fault Injection Interceptor Profiles</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Latency Spike Distribution
              </label>
              <select
                value={latencyModel}
                onChange={(e) => setLatencyModel(e.target.value)}
                className="w-full bg-[#16211a] border border-[#233128] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#829a7d]"
              >
                <option value="gaussian">Gaussian Jitter (realistic API tail latency)</option>
                <option value="poisson">Poisson Burst Modeling</option>
                <option value="deterministic">Fixed Deterministic Delay</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Default Timeout Injected Duration
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={defaultDuration}
                  onChange={(e) => setDefaultDuration(e.target.value)}
                  className="w-24 bg-[#16211a] border border-[#233128] rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#829a7d]"
                />
                <span className="text-xs text-slate-400">seconds</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#223026]">
            <h4 className="text-xs font-semibold text-[#a4bba0] uppercase tracking-wider font-mono mb-3">
              Monitored Gateway & Tool Interceptors
            </h4>
            <div className="space-y-2">
              {[
                {
                  label: 'Payment API Gateway (/v1/charges, /v1/refunds)',
                  checked: interceptPaymentApi,
                  setter: setInterceptPaymentApi,
                  desc: 'Intercepts Stripe, Razorpay, or custom checkout payment tools',
                },
                {
                  label: 'Order Management Database (PostgreSQL / Redis session store)',
                  checked: interceptOrderDb,
                  setter: setInterceptOrderDb,
                  desc: 'Intercepts state commits, table locks, and row-level updates',
                },
                {
                  label: 'Customer Notification Dispatcher (Email / SMS webhooks)',
                  checked: interceptNotification,
                  setter: setInterceptNotification,
                  desc: 'Monitors event delivery, idempotency tags, and queue retries',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => item.setter(!item.checked)}
                  className="p-3 bg-[#16211a] border border-[#233128] hover:bg-[#1a2820] rounded-lg flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                        item.checked ? 'bg-[#5c7057] text-white' : 'border border-slate-600 bg-slate-800'
                      }`}
                    >
                      {item.checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-200">{item.label}</div>
                      <div className="text-[11px] text-slate-500">{item.desc}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#a4bba0]">
                    {item.checked ? 'ENABLED' : 'BYPASS'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Integrations & CI/CD */}
      {activeTab === 'integrations' && (
        <div className="bg-[#131b16] border border-[#223026] rounded-xl p-6 space-y-6">
          <h3 className="text-sm font-semibold text-white">Continuous Integration & Alerting</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Repository
              </label>
              <input
                type="text"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                className="w-full bg-[#16211a] border border-[#233128] rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#829a7d]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Slack / Teams Alert Webhook URL
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-[#16211a] border border-[#233128] rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-[#829a7d]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Alert Notification Threshold
              </label>
              <select
                value={alertOnSeverity}
                onChange={(e) => setAlertOnSeverity(e.target.value)}
                className="w-full bg-[#16211a] border border-[#233128] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#829a7d]"
              >
                <option value="high_medium">High and Medium Severities Only (Recommended)</option>
                <option value="high_only">High Severity Only</option>
                <option value="all">All Discovered Failures (Including Low)</option>
              </select>
            </div>

            <div
              onClick={() => setAutoCreatePrIssues(!autoCreatePrIssues)}
              className="flex items-center gap-3 p-3 bg-[#16211a] border border-[#233128] rounded-lg cursor-pointer hover:bg-[#1a2820]"
            >
              <div
                className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                  autoCreatePrIssues ? 'bg-[#5c7057] text-white' : 'border border-slate-600 bg-slate-800'
                }`}
              >
                {autoCreatePrIssues && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span className="text-xs text-slate-200 font-medium">
                Automatically generate regression test PR when a new High-severity failure is reproduced
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Palette & Display */}
      {activeTab === 'theme' && (
        <div className="bg-[#131b16] border border-[#223026] rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white">Appearance & Theme Mode</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Switch between Light View and Dark View while preserving the #5C7057 Sage aesthetic.
            </p>
          </div>

          {/* Light / Dark Mode Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Dark Mode Option */}
            <div
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'bg-[#18261e] border-[#5c7057] shadow-md shadow-[#5c7057]/20 ring-1 ring-[#5c7057]'
                  : 'bg-[#16211a] border-[#233128] hover:bg-[#1a2820]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0d1310] border border-[#233128] flex items-center justify-center text-amber-300">
                    <Moon className="w-4 h-4 text-[#829a7d]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Dark View</div>
                    <div className="text-[11px] text-slate-400">Deep forest dark canvas (#0D1310)</div>
                  </div>
                </div>
                {theme === 'dark' && (
                  <span className="w-5 h-5 rounded-full bg-[#5c7057] text-white flex items-center justify-center text-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
            </div>

            {/* Light Mode Option */}
            <div
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                theme === 'light'
                  ? 'bg-[#edf5ee] border-[#5c7057] shadow-md shadow-[#5c7057]/20 ring-1 ring-[#5c7057]'
                  : 'bg-[#16211a] border-[#233128] hover:bg-[#1a2820]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#f4f7f4] border border-[#cbdcd0] flex items-center justify-center text-amber-500">
                    <Sun className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Light View</div>
                    <div className="text-[11px] text-slate-400">Crisp sage daytime mist (#F4F7F4)</div>
                  </div>
                </div>
                {theme === 'light' && (
                  <span className="w-5 h-5 rounded-full bg-[#5c7057] text-white flex items-center justify-center text-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-white pt-2">Active Color Palette</h3>

          <div className="p-4 bg-[#16211a] border border-[#233128] rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <span>Sage Olive Harmony</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#5c7057]/30 text-[#d0e9d3] border border-[#5c7057]/50 font-bold">
                    Active Palette
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Extracted from user specification swatch #5C7057
                </p>
              </div>
            </div>

            {/* Swatches Visualizer */}
            <div className="grid grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-[#5c7057] text-white space-y-1">
                <div className="text-[11px] font-mono font-bold">#5C7057</div>
                <div className="text-[10px] opacity-80">Primary Brand</div>
              </div>
              <div className="p-3 rounded-lg bg-[#829a7d] text-slate-950 space-y-1">
                <div className="text-[11px] font-mono font-bold">#829A7D</div>
                <div className="text-[10px] opacity-80">Medium Sage</div>
              </div>
              <div className="p-3 rounded-lg bg-[#a4bba0] text-slate-950 space-y-1">
                <div className="text-[11px] font-mono font-bold">#A4BBA0</div>
                <div className="text-[10px] opacity-80">Soft Accent</div>
              </div>
              <div className="p-3 rounded-lg bg-[#d0e9d3] text-slate-950 space-y-1">
                <div className="text-[11px] font-mono font-bold">#D0E9D3</div>
                <div className="text-[10px] opacity-80">Light Mint</div>
              </div>
            </div>
          </div>


          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300">Interface Density</h4>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDensity('comfortable')}
                className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  density === 'comfortable'
                    ? 'bg-[#5c7057]/30 text-[#d0e9d3] border-[#5c7057]'
                    : 'bg-[#16211a] border-[#233128] text-slate-400'
                }`}
              >
                Comfortable (Standard)
              </button>
              <button
                onClick={() => setDensity('compact')}
                className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  density === 'compact'
                    ? 'bg-[#5c7057]/30 text-[#d0e9d3] border-[#5c7057]'
                    : 'bg-[#16211a] border-[#233128] text-slate-400'
                }`}
              >
                Compact (High-Density)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
