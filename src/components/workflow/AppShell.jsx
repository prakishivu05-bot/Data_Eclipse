import React from 'react';
import { StepIndicator } from './StepIndicator';

export const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-white relative flex flex-col items-center overflow-x-hidden font-sans select-none selection:bg-purple-500/30">
      <div className="fixed top-[-30%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCA0MEwwIDBMMDAgMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1vcGFjaXR5PSIwLjAyIi8+CjxwYXRoIGQ9Ik00MCAwTDAgMEwwIDAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2Utb3BhY2l0eT0iMC4wMiIvPgo8L3N2Zz4=')] opacity-30 pointer-events-none" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col min-h-[90vh] relative z-10 overflow-x-hidden">
        <StepIndicator />
        <div className="flex-1 flex flex-col items-center justify-center">
          {children}
        </div>
      </main>
      
      <footer className="w-full py-6 text-center text-gray-600/80 text-xs z-10 tracking-[0.2em] uppercase font-semibold">
        <p>DATA ECLIPSE &copy; {new Date().getFullYear()} &bull; Enterprise Secure Operations</p>
      </footer>
    </div>
  );
};
