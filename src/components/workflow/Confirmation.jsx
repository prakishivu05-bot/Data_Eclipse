import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkflowStore, STEPS } from '../../store/useWorkflowStore';
import { AlertTriangle, HardDrive, ArrowLeft } from 'lucide-react';

export const Confirmation = () => {
  const { goToStep, selectedDisk, isAuthenticated } = useWorkflowStore();
  const [understood, setUnderstood] = useState(false);

  if (!isAuthenticated) {
    // Fail-safe
    return (
      <div className="text-center text-red-500">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Unauthorized Action</h2>
        <button onClick={() => goToStep(STEPS.LANDING)} className="mt-4 px-4 py-2 bg-red-900/50 rounded-lg border border-red-500">Return to Safety</button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-red-950/20 border-2 border-red-500/50 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-[0_0_80px_rgba(220,38,38,0.15)] flex flex-col items-center text-center">
        
        <div className="absolute inset-x-0 top-0 h-1 bg-red-600 animate-pulse" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz4KPC9zdmc+')] pointer-events-none" />

        <div className="w-24 h-24 rounded-full bg-red-500/10 border-4 border-red-500/30 flex items-center justify-center mb-8">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 uppercase tracking-tighter text-red-100">
          Point of No Return
        </h2>
        
        <p className="text-red-300/80 text-lg mb-10 max-w-lg leading-relaxed">
          This action will <strong className="text-red-400 font-bold">permanently erase</strong> all data on the selected drive. There is absolutely no software or hardware recovery possible after this execution.
        </p>

        <div className="w-full bg-black/60 rounded-xl p-6 border border-red-900/50 mb-10 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 shadow-inner">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-900/30 flex-shrink-0 flex items-center justify-center border border-red-500/20">
              <HardDrive className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-red-300 font-semibold uppercase tracking-wider mb-1">Target Identified</p>
              <p className="font-mono text-white text-base sm:text-lg break-all">{selectedDisk?.name || '/dev/sdb'} <span className="text-gray-500 text-xs sm:text-sm">({selectedDisk?.size || '100 MB'})</span></p>
            </div>
          </div>
        </div>

        <label className="flex items-start sm:items-center gap-4 p-4 rounded-xl border border-red-500/30 bg-red-950/40 cursor-pointer hover:bg-red-900/40 transition-colors w-full text-left mb-8 group">
          <input 
            type="checkbox" 
            checked={understood}
            onChange={(e) => setUnderstood(e.target.checked)}
            className="w-6 h-6 mt-1 sm:mt-0 rounded border-red-500 text-red-500 focus:ring-red-500 focus:ring-offset-gray-900 bg-black/50 cursor-pointer flex-shrink-0"
          />
          <span className="text-red-200 group-hover:text-white transition-colors text-sm sm:text-base">I confirm that I understand this cannot be undone and authorize destruction.</span>
        </label>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button 
            onClick={() => goToStep(STEPS.AUTHENTICATION)}
            className="flex-1 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          
          <motion.button
            whileHover={understood ? { scale: 1.02 } : {}}
            whileTap={understood ? { scale: 0.98 } : {}}
            onClick={() => goToStep(STEPS.WIPE_PROGRESS)}
            disabled={!understood}
            className={`flex-[2] py-4 rounded-xl font-bold transition-all uppercase tracking-widest ${
              understood 
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_30px_rgba(220,38,38,0.6)] border-red-500' 
                : 'bg-red-900/30 text-red-500/50 border-red-900/50 cursor-not-allowed'
            } border`}
          >
            Execute Protocol
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
};
