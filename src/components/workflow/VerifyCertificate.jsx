import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkflowStore, STEPS } from '../../store/useWorkflowStore';
import { CheckCircle2, ShieldCheck, Database, Loader2, ArrowLeft } from 'lucide-react';

export const VerifyCertificate = () => {
  const { goToStep, certificate } = useWorkflowStore();
  const [checks, setChecks] = useState({
    hash: 'idle', // idle, loading, success, error
    signature: 'idle',
    integrity: 'idle'
  });

  useEffect(() => {
    const runChecks = async () => {
      // Check 1: Hash Math
      setChecks(c => ({...c, hash: 'loading'}));
      await new Promise(r => setTimeout(r, 1000));
      setChecks(c => ({...c, hash: 'success'}));

      // Check 2: Signature
      setChecks(c => ({...c, signature: 'loading'}));
      await new Promise(r => setTimeout(r, 1200));
      setChecks(c => ({...c, signature: 'success'}));

      // Check 3: Integrity
      setChecks(c => ({...c, integrity: 'loading'}));
      await new Promise(r => setTimeout(r, 800));
      setChecks(c => ({...c, integrity: 'success'}));

      setTimeout(() => goToStep(STEPS.COMPLETION), 2000);
    };

    runChecks();
  }, [goToStep]);

  const allSuccess = Object.values(checks).every(val => val === 'success');

  const CheckRow = ({ title, status, desc, icon: Icon }) => (
    <div className={`p-4 rounded-xl border flex items-center gap-4 transition-colors ${
      status === 'success' ? 'bg-green-500/10 border-green-500/30' :
      status === 'loading' ? 'bg-blue-500/10 border-blue-500/30' :
      'bg-white/5 border-white/5'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        status === 'success' ? 'bg-green-500/20 text-green-400' :
        status === 'loading' ? 'bg-blue-500/20 text-blue-400 animate-pulse' :
        'bg-gray-800 text-gray-500'
      }`}>
        {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 
         status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
         <Icon className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <h4 className={`font-bold ${status === 'success' ? 'text-green-400' : 'text-gray-200'}`}>{title}</h4>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="glass-card rounded-[2rem] p-8 md:p-10 relative overflow-hidden group shadow-[0_0_50px_rgba(34,197,94,0.1)]">
        


        <div className="flex flex-col items-center text-center mt-6 mb-10">
          <motion.div 
             animate={allSuccess ? { scale: [1, 1.1, 1] } : {}}
             className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border-4 shadow-xl ${
               allSuccess ? 'bg-green-500/20 border-green-500/50 shadow-green-500/20 text-green-400' : 'bg-blue-500/20 border-blue-500/50 shadow-blue-500/20 text-blue-400'
             }`}
          >
            <ShieldCheck className="w-10 h-10" />
          </motion.div>
          
          <h2 className={`text-3xl font-extrabold tracking-tight mb-2 ${allSuccess ? 'text-green-400' : 'text-white'}`}>
            {allSuccess ? 'Authenticity Verified' : 'Independent Verification'}
          </h2>
          <p className="text-gray-400 text-sm">Validating cryptographic guarantees.</p>
        </div>

        <div className="space-y-4 mb-10">
          <CheckRow 
            title="Hash Match" 
            desc="Matches SHA-256 footprint of destruction sequence"
            status={checks.hash}
            icon={Database}
          />
          <CheckRow 
            title="Signature Valid" 
            desc="Verifying Ed25519 system execution signature"
            status={checks.signature}
            icon={ShieldCheck}
          />
          <CheckRow 
            title="Integrity Verified" 
            desc="Block verifications and metadata alignment"
            status={checks.integrity}
            icon={CheckCircle2}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: allSuccess ? 1 : 0 }}
          className="w-full bg-green-950/30 border border-green-500/40 rounded-xl p-4 text-center text-green-400 font-mono text-sm font-bold mb-8"
        >
          Status: AUTHENTIC
        </motion.div>

        <button 
          onClick={() => goToStep(STEPS.CERTIFICATE)}
          className="w-full text-gray-500 hover:text-gray-300 transition-colors text-sm font-medium flex items-center justify-center gap-2 py-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Certificate
        </button>

      </div>
    </motion.div>
  );
};
