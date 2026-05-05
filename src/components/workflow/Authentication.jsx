import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWorkflowStore, STEPS } from '../../store/useWorkflowStore';
import { Lock, Unlock, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

export const Authentication = () => {
  const { goToStep, setAuthenticated } = useWorkflowStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | error | success
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setStatus('error');
      setErrorMsg('Credentials required');
      return;
    }

    setStatus('loading');
    
    // Simulate auth
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        setStatus('success');
        setAuthenticated(true);
        setTimeout(() => goToStep(STEPS.CONFIRMATION), 1200);
      } else {
        setStatus('error');
        setErrorMsg('Invalid authorization credentials');
      }
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card rounded-2xl p-8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-500 border ${
            status === 'success' ? 'bg-green-500/20 border-green-500/50' :
            status === 'error' ? 'bg-red-500/20 border-red-500/50' : 
            'bg-blue-500/20 border-blue-500/50'
          }`}>
            {status === 'success' ? <Unlock className="w-8 h-8 text-green-400" /> : <Lock className="w-8 h-8 text-blue-400" />}
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">System Authorization</h2>
          <p className="text-gray-400 text-sm mt-1">Elevated privileges required</p>
        </div>

        {status === 'error' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {errorMsg}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => { setUsername(e.target.value); setStatus('idle'); }}
              disabled={status === 'loading' || status === 'success'}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Security Key</label>
            <input 
              type="password" 
              value={password}
              onChange={e => { setPassword(e.target.value); setStatus('idle'); }}
              disabled={status === 'loading' || status === 'success'}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors tracking-widest disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={status === 'idle' || status === 'error' ? { scale: 1.02 } : {}}
            whileTap={status === 'idle' || status === 'error' ? { scale: 0.98 } : {}}
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
              status === 'success' ? 'bg-green-600/80 border-green-500/50 pointer-events-none' :
              'bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
            }`}
          >
            {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
            {status === 'success' ? 'Authorized' : status === 'loading' ? 'Authenticating...' : 'Authorize Action'}
          </motion.button>
        </form>

        <button 
          onClick={() => goToStep(STEPS.TARGET_SELECTION)}
          disabled={status === 'loading' || status === 'success'}
          className="w-full mt-4 text-gray-500 hover:text-gray-300 transition-colors text-sm font-medium py-2 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Target Selection
        </button>
      </div>
      
      {/* Help text */}
      <p className="text-center mt-6 text-xs text-gray-600 font-mono">
        DEMO LOGIN: admin / admin
      </p>
    </motion.div>
  );
};
