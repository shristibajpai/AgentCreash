/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenId } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewDashboard } from './components/screens/OverviewDashboard';
import { NewTestRunConfig } from './components/screens/NewTestRunConfig';
import { ExecutionTraceViewer } from './components/screens/ExecutionTraceViewer';
import { FailureExplorer } from './components/screens/FailureExplorer';
import { FailureDetail } from './components/screens/FailureDetail';
import { FaultMinimization } from './components/screens/FaultMinimization';
import { RegressionTests } from './components/screens/RegressionTests';
import { BenchmarkLab } from './components/screens/BenchmarkLab';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { useTheme } from './context/ThemeContext';


export default function App() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('overview');
  const [selectedRunId, setSelectedRunId] = useState<string>('#TR-1048');
  const [selectedFailureId, setSelectedFailureId] = useState<string>('#F-021');

  // Breadcrumbs generator
  const getBreadcrumbs = () => {
    switch (currentScreen) {
      case 'overview':
        return [{ label: 'Overview' }];
      case 'new_test_run':
        return [{ label: 'Test Runs', screen: 'new_test_run' as ScreenId }, { label: 'New Configuration' }];
      case 'fault_config':
        return [
          { label: 'Test Runs', screen: 'new_test_run' as ScreenId },
          { label: 'Fault Configuration (Step 2)' },
        ];
      case 'execution_trace':
        return [{ label: 'Test Runs', screen: 'new_test_run' as ScreenId }, { label: selectedRunId }];
      case 'failures':
        return [{ label: 'Discovered Failures' }];
      case 'failure_detail':
        return [{ label: 'Failures', screen: 'failures' as ScreenId }, { label: selectedFailureId }];
      case 'fault_minimization':
        return [
          { label: 'Failures', screen: 'failures' as ScreenId },
          { label: selectedFailureId, screen: 'failure_detail' as ScreenId },
          { label: 'Fault Minimization' },
        ];
      case 'regression_tests':
        return [{ label: 'Regression Suite' }];
      case 'benchmarks':
        return [{ label: 'Benchmark Lab' }];
      case 'settings':
        return [{ label: 'Platform Settings' }];
      default:
        return [{ label: 'Overview' }];
    }
  };


  return (
    <div
      className={`flex h-screen w-screen overflow-hidden font-sans antialiased transition-colors duration-200 ${
        isLight ? 'bg-[#f4f7f4] text-[#17221b]' : 'bg-[#0d1310] text-slate-100'
      }`}
    >
      {/* Left Navigation Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        failureCount={12}
        regressionCount={15}
      />

      {/* Main App Content Viewport */}
      <div
        className={`flex-1 flex flex-col h-screen overflow-y-auto transition-colors duration-200 ${
          isLight ? 'bg-[#f4f7f4]' : 'bg-[#0d1310]'
        }`}
      >

        {/* Sticky Top Header with 8-Screen Switcher & Breadcrumbs */}
        <Header
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          breadcrumbs={getBreadcrumbs()}
        />

        {/* Viewport Screen Content */}
        <main className="flex-1 pb-16">
          {currentScreen === 'overview' && (
            <OverviewDashboard
              onNavigate={(screen) => setCurrentScreen(screen)}
              onSelectRun={(runId) => setSelectedRunId(runId)}
              onSelectFailure={(failId) => setSelectedFailureId(failId)}
            />
          )}

          {currentScreen === 'new_test_run' && (
            <NewTestRunConfig
              initialStep={1}
              onNavigate={(screen) => setCurrentScreen(screen)}
              onStartExecution={() => {
                setSelectedRunId('#TR-1048');
                setCurrentScreen('execution_trace');
              }}
            />
          )}

          {currentScreen === 'fault_config' && (
            <NewTestRunConfig
              initialStep={2}
              onNavigate={(screen) => setCurrentScreen(screen)}
              onStartExecution={() => {
                setSelectedRunId('#TR-1048');
                setCurrentScreen('execution_trace');
              }}
            />
          )}

          {currentScreen === 'execution_trace' && (
            <ExecutionTraceViewer
              runId={selectedRunId}
              onNavigate={(screen) => setCurrentScreen(screen)}
              onSelectFailure={(failId) => setSelectedFailureId(failId)}
            />
          )}

          {currentScreen === 'failures' && (
            <FailureExplorer
              onNavigate={(screen) => setCurrentScreen(screen)}
              onSelectFailure={(failId) => setSelectedFailureId(failId)}
            />
          )}

          {currentScreen === 'failure_detail' && (
            <FailureDetail
              failureId={selectedFailureId}
              onNavigate={(screen) => setCurrentScreen(screen)}
              onSelectRun={(runId) => setSelectedRunId(runId)}
              onGenerateRegression={(failId) => {
                // Navigate to regression tests
                setCurrentScreen('regression_tests');
              }}
            />
          )}

          {currentScreen === 'fault_minimization' && (
            <FaultMinimization
              failureId={selectedFailureId}
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}

          {currentScreen === 'regression_tests' && (
            <RegressionTests
              onNavigate={(screen) => setCurrentScreen(screen)}
              onSelectFailure={(failId) => setSelectedFailureId(failId)}
            />
          )}

          {currentScreen === 'benchmarks' && (
            <BenchmarkLab onNavigate={(screen) => setCurrentScreen(screen)} />
          )}

          {currentScreen === 'settings' && (
            <SettingsScreen onNavigate={(screen) => setCurrentScreen(screen)} />
          )}
        </main>
      </div>
    </div>
  );
}

