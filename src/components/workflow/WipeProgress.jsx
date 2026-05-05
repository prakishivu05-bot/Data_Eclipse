import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useWorkflowStore, STEPS } from '../../store/useWorkflowStore';
import { Terminal, Shield, Activity, Fingerprint } from 'lucide-react';
import { getDisk, wipeDisk, generateHash } from '../../services/FakeDiskService';

export const WipeProgress = () => {
  const { goToStep, selectedDisk, wipeProgress, setWipeProgress, logs, addLog, clearLogs, setHashes, setTimes } = useWorkflowStore();
  const [currentPass, setCurrentPass] = useState(1);
  const totalPasses = 3;
  const logsEndRef = useRef(null);

  const passNames = {
    1: 'Randomizing',
    2: 'Eliminating',
    3: 'Finalizing'
  };
  const passVerbs = {
    1: 'Randomizing data',
    2: 'Eliminating residual patterns',
    3: 'Final cryptographic overwrite'
  };

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    let isCancelled = false;

    const startWipe = async () => {
      const disk = getDisk();
      if (disk.wiped) {
        addLog(`[ERROR] Disk already wiped. Aborting.`);
        return;
      }

      const preHash = await generateHash(disk);
      setHashes(preHash, null);
      setTimes(new Date().toISOString(), null);

      clearLogs();
      addLog(`[INIT] Initializing wipe`);
      addLog(`[INIT] Target drive established: ${disk.name}`);
      addLog(`[INIT] Protocol: DoD 5220.22-M`);
      addLog(`[INIT] Pre-wipe SHA-256: ${preHash.substring(0, 16)}...`);
      addLog(`[INIT] Overwriting storage blocks...`);
      setWipeProgress(0);

      // Start wiping
      const finalDisk = await wipeDisk((pass, passes, progress) => {
        if (isCancelled) return;
        
        if (progress === 0 && pass > 1) {
          setCurrentPass(pass);
          setWipeProgress(0);
          addLog(`[PASS ${pass}] ${passVerbs[pass]}`);
        } else {
          setCurrentPass(pass);
          setWipeProgress(progress);
          if (progress < 100 && Math.random() > 0.6) {
            addLog(`[PASS ${pass}] ${passVerbs[pass]} at sector 0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase()}...`);
          }
        }
      });

      if (isCancelled) return;

      addLog(`[PASS 3] Pass completed and verified.`);
      const postHash = await generateHash(finalDisk);
      setHashes(preHash, postHash);
      setTimes(null, new Date().toISOString());

      addLog(`[SUCCESS] Wipe complete`);
      addLog(`[SUCCESS] Post-wipe SHA-256: ${postHash.substring(0, 16)}...`);
      addLog(`[VERIFY] Sampling sectors`);
      setTimeout(() => goToStep(STEPS.VERIFICATION), 1500);
    };

    startWipe();

    return () => { isCancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
      className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Visual Progress Side */}
      <div className="md:col-span-1 flex flex-col gap-6">
        <div className="glass-card rounded-2xl p-6 border-red-500/20 bg-red-950/10 flex flex-col items-center shadow-[0_0_30px_rgba(220,38,38,0.1)] relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 to-yellow-500 animate-pulse" />
          
          <h3 className="text-red-400 font-bold uppercase tracking-widest text-sm mb-6 w-full flex items-center justify-between">
            Active Operation <Activity className="w-4 h-4" />
          </h3>
          
          <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
            {/* Animated rings */}
            <div className="absolute inset-0 rounded-full border-t-2 border-red-500/50 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-2 rounded-full border-r-2 border-yellow-500/50 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            <div className="absolute inset-4 rounded-full border-b-2 border-purple-500/50 animate-spin" style={{ animationDuration: '1.5s' }} />
            
            <Fingerprint className="w-16 h-16 text-red-500/80 animate-pulse" />
          </div>

          <div className="text-center w-full text-white font-mono text-2xl font-bold tracking-wider">
            {isNaN(wipeProgress) ? 0 : Math.floor(wipeProgress)}%
          </div>
          <div className="text-red-300 text-xs font-mono mt-2 flex gap-2">
             <span>PASS {currentPass} / {totalPasses}</span> 
             <span>→</span> 
             <span>{passNames[currentPass]}</span>
          </div>
        </div>

        {/* Status Badges */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Integrity Check</span>
            <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded text-xs font-mono flex items-center gap-1">
              <Shield className="w-3 h-3" /> OK
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Overwrite Status</span>
            <span className={currentPass === 3 && wipeProgress === 100 ? "bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded text-xs font-mono" : "bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded text-xs font-mono"}>
              {currentPass === 3 && wipeProgress === 100 ? 'SUCCESS' : 'IN_PROGRESS'}
            </span>
          </div>
        </div>
      </div>

      {/* Terminal Log Side */}
      <div className="md:col-span-2 glass-card rounded-2xl border border-white/10 flex flex-col overflow-hidden bg-black/80 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative">
        {/* Terminal Header */}
        <div className="w-full bg-[#111] px-4 py-3 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-xs font-mono font-semibold">root@eclipse-sys:~# process.log</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
        </div>

        {/* Console output */}
        <div className="flex-1 p-5 overflow-y-auto font-mono text-sm text-gray-300 space-y-1.5 h-[400px]">
          {logs.map((log, i) => (
            <div key={i} className={`${
              log.includes('INIT') ? 'text-blue-400' :
              log.includes('VERIFY') ? 'text-purple-400' :
              log.includes('SUCCESS') ? 'text-green-400' :
              log.includes('PASS') ? 'text-gray-300' :
              'text-gray-400'
            }`}>
              <span className="text-gray-600 select-none">{new Date().toISOString().substring(11, 23)} &gt; </span>
              {log}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
        
        <div className="w-full h-1 bg-black">
          <motion.div 
            className="h-full bg-gradient-to-r from-red-600 via-purple-500 to-blue-500"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentPass - 1) * 33) + ((isNaN(wipeProgress) ? 0 : wipeProgress) * 0.33)}%` }}
            transition={{ ease: "linear", duration: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
};
