import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HardDrive, ShieldAlert, Cpu, ArrowLeft, ShieldCheck, FileText, Info, AlertTriangle } from 'lucide-react';
import { useWorkflowStore, STEPS } from '../../store/useWorkflowStore';
import { getDisk } from '../../services/FakeDiskService';
export const TargetSelection = () => {
  const { goToStep, setSelectedDisk, selectedDisk } = useWorkflowStore();
  const [diskState, setDiskState] = useState(null);
  const [showWipedModal, setShowWipedModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("JUST_RESET") === "true") {
      setShowToast(true);
      sessionStorage.removeItem("JUST_RESET");
      setTimeout(() => setShowToast(false), 5000);
    }
    
    const disk = getDisk();
    setDiskState(disk);
    setSelectedDisk({
      id: disk.id,
      name: disk.name,
      size: disk.size,
      type: disk.type,
      image: disk.image
    });
  }, [setSelectedDisk]);

  const handleContinue = () => {
    if (diskState?.wiped) {
      setShowWipedModal(true);
      return;
    }
    goToStep(STEPS.AUTHENTICATION);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden group border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
        
        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          >
            <ShieldAlert className="w-10 h-10 text-purple-400" />
          </motion.div>

          <div className="flex items-center gap-3 mb-2 relative group cursor-help">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-center">
              Target Selection
            </h3>
            <Info className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 border border-gray-700 text-xs text-gray-300 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
              This system uses a 3-pass overwrite algorithm and SHA-256 hashing to simulate secure data destruction and verification.
            </div>
          </div>
          
          <p className="text-gray-400 mb-6 text-center text-sm sm:text-base px-2">Verify the destination drive before issuing the wipe command.</p>
          
          {/* Disk State Indicator */}
          <div className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-center mb-8 border ${diskState?.wiped ? 'bg-green-950/40 text-green-400 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-red-950/40 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]'}`}>
            Disk Status: {diskState?.wiped ? 'SECURELY WIPED' : 'ACTIVE (Sensitive Data Present)'}
          </div>
          
          <div className="w-full bg-[#050510]/80 rounded-2xl p-6 mb-8 border border-white/5 space-y-5 shadow-inner">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-4 gap-2 sm:gap-4">
              <span className="text-gray-500 text-sm sm:text-base font-semibold uppercase tracking-widest flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-gray-400" /> Drive
              </span>
              <span className="font-mono text-purple-300 font-bold bg-purple-900/30 px-3 py-2 rounded-md border border-purple-500/20 text-sm sm:text-base break-all w-full sm:w-auto text-left sm:text-right">
                {selectedDisk?.name} ({selectedDisk?.image})
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-4 gap-2 sm:gap-4">
              <span className="text-gray-500 text-sm sm:text-base font-semibold uppercase tracking-widest flex items-center gap-2">
                <Cpu className="w-5 h-5 text-gray-400" /> Interface
              </span>
              <span className="font-mono text-gray-200 text-sm sm:text-base">{selectedDisk?.type}</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-4 gap-2 sm:gap-4">
              <span className="text-gray-500 text-sm sm:text-base font-semibold uppercase tracking-widest">Target Size</span>
              <span className="font-mono text-gray-200 text-sm sm:text-base">{selectedDisk?.size}</span>
            </div>

            <div className="flex flex-col gap-2 pt-2">
               {diskState?.wiped ? (
                 <div className="flex flex-col items-center justify-center py-6 bg-green-900/10 border border-green-500/20 rounded-xl">
                   <ShieldCheck className="w-10 h-10 text-green-500 mb-3" />
                   <span className="text-green-400 font-bold uppercase tracking-widest text-sm mb-2">SECURELY WIPED</span>
                   <span className="text-gray-300 text-sm mt-1 text-center px-4 leading-relaxed">
                     All storage blocks have been overwritten with cryptographic noise. Original data is permanently destroyed and cannot be recovered.
                   </span>
                   <div className="mt-4 px-6 py-3 bg-black/40 rounded-lg border border-white/5 mx-4">
                     <span className="text-gray-400 text-xs text-center block">
                       This disk state is persistent. Even if the system is restarted, the wiped data will not return unless manually reset.
                     </span>
                   </div>
                 </div>
               ) : (
                 <>
                   <span className="text-red-400 text-xs font-semibold uppercase tracking-widest mb-1 flex items-center gap-2">
                      <ShieldAlert className="w-3 h-3" /> Detected Sensitive Data
                   </span>
                   <span className="text-gray-400 text-xs mb-2 block">
                     This system simulates a real storage disk containing sensitive user data. These files are currently stored and recoverable.
                   </span>
                   {diskState?.files.map((file, i) => (
                     <div key={i} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg border border-white/5">
                       <span className="font-mono text-gray-300 text-xs flex items-center gap-2">
                         <FileText className="w-3 h-3 text-blue-400" /> {file.name}
                       </span>
                       <span className="font-mono text-gray-500 text-[10px]">{file.type.toUpperCase()}</span>
                     </div>
                   ))}
                 </>
               )}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            className={`w-full relative py-4 rounded-xl font-bold text-sm sm:text-base text-white overflow-hidden group shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all border ${diskState?.wiped ? 'border-green-500/50' : 'border-blue-500/50'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r transition-all duration-300 ${diskState?.wiped ? 'from-green-600 to-emerald-900 group-hover:from-green-500 group-hover:to-emerald-800' : 'from-blue-600 to-indigo-900 group-hover:from-blue-500 group-hover:to-indigo-800'}`} />
            <span className="relative z-10 drop-shadow-md flex justify-center items-center gap-2 tracking-wider">
               {diskState?.wiped ? "Disk Already Wiped" : "Select Target & Continue"}
            </span>
          </motion.button>
          
          <button 
            onClick={() => goToStep(STEPS.LANDING)}
            className="mt-6 text-gray-500 hover:text-gray-300 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Initialization
          </button>
        </div>
      </div>

      {/* Already Wiped Modal */}
      {showWipedModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-[#0a0a10] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Disk Already Wiped</h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              This disk has already been securely wiped. No recoverable data remains.
            </p>
            <p className="text-gray-500 text-xs mb-8">
              Reset the system to simulate a new device.
            </p>
            
            <div className="flex flex-col sm:flex-row w-full gap-3 mt-4">
              <button 
                onClick={() => setShowWipedModal(false)}
                className="flex-1 w-full sm:w-auto py-4 px-4 rounded-xl font-semibold bg-gray-800 hover:bg-gray-700 text-white transition-all border border-white/10 text-sm sm:text-base"
              >
                Acknowledge
              </button>
              <button 
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                className="flex-1 w-full sm:w-auto py-4 px-4 rounded-xl font-semibold bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all text-sm sm:text-base"
              >
                Reset Demo
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Reset Toast */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-red-900/90 backdrop-blur-md border border-red-500/50 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.3)]"
        >
          <ShieldAlert className="w-5 h-5 text-red-400" />
          <span className="text-red-100 font-medium text-sm">New device initialized. Sensitive data detected.</span>
        </motion.div>
      )}
    </motion.div>
  );
};
