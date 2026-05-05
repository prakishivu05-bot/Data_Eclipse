import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkflowStore, STEPS } from '../../store/useWorkflowStore';
import { CheckCircle2, Download, ShieldCheck, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { resetDisk } from '../../services/FakeDiskService';

export const Completion = () => {
  const { resetWorkflow, certificate } = useWorkflowStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    await new Promise((r) => setTimeout(r, 800));
    
    const ok = resetDisk();
    if (ok) {
      window.location.reload();
    } else {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleDownloadReport = () => {
    if (certificate) {
      const doc = new jsPDF();
      
      // Header
      doc.setFont("courier", "bold");
      doc.setFontSize(22);
      doc.text("DATA ECLIPSE", 20, 20);
      doc.setFontSize(14);
      doc.text("CERTIFICATE OF DESTRUCTION", 20, 30);
      
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);
      
      doc.setFontSize(10);
      doc.setFont("courier", "normal");
      
      let y = 45;
      const addSection = (title, data) => {
        doc.setFont("courier", "bold");
        doc.text(title, 20, y);
        y += 7;
        doc.setFont("courier", "normal");
        Object.entries(data).forEach(([key, val]) => {
          const text = `${key.replace(/_/g, ' ').toUpperCase()}: ${val}`;
          const lines = doc.splitTextToSize(text, 170);
          doc.text(lines, 20, y);
          y += (lines.length * 5) + 2;
        });
        y += 5;
      };
      
      doc.text(`CERTIFICATE HASH: ${certificate.certificate_hash}`, 20, y);
      y += 10;
      
      addSection("DEVICE DETAILS", certificate.device || {});
      addSection("WIPE PROTOCOL", certificate.wipe_protocol || {});
      addSection("EXECUTION", certificate.execution || {});
      addSection("INTEGRITY VERIFICATION", certificate.integrity || {});
      
      doc.setFont("courier", "bold");
      doc.text("FINAL STATUS: PASSED (DATA SANITIZED)", 20, y);
      y += 15;
      
      doc.line(20, y, 190, y);
      y += 10;
      
      doc.setFontSize(8);
      const sigText = doc.splitTextToSize(`RSA SIGNATURE:\n${certificate.rsa_signature}`, 170);
      doc.text(sigText, 20, y);
      
      doc.save(`eclipse_certificate_${certificate.device?.serial_number || 'report'}.pdf`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="glass-card rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-[0_0_80px_rgba(34,197,94,0.15)] flex flex-col items-center text-center bg-[#050510]">
        
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-green-400" />

        <motion.div 
          initial={{ rotate: -90, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-green-500/20 border-4 border-green-500/50 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)] text-green-400"
        >
          <ShieldCheck className="w-12 h-12" />
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-8 tracking-tight">
          Data Erasure Complete
        </h2>
        
        <div className="w-full bg-black/60 rounded-xl p-6 border border-green-500/20 mb-8 text-left space-y-4 shadow-inner">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-gray-200">Device securely wiped</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-gray-200">Verification successful</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-gray-200">Certificate generated</span>
          </div>
        </div>

        <div className="mb-10 w-full py-4 bg-green-950/30 border border-green-500/40 rounded-xl flex items-center justify-center gap-3 text-green-400 font-mono text-lg font-bold tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.1)]">
          <ShieldCheck className="w-6 h-6" /> SYSTEM STATUS: TRUSTED
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <button 
            onClick={handleDownloadReport}
            className="flex-1 py-4 rounded-xl font-bold border border-green-500/50 hover:bg-green-500/10 text-green-400 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
          >
            <Download className="w-5 h-5" /> Download Report
          </button>
          
          <button 
            onClick={() => setShowResetConfirm(true)}
            className="flex-1 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
          >
            <RefreshCw className="w-5 h-5" /> Start New Session
          </button>
        </div>

        <button 
          onClick={() => goToStep(STEPS.CERTIFICATE)}
          className="w-full mt-6 text-gray-500 hover:text-gray-300 transition-colors text-sm font-medium flex items-center justify-center gap-2 py-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Certificate
        </button>

      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0a0a10] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Reset System?</h3>
              <p className="text-gray-400 text-sm mb-2">
                This will simulate a brand-new device with fresh data. All current wipe state will be cleared (blockchain records remain unchanged).
              </p>
              <p className="text-yellow-400 text-xs mb-8 font-semibold">
                Reset will simulate a new device. Previously wiped data will remain permanently destroyed unless reset.
              </p>
              
              <div className="flex flex-col sm:flex-row w-full gap-3">
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-semibold border border-white/10 hover:bg-white/5 text-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReset}
                  disabled={isResetting}
                  className="flex-1 py-3 rounded-xl font-semibold bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all disabled:opacity-50"
                >
                  {isResetting ? "Reinitializing disk..." : "Confirm Reset"}
                </button>
              </div>
              <button 
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                className="mt-6 text-gray-600 hover:text-gray-400 text-[10px] uppercase tracking-wider transition-colors underline decoration-gray-700 underline-offset-4"
              >
                Force Reset (Debug)
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
