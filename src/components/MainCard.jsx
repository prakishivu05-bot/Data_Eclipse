import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HardDrive, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';

const MainCard = () => {
  const [wipingState, setWipingState] = useState('idle'); // idle | wiping | complete

  const handleWipe = () => {
    setWipingState('wiping');
    
    // Simulate process
    setTimeout(() => {
      setWipingState('complete');
    }, 4000);
  };

  return (
    <div className="glass-card rounded-2xl p-8 relative overflow-hidden group border border-white/10 transition-all duration-500 hover:border-purple-500/30">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col items-center">
        <h3 className="text-2xl font-semibold mb-8 text-white flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-purple-400" />
          Secure Wipe Environment
        </h3>
        
        <div className="w-full bg-black/40 rounded-xl p-6 mb-8 border border-white/5 space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="text-gray-400 text-sm uppercase tracking-wider">Detected Disk</span>
            <span className="font-mono text-blue-300 flex items-center gap-2">
              <HardDrive className="w-4 h-4" />
              demo_disk.img
            </span>
          </div>
          
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <span className="text-gray-400 text-sm uppercase tracking-wider">Target Size</span>
            <span className="font-mono text-gray-200">100MB</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm uppercase tracking-wider">Status</span>
            <span className={`font-mono font-semibold flex items-center gap-2 ${
              wipingState === 'idle' ? 'text-green-400' :
              wipingState === 'wiping' ? 'text-yellow-400' : 'text-blue-400'
            }`}>
              {wipingState === 'idle' && 'Ready'}
              {wipingState === 'wiping' && <><Loader2 className="w-4 h-4 animate-spin" /> Wiping in progress...</>}
              {wipingState === 'complete' && <><ShieldCheck className="w-4 h-4" /> Wipe Verified</>}
            </span>
          </div>
        </div>

        {wipingState === 'idle' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWipe}
            className="w-full relative px-6 py-4 rounded-xl font-bold text-lg text-white overflow-hidden group shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300 group-hover:opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10" />
            <span className="relative z-10 drop-shadow-md flex justify-center items-center gap-2">
               Start Secure Wipe
            </span>
          </motion.button>
        )}

        {wipingState === 'wiping' && (
          <div className="w-full py-4 rounded-xl font-bold text-lg text-yellow-100 bg-yellow-900/40 border border-yellow-500/30 text-center animate-pulse">
            Processing... Please Wait
          </div>
        )}

        {wipingState === 'complete' && (
            <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full py-4 rounded-xl font-bold text-lg text-blue-100 bg-blue-900/40 border border-blue-500/30 text-center shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:bg-blue-800/50 transition-colors"
          >
            View Verification Certificate
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default MainCard;
