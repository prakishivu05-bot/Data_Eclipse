import React, { Component } from 'react';
import { useWorkflowStore, STEPS } from './store/useWorkflowStore';
import { AnimatePresence } from 'framer-motion';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Workflow Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500 p-8 text-center bg-black/80 rounded-xl border border-red-500/30 m-4">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-sm font-mono text-gray-300">
            {this.state.error?.toString() || "Unknown error"}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
          >
            Restart Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { AppShell } from './components/workflow/AppShell';
import { Landing } from './components/workflow/Landing';
import { TargetSelection } from './components/workflow/TargetSelection';
import { Authentication } from './components/workflow/Authentication';
import { Confirmation } from './components/workflow/Confirmation';
import { WipeProgress } from './components/workflow/WipeProgress';
import { Verification } from './components/workflow/Verification';
import { CertificateViewer } from './components/workflow/CertificateViewer';
import { VerifyCertificate } from './components/workflow/VerifyCertificate';
import { Completion } from './components/workflow/Completion';

function App() {
  const currentStep = useWorkflowStore(state => state.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.LANDING: return <Landing key="landing" />;
      case STEPS.TARGET_SELECTION: return <TargetSelection key="target" />;
      case STEPS.AUTHENTICATION: return <Authentication key="auth" />;
      case STEPS.CONFIRMATION: return <Confirmation key="confirm" />;
      case STEPS.WIPE_PROGRESS: return <WipeProgress key="wipe" />;
      case STEPS.VERIFICATION: return <Verification key="verify" />;
      case STEPS.CERTIFICATE: return <CertificateViewer key="cert" />;
      case STEPS.VERIFY_CERTIFICATE: return <VerifyCertificate key="verify-cert" />;
      case STEPS.COMPLETION: return <Completion key="completion" />;
      default: return <Landing key="landing" />;
    }
  };

  return (
    <AppShell>
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </ErrorBoundary>
    </AppShell>
  );
}

export default App;
