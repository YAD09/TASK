import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Shield, Clock, Coins } from 'lucide-react';
import AuthPage from './AuthPage';

export default function HomePage() {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f19]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center font-bold text-white">T</div>
            <span className="font-display font-bold text-xl tracking-tight text-white">TaskLink</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAuth(true)}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => setShowAuth(true)}
              className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Campus Marketplace Live
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6"
            >
              Get things done on <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">campus.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto"
            >
              TaskLink connects students who need help with peers ready to work. Escrow payments, verified profiles, and seamless collaboration.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button 
                onClick={() => setShowAuth(true)}
                className="px-8 py-4 bg-white text-black hover:bg-gray-100 text-sm font-bold rounded-xl transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Join the Network <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-32">
            <div className="p-8 rounded-2xl bg-[#131b2d] border border-[#1e293b]">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Secure Escrow</h3>
              <p className="text-sm text-gray-400">Funds are held safely in escrow until the task is marked complete by both parties.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-[#131b2d] border border-[#1e293b]">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Instant Matching</h3>
              <p className="text-sm text-gray-400">AI-powered suggestions find the perfect peer for your task based on skills and availability.</p>
            </div>

            <div className="p-8 rounded-2xl bg-[#131b2d] border border-[#1e293b]">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <Coins className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Earn on Campus</h3>
              <p className="text-sm text-gray-400">Turn your free time into earnings by helping peers with academic or physical tasks.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
