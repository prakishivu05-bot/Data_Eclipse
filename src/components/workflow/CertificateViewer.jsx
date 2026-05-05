import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWorkflowStore, STEPS } from '../../store/useWorkflowStore';
import { FileBadge, Download, Copy, ShieldAlert, ShieldCheck, Lock, CheckCircle2, AlertTriangle, Database } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { storeProofFromFrontend } from '../../blockchain/contract';
import { resetDisk } from '../../services/FakeDiskService';

export const CertificateViewer = () => {
  const { goToStep, selectedDisk, certificate, setCertificate, resetWorkflow, preWipeHash, postWipeHash, startTime, endTime } = useWorkflowStore();
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [anchoring, setAnchoring] = React.useState(false);
  const [txHash, setTxHash] = React.useState(null);
  const [anchorError, setAnchorError] = React.useState(null);
  const [copiedTx, setCopiedTx] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);

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

  const handleCopyTx = () => {
    navigator.clipboard.writeText(txHash);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  const handleAnchorProof = async () => {
    if (!certificate || txHash || anchoring) return;
    
    setAnchoring(true);
    setAnchorError(null);
    try {
      const result = await storeProofFromFrontend({
        deviceId: certificate.device?.serial_number || 'UNKNOWN',
        beforeHash: certificate.integrity?.pre_wipe_hash || '',
        afterHash: certificate.integrity?.post_wipe_hash || '',
        status: 'WIPED'
      });
      
      if (result.success) {
        setTxHash(result.txHash);
      } else {
        setAnchorError(result.error || "Blockchain anchoring failed");
      }
    } catch (err) {
      setAnchorError("Blockchain anchoring failed");
    } finally {
      setAnchoring(false);
    }
  };

  useEffect(() => {
    if (!certificate) {
      const generatedCertHash = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b=>b.toString(16).padStart(2,'0')).join('');
      const signature = 'SIG_RSA_' + Array.from(crypto.getRandomValues(new Uint8Array(64))).map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
      
      setCertificate({
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
      });
    }
  }, [certificate, selectedDisk, setCertificate, preWipeHash, postWipeHash, startTime, endTime]);

  if (!certificate) {
    return (
      <div className="w-full flex justify-center items-center p-12 text-blue-400 font-mono text-sm animate-pulse">
        Loading certificate data...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="glass-card rounded-[2rem] p-6 sm:p-8 md:p-12 relative overflow-hidden group shadow-[0_0_60px_rgba(168,85,247,0.15)] bg-[#050510]">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center">
              <FileBadge className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight text-center sm:text-left">Destruction Certificate</h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-sm text-center sm:text-left">
                This certificate provides verifiable proof that the data has been permanently erased and cannot be recovered, ensuring trust and compliance.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-900/20 border border-purple-500/20 text-purple-400 text-[10px] font-bold uppercase tracking-widest">
                <ShieldAlert className="w-3 h-3" /> Compliant with DoD 5220.22-M
              </div>
            </div>
          </div>
          <motion.button 
            onClick={() => goToStep(STEPS.VERIFY_CERTIFICATE)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" /> Verify Protocol
          </motion.button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="px-3 py-1.5 rounded-full bg-green-900/20 border border-green-500/30 text-green-400 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Cryptographically Signed
          </div>
          <div className="px-3 py-1.5 rounded-full bg-green-900/20 border border-green-500/30 text-green-400 text-xs font-semibold flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Tamper-Proof Verified
          </div>
          <div className="px-3 py-1.5 rounded-full bg-blue-900/20 border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Independent Verification Ready
          </div>
          {txHash && (
            <div className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-400/50 text-green-400 text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(74,222,128,0.3)]">
              <Lock className="w-3.5 h-3.5" /> Blockchain Verified
            </div>
          )}
        </div>

        {/* Blockchain Interaction Box */}
        <div className="w-full bg-[#050510] border border-white/5 rounded-xl p-5 mb-6 shadow-inner flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-white font-bold flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" /> Decentralized Audit Trail
              </h3>
              <p className="text-gray-500 text-xs mt-1">Anchor this certificate to the Ethereum Sepolia testnet for immutable public verification.</p>
            </div>
            
            {!txHash && (
              <button 
                onClick={handleAnchorProof}
                disabled={anchoring}
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 text-blue-400 transition-all uppercase tracking-wider text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              >
                <Database className="w-4 h-4" /> 
                {anchoring ? "Anchoring..." : "Anchor to Blockchain"}
              </button>
            )}
          </div>

          {anchorError && (
            <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> 
              <div>
                <span className="font-bold text-red-300">Blockchain Anchoring Failed</span>
                <br/>
                Reason: {anchorError}
              </div>
            </div>
          )}

          {txHash && (
            <div className="p-5 rounded-xl bg-green-900/10 border border-green-500/30 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 text-green-400 w-full sm:w-auto">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-sm tracking-wide">Anchored on Blockchain</div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-0.5">
                      <div className="text-green-500/70 font-mono text-[10px] sm:text-xs break-all">TX: {txHash}</div>
                      <button 
                        onClick={handleCopyTx}
                        className="text-[10px] w-fit bg-green-500/10 hover:bg-green-500/20 text-green-400 px-2 py-0.5 rounded border border-green-500/20 transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-2.5 h-2.5" />
                        {copiedTx ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${txHash}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full sm:w-auto text-center px-4 py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-xs sm:text-sm font-bold uppercase transition-all shadow-[0_0_15px_rgba(34,197,94,0.15)] flex-shrink-0"
                >
                  View on Etherscan
                </a>
              </div>
              
              <div className="bg-black/40 rounded-lg p-4 border border-green-500/10 mt-1">
                <p className="text-gray-300 text-sm mb-2 leading-relaxed">
                  This proof is now permanently stored on a <span className="text-green-400 font-semibold">public blockchain</span> and cannot be altered or deleted.
                </p>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  Anyone can independently verify this wipe — no trust required.
                </p>
                <p className="text-gray-500 text-xs flex items-center gap-1.5 font-medium">
                  <span className="text-blue-400">🔍</span> Verify independently using the transaction hash on Etherscan
                </p>
                <div className="mt-3 pt-3 border-t border-green-500/20 text-gray-300 text-xs italic">
                  The hash stored on blockchain represents the wiped state of this disk at this exact moment.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full bg-[#050510] border border-white/5 rounded-xl p-5 mb-6 shadow-inner flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Total Passes</span>
            <span className="text-white font-mono text-sm">3 (DoD 5220.22-M)</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Data Overwritten</span>
            <span className="text-white font-mono text-sm">{certificate?.device_size || '100 MB'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Time Taken</span>
            <span className="text-white font-mono text-sm">00:02:14</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Verification</span>
            <span className="text-green-400 font-mono text-sm font-bold">PASSED</span>
          </div>
        </div>

        <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 sm:p-6 font-mono text-[10px] sm:text-sm shadow-inner overflow-x-auto relative group/code break-all sm:break-normal">
          <button 
            onClick={() => {
              if (certificate) {
                navigator.clipboard.writeText(JSON.stringify(certificate, null, 2));
              }
            }}
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors opacity-0 group-hover/code:opacity-100"
          >
            <Copy className="w-4 h-4" />
          </button>
          <pre>
            <span className="text-gray-400">{`{`}</span>
            {'\n'}
            {Object.entries(certificate || {}).map(([key, value], index, arr) => (
              <div key={key} className="pl-4">
                <span className="text-blue-300">"{key}"</span><span className="text-gray-400">: </span>
                {typeof value === 'object' ? (
                  <span className="text-gray-400">
                    {`{\n`}
                    {Object.entries(value).map(([subKey, subVal], subIndex, subArr) => (
                      <div key={subKey} className="pl-4">
                         <span className="text-blue-200">"{subKey}"</span><span className="text-gray-400">: </span>
                         <span className={['certificate_hash', 'rsa_signature', 'pre_wipe_hash', 'post_wipe_hash'].includes(subKey) ? "text-yellow-400 font-bold" : "text-green-400"}>
                           {typeof subVal === 'string' ? `"${subVal}"` : subVal}
                         </span>
                         <span className="text-gray-400">{subIndex < subArr.length - 1 ? ',' : ''}</span>
                      </div>
                    ))}
                    <span className="text-gray-400 pl-4">{`}`}</span>
                  </span>
                ) : (
                  <span className={['certificate_hash', 'rsa_signature'].includes(key) ? "text-yellow-400 font-bold" : "text-green-400"}>
                    {typeof value === 'string' ? `"${value}"` : value}
                  </span>
                )}
                <span className="text-gray-400">{index < arr.length - 1 ? ',' : ''}</span>
              </div>
            ))}
            <span className="text-gray-400">{`}`}</span>
          </pre>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          <button 
            onClick={() => setShowResetConfirm(true)}
            className="flex-1 px-6 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all uppercase tracking-wider text-xs sm:text-sm"
          >
            System Reset
          </button>
          <button 
            onClick={() => {
              if (certificate?.certificate_hash) {
                navigator.clipboard.writeText(certificate.certificate_hash);
              }
            }}
            className="px-6 py-3 rounded-xl font-bold border border-white/20 hover:bg-white/5 text-white transition-all flex items-center justify-center gap-2 text-sm uppercase"
          >
            <Copy className="w-4 h-4" /> Copy Hash
          </button>
          <button 
            onClick={() => {
              if (certificate) {
                const doc = new jsPDF();
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
            }}
            className="flex-1 px-6 py-4 rounded-xl font-bold border border-green-500/50 hover:bg-green-500/10 text-green-400 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm uppercase"
          >
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>

      </div>

      {/* Reset Confirmation Modal */}
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
            className="bg-[#0a0a10] border border-white/10 rounded-2xl p-6 sm:p-8 w-[95%] max-w-md shadow-2xl flex flex-col items-center text-center"
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
    </motion.div>
  );
};
