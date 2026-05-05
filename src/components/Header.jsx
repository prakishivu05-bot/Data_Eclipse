import React from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center space-y-4"
    >
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] pb-2">
        DATA ECLIPSE
      </h1>
      <h2 className="text-xl md:text-2xl font-light text-gray-300 tracking-wide uppercase">
        Verifiable Secure Data Erasure System
      </h2>
      <p className="mt-4 text-md md:text-lg text-gray-400 italic">
        "We don't just erase data — we prove it."
      </p>
    </motion.header>
  );
};

export default Header;
