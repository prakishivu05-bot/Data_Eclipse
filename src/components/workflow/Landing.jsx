import React from 'react';
import Header from '../Header';
import Features from '../Features';
import { motion } from 'framer-motion';
import { useWorkflowStore, STEPS } from '../../store/useWorkflowStore';
import { ArrowRight } from 'lucide-react';

export const Landing = () => {
  const goToStep = useWorkflowStore(state => state.goToStep);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-16"
    >
      <Header />
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => goToStep(STEPS.TARGET_SELECTION)}
        className="relative px-8 py-5 rounded-2xl font-bold text-xl text-white overflow-hidden group shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all cursor-pointer border border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 transition-all duration-500 group-hover:bg-left bg-[length:200%_100%] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
        <span className="relative z-10 drop-shadow-md flex justify-center items-center gap-3 tracking-wide">
           Initialize Secure Environment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </span>
      </motion.button>

      <div className="w-full pt-8">
        <Features />
      </div>
    </motion.div>
  );
};
