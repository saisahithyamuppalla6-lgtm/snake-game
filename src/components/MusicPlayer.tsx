import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'Cyber Synth',
    url: '#',
    cover: 'https://picsum.photos/seed/neon1/400/400',
    duration: 184,
  },
  {
    id: '2',
    title: 'Midnight Grid',
    artist: 'Digital Dreamer',
    url: '#',
    cover: 'https://picsum.photos/seed/neon2/400/400',
    duration: 215,
  },
  {
    id: '3',
    title: 'Retro Drift',
    artist: 'Pixel Pulse',
    url: '#',
    cover: 'https://picsum.photos/seed/neon3/400/400',
    duration: 156,
  },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const track = DUMMY_TRACKS[currentTrackIndex];
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= track.duration) {
            handleSkip();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, track.duration, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSkip = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setCurrentTime(0);
  };

  const handleBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden relative group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 blur-3xl rounded-full transition-opacity group-hover:opacity-100 opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 blur-3xl rounded-full transition-opacity group-hover:opacity-100 opacity-50" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">Now Playing</span>
          </div>
          <div className="flex items-center gap-2">
             <Volume2 className="w-4 h-4 text-white/30" />
          </div>
        </div>

        <motion.div 
          key={track.id}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-48 h-48 mb-8 group/cover"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-500 rounded-2xl blur-xl opacity-30 group-hover/cover:opacity-50 transition-opacity" />
          <img 
            src={track.cover} 
            alt={track.title} 
            className="w-full h-full object-cover rounded-2xl border border-white/10 relative z-10"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-medium text-white mb-1 tracking-tight">{track.title}</h2>
          <p className="text-sm text-white/40 font-mono tracking-wider">{track.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-purple-400"
              initial={false}
              animate={{ width: `${(currentTime / track.duration) * 100}%` }}
              transition={{ duration: 1, ease: 'linear' }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-mono text-white/30">{formatTime(currentTime)}</span>
            <span className="text-[10px] font-mono text-white/30">{formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button 
            onClick={handleBack}
            className="p-2 text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            {isPlaying ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current w-6 h-6 translate-x-0.5" />}
          </button>
          <button 
            onClick={handleSkip}
            className="p-2 text-white/60 hover:text-white transition-colors hover:scale-110 active:scale-95"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
