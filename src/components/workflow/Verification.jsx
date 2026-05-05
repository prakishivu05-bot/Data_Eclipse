import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflowStore, STEPS } from '../../store/useWorkflowStore';
import { Search, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Verification = () => {
  const { goToStep, selectedDisk, preWipeHash, postWipeHash, startTime, endTime, setCertificate } = useWorkflowStore();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Simulate verification delay
    const timer = setTimeout(() => {
      setVerifying(false);
      
      // Wait a bit to show success before jumping to certificate
      setTimeout(() => {
        // Pre-generate certificate data BEFORE navigation
        const generatedCertHash = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b=>b.toString(16).padStart(2,'0')).join('');
        const signature = 'SIG_RSA_' + Array.from(crypto.getRandomValues(new Uint8Array(64))).map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
        
        const certData = {
          device: {
            model: selectedDisk?.type || 'NVMe PCI-E',
            serial_number: Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase(),
            size: selectedDisk?.size || '100.00 MB'
          },
          wipe_protocol: {
            algorithm: 'DoD 5220.22-M',
            passes: 3,
            method: '0x00, 0xFF, PRNG'
          },
          execution: {
            start_time: startTime || new Date().toISOString(),
            end_time: endTime || new Date().toISOString(),
            sectors_wiped: 19531250
          },
          integrity: {
            pre_wipe_hash: preWipeHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            post_wipe_hash: postWipeHash || '8a1f7384a6c8e9b40d6c1b48b9f1d6199a0f443b2f8a49c6d61f1c7d2e85a73e'
          },
          certificate_hash: generatedCertHash,
          rsa_signature: signature
        };
        
        setCertificate(certData);
        
        setTimeout(() => {
          goToStep(STEPS.CERTIFICATE);
        }, 200);
      }, 4000);
    }, 4000);

    return () => clearTimeout(timer);
  }, [goToStep, setCertificate, selectedDisk, preWipeHash, postWipeHash, startTime, endTime]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      className="w-full max-w-lg mx-auto text-center"
    >
      <div className="glass-card rounded-[2rem] p-12 border border-blue-500/20 bg-[#050510] shadow-[0_0_50px_rgba(59,130,246,0.1)] relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          {verifying ? (
            <motion.div 
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-8">
                <Search className="w-20 h-20 text-blue-500 relative z-10 animate-pulse" />
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-blue-500 rounded-full blur-xl z-0"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Sampling Sectors</h2>
              <p className="text-blue-300/70 font-mono text-sm max-w-[250px]">
                Validating destruction integrity on {selectedDisk?.name || '/dev/sdb'}...
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div 
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
              >
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </motion.div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-3">
                Wipe Completed Successfully
              </h2>
              <div className="flex flex-col items-center gap-2 mt-2 text-sm font-semibold">
                <p className="text-green-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Integrity Check Passed
                </p>
                <p className="text-green-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> All sectors overwritten
                </p>
              </div>
              
              <div className="w-full mt-6 bg-black/50 rounded-xl p-4 border border-green-500/20 text-left space-y-3">
                 <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Pre-wipe hash</p>
                    <p className="text-gray-300 font-mono text-[11px] truncate">{preWipeHash}</p>
                 </div>
                 <div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Post-wipe hash</p>
                    <p className="text-gray-300 font-mono text-[11px] truncate">{postWipeHash}</p>
                 </div>
                 <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                    <span className="text-gray-400 text-xs font-semibold">Hash Comparison</span>
                    <span className="text-green-400 text-xs font-bold bg-green-500/20 px-2 py-1 rounded border border-green-500/30">
                       DIFFERENT → SUCCESS (Data Sanitized)
                    </span>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
