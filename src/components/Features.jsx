import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileBadge, CheckCircle } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-card flex flex-col items-center justify-center p-6 rounded-2xl text-center border-white/5 hover:border-white/10 transition-colors group cursor-default h-full"
  >
    <div className="w-14 h-14 rounded-full bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
      <Icon className="w-7 h-7 text-purple-400 group-hover:text-blue-400 transition-colors" />
    </div>
    <h4 className="text-gray-200 font-medium">{title}</h4>
  </motion.div>
);

const Features = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      <FeatureCard 
        icon={Sparkles} 
        title="Secure Multi-Pass Wipe" 
        delay={0.6}
      />
      <FeatureCard 
        icon={FileBadge} 
        title="Tamper-Proof Certificate" 
        delay={0.7}
      />
      <FeatureCard 
        icon={CheckCircle} 
        title="Independent Verification" 
        delay={0.8}
      />
    </div>
  );
};

export default Features;
