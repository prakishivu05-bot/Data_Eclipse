import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, Fingerprint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Process = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentPass, setCurrentPass] = useState(1);
  const totalPasses = 3;

  useEffect(() => {
    // Simulate wipe progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          if (currentPass < totalPasses) {
            setCurrentPass(cp => cp + 1);
            return 0; // reset for next pass
          } else {
            clearInterval(interval);
            setTimeout(() => navigate('/certificate'), 1000);
            return 100;
          }
        }
        // Random increment between 2 to 7
        return p + Math.floor(Math.random() * 5 + 2);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [currentPass, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[50vh]"
    >
      <div className="relative w-40 h-40 mb-12 flex items-center justify-center">
        {/* Animated rings */}
        <div className="absolute inset-0 rounded-full border-t-2 border-red-500 animate-spin" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-2 rounded-full border-r-2 border-yellow-500 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
        <div className="absolute inset-4 rounded-full border-b-2 border-purple-500 animate-spin" style={{ animationDuration: '1.5s' }} />
        
        <Fingerprint className="w-16 h-16 text-red-500 animate-pulse" />
      </div>

      <div className="w-full space-y-6 text-center">
        <h2 className="text-3xl font-bold tracking-widest text-red-500 uppercase flex items-center justify-center gap-3">
          <AlertTriangle className="w-8 h-8" />
          Data Destruction in Progress
        </h2>

        <div className="w-full bg-[#030014] border border-white/10 rounded-xl p-8 relative overflow-hidden glass-card shadow-[0_0_40px_rgba(220,38,38,0.15)]">
          <div className="flex justify-between items-end mb-4">
            <div className="text-left">
              <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">Current Operation</p>
              <p className="font-mono text-xl text-white">DoD 5220.22-M Wipe</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">Pass {currentPass} / {totalPasses}</p>
              <p className="font-mono text-xl text-yellow-400">{currentPass === 1 ? 'Zeroing' : currentPass === 2 ? 'Random Data' : 'Verification'}</p>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-4 bg-black/60 rounded-full overflow-hidden border border-white/10 relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-red-600 to-yellow-500"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.2 }}
            />
          </div>
          
          <div className="flex justify-between mt-3 text-sm font-mono text-gray-400">
            <span>Sector 0x00A0F</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Process;
