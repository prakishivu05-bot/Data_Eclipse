import React from 'react';
import { motion } from 'framer-motion';
import { HardDrive, ShieldAlert, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Setup = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden group border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none opacity-50" />
        
        <div className="relative z-10 flex flex-col items-center">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          >
            <ShieldAlert className="w-10 h-10 text-purple-400" />
          </motion.div>

          <h3 className="text-3xl font-bold mb-2 text-white tracking-tight">
            Target Selection
          </h3>
          <p className="text-gray-400 mb-8 text-center">Verify the destination drive before issuing the wipe command.</p>
          
          <div className="w-full bg-[#050510]/80 rounded-2xl p-6 mb-8 border border-white/5 space-y-5 shadow-inner">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-gray-400" /> Drive
              </span>
              <span className="font-mono text-purple-300 font-bold bg-purple-900/30 px-3 py-1 rounded-md border border-purple-500/20">
                /dev/sdb (demo_disk.img)
              </span>
            </div>
            
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
                <Cpu className="w-4 h-4 text-gray-400" /> Interface
              </span>
              <span className="font-mono text-gray-200">NVMe PCI-E</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-widest">Target Size</span>
              <span className="font-mono text-gray-200">100.00 MB</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/process')}
            className="w-full relative py-5 rounded-2xl font-bold text-lg text-white overflow-hidden group shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all border border-red-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-900 transition-all duration-300 group-hover:from-red-500 group-hover:to-red-800" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-30" />
            <span className="relative z-10 drop-shadow-md flex justify-center items-center gap-2 tracking-wider">
               ARM & EXECUTE WIPE
            </span>
          </motion.button>
          
          <button 
            onClick={() => navigate('/')}
            className="mt-6 text-gray-500 hover:text-gray-300 transition-colors text-sm font-medium"
          >
            Cancel & Return
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Setup;
