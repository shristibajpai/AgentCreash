export type ScreenId =
  | 'overview'
  | 'new_test_run'
  | 'fault_config'
  | 'execution_trace'
  | 'failures'
  | 'failure_detail'
  | 'fault_minimization'
  | 'regression_tests'
  | 'benchmarks'
  | 'settings';


export interface TestRun {
  id: string;
  scenario: string;
  fault: string;
  result: 'Failed' | 'Passed';
  duration: string;
  time: string;
  agent?: string;
  project?: string;
  stepsCount?: number;
}

export interface TraceStep {
  number: number;
  name: string;
  duration: string;
  status: 'Passed' | 'Failed';
  input?: Record<string, any>;
  output?: Record<string, any>;
  stateBefore?: Record<string, any>;
  stateAfter?: Record<string, any>;
  faultInjected?: {
    type: string;
    target: string;
    trigger: string;
    duration: string;
    probability: string;
  };
  errorMessage?: string;
  timestamp: string;
}

export interface FailureItem {
  id: string;
  scenario: string;
  category: string;
  severity: 'High' | 'Medium' | 'Low';
  reproduced: boolean;
  lastObserved: string;
  linkedRun: string;
  description: string;
  firstObserved: string;
  lastReproduced: string;
  affectedTools: string[];
  rootCauses: string[];
}

export interface MinimizationEvent {
  id: number;
  name: string;
  target: string;
  retained: boolean;
}

export interface MinimizationAttempt {
  attempt: number;
  removedEvent: string;
  reproduced: boolean;
}

export interface RegressionTestItem {
  id: string;
  name: string;
  sourceFailure: string;
  scenario: string;
  lastRun: string;
  result: 'Passed' | 'Failed' | 'Running';
  version: string;
}

export interface BenchmarkMetric {
  method: string;
  discoveryRate: number;
  reproductionRate: number;
  avgExecutionTime: string;
  avgCostUSD: string;
  uniqueFailures: number;
  reproducedFailures: number;
}
