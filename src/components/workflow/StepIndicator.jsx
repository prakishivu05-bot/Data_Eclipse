import React from 'react';
import { useWorkflowStore, STEPS } from '../../store/useWorkflowStore';
import { Check } from 'lucide-react';

const STEP_LABELS = [
  { id: STEPS.TARGET_SELECTION, label: 'Target' },
  { id: STEPS.AUTHENTICATION, label: 'Auth' },
  { id: STEPS.CONFIRMATION, label: 'Confirm' },
  { id: STEPS.WIPE_PROGRESS, label: 'Wipe' },
  { id: STEPS.VERIFICATION, label: 'Verify' },
  { id: STEPS.CERTIFICATE, label: 'Certificate' }
];

export const StepIndicator = () => {
  const currentStep = useWorkflowStore(state => state.currentStep);

  // Hide on landing screen
  if (currentStep === STEPS.LANDING) return null;

  const getStepIndex = (stepId) => {
    // Map Verify Certificate and Completion to the final Certificate step visually
    if (stepId === STEPS.VERIFY_CERTIFICATE || stepId === STEPS.COMPLETION) {
      return STEP_LABELS.findIndex(s => s.id === STEPS.CERTIFICATE);
    }
    return STEP_LABELS.findIndex(s => s.id === stepId);
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="w-full max-w-3xl mx-auto mb-10 mt-2 px-4 flex items-center justify-between relative z-20">
      {/* Background connecting line */}
      <div className="absolute left-[5%] right-[5%] top-4 h-0.5 bg-gray-800 -z-10">
        <div 
          className="h-full bg-blue-500 transition-all duration-500 ease-in-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
          style={{ width: `${(currentIndex / (STEP_LABELS.length - 1)) * 100}%` }} 
        />
      </div>

      {STEP_LABELS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.id} className="flex flex-col items-center">
            <div 
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                isCompleted ? 'bg-green-500/20 text-green-400 border border-green-500' :
                isCurrent ? 'bg-blue-600 text-white border border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]' :
                'bg-[#050510] text-gray-600 border border-white/10'
              }`}
            >
              {isCompleted ? <Check className="w-3 h-3 sm:w-4 sm:h-4 font-bold" /> : <span className="text-[10px] sm:text-xs font-bold">{index + 1}</span>}
            </div>
            <span className={`text-[9px] sm:text-[10px] mt-2 font-semibold uppercase tracking-widest absolute translate-y-8 sm:translate-y-10 w-16 sm:w-24 text-center hidden sm:block ${
              isCurrent ? 'text-blue-300' : isCompleted ? 'text-green-500/80' : 'text-gray-600'
            }`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
