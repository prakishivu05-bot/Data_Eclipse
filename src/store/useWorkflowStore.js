import { create } from 'zustand';
import { resetDisk } from '../services/FakeDiskService';

export const STEPS = {
  LANDING: 'LANDING',
  TARGET_SELECTION: 'TARGET_SELECTION',
  AUTHENTICATION: 'AUTHENTICATION',
  CONFIRMATION: 'CONFIRMATION',
  WIPE_PROGRESS: 'WIPE_PROGRESS',
  VERIFICATION: 'VERIFICATION',
  CERTIFICATE: 'CERTIFICATE',
  VERIFY_CERTIFICATE: 'VERIFY_CERTIFICATE',
  COMPLETION: 'COMPLETION'
};

const STEP_ORDER = Object.values(STEPS);

export const useWorkflowStore = create((set, get) => ({
  currentStep: STEPS.LANDING,
  isAuthenticated: false,
  selectedDisk: null,
  wipeProgress: 0,
  logs: [],
  certificate: null,
  verificationResult: null,
  preWipeHash: null,
  postWipeHash: null,
  startTime: null,
  endTime: null,

  // Actions
  nextStep: () => {
    const { currentStep } = get();
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      set({ currentStep: STEP_ORDER[currentIndex + 1] });
    }
  },
  goToStep: (step) => set({ currentStep: step }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setSelectedDisk: (disk) => set({ selectedDisk: disk }),
  setWipeProgress: (progress) => set((state) => {
    let nextValue = typeof progress === 'function' ? progress(state.wipeProgress) : progress;
    nextValue = isNaN(nextValue) ? 0 : nextValue;
    nextValue = Math.max(0, Math.min(100, nextValue)); // Ensure it's 0-100
    return { wipeProgress: nextValue };
  }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  clearLogs: () => set({ logs: [] }),
  setCertificate: (cert) => set({ certificate: cert }),
  setVerificationResult: (result) => set({ verificationResult: result }),
  setHashes: (pre, post) => set((state) => ({ preWipeHash: pre || state.preWipeHash, postWipeHash: post || state.postWipeHash })),
  setTimes: (start, end) => set((state) => ({ startTime: start || state.startTime, endTime: end || state.endTime })),
  resetWorkflow: () => {
    resetDisk();
    set({
      currentStep: STEPS.LANDING,
      isAuthenticated: false,
      selectedDisk: null,
      wipeProgress: 0,
      logs: [],
      certificate: null,
      verificationResult: null,
      preWipeHash: null,
      postWipeHash: null,
      startTime: null,
      endTime: null,
    });
  }
}));
