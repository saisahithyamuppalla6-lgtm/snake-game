/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 font-sans overflow-x-hidden relative">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-cyan-900/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-900/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Grid Pattern overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.03]" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px' 
        }} 
      />

      <main className="relative z-10 container mx-auto min-h-screen px-4 py-8 lg:py-0 flex flex-col items-center justify-center gap-12 lg:flex-row lg:gap-24">
        
        {/* Left Side: Game Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex justify-center w-full"
        >
          <SnakeGame />
        </motion.div>

        {/* Right Side: Player Section */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-1 flex justify-center w-full"
        >
          <MusicPlayer />
        </motion.div>

        {/* Footer / Info Rail */}
        <div className="fixed bottom-8 left-12 hidden xl:block">
           <div className="writing-vertical-tl rotate-180 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-mono text-white/20">
              <span className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
              SYSTEM ACTIVE: NEONCORE v0.9.1
           </div>
        </div>

        <div className="fixed bottom-8 right-12 hidden xl:block">
           <div className="writing-vertical-tl flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-mono text-white/20">
              <span className="w-1 h-1 bg-purple-400 rounded-full" />
              BPM: SYNCED 128.0
           </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .writing-vertical-tl {
          writing-mode: vertical-rl;
        }
      `}} />
    </div>
  );
}
