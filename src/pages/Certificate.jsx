import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Download, CheckCircle2, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Certificate = () => {
  const navigate = useNavigate();
  // Fake hash
  const certHash = "a7f8d9b0...3e4c";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="glass-card rounded-[2rem] p-10 md:p-14 relative overflow-hidden group border border-green-500/30 shadow-[0_0_60px_rgba(34,197,94,0.15)] bg-green-900/10">
        
        {/* Certificate Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <ShieldCheck className="w-96 h-96" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
          >
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </motion.div>

          <h2 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
            Wipe Verified
          </h2>
          <p className="text-green-200/70 mb-10 tracking-widest uppercase text-sm">Certificate of Data Destruction</p>
          
          <div className="w-full text-left bg-black/60 rounded-xl p-8 border border-green-500/20 shadow-inner mb-10 font-mono text-sm space-y-4">
            <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-3">
              <span className="text-gray-500 col-span-1">Target Drive:</span>
              <span className="text-gray-300 col-span-2">/dev/sdb (100MB)</span>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-3">
              <span className="text-gray-500 col-span-1">Method:</span>
              <span className="text-gray-300 col-span-2">DoD 5220.22-M (3 Passes)</span>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-3">
              <span className="text-gray-500 col-span-1">Timestamp:</span>
              <span className="text-gray-300 col-span-2">{new Date().toISOString()}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-gray-500 col-span-1">Signature:</span>
              <span className="text-emerald-400 col-span-2 flex items-center gap-2">
                {certHash} <Copy className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button className="flex-1 py-4 rounded-xl font-bold border border-green-500/50 hover:bg-green-500/10 text-green-400 transition-all flex items-center justify-center gap-2 group">
              <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" /> Download PDF
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex-1 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
            >
              Return Home
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Certificate;
