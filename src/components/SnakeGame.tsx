import { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RefreshCw, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 100; // ms per move

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  const lastUpdateTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      if (!currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      // Update direction for next move
      setDirection(nextDirection);

      switch (nextDirection) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)
      ) {
        setIsGameOver(true);
        setIsPaused(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [nextDirection, food, generateFood]);

  const gameLoop = useCallback((time: number) => {
    if (!lastUpdateTimeRef.current) lastUpdateTimeRef.current = time;
    const progress = time - lastUpdateTimeRef.current;

    if (progress > GAME_SPEED && !isPaused && !isGameOver) {
      moveSnake();
      lastUpdateTimeRef.current = time;
    }

    requestRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake, isPaused, isGameOver]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Draw snake
    snake.forEach((seg, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00FFCC' : '#0099FF';
      
      // Neon glow for head
      if (isHead) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00FFCC';
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      const r = isHead ? cellSize * 0.4 : cellSize * 0.35;
      ctx.roundRect(seg.x * cellSize + (cellSize - r * 2) / 2, seg.y * cellSize + (cellSize - r * 2) / 2, r * 2, r * 2, 4);
      ctx.fill();
    });

    // Draw food
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FF00CC';
    ctx.fillStyle = '#FF00CC';
    ctx.beginPath();
    const foodSize = cellSize * 0.6;
    ctx.arc(food.x * cellSize + cellSize / 2, food.y * cellSize + cellSize / 2, foodSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

  }, [snake, food]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full justify-between items-end px-2">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tighter flex items-center gap-2">
            NEON<span className="text-cyan-400">SLITHER</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Arena v1.0.4</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end text-white/60 mb-1">
             <Trophy className="w-4 h-4 text-yellow-500" />
             <span className="text-xs font-mono uppercase tracking-wider">Score</span>
          </div>
          <div className="text-2xl font-mono font-bold text-white leading-none">{score.toString().padStart(5, '0')}</div>
        </div>
      </div>

      <div className="relative group bg-black rounded-xl p-2 border border-white/10 shadow-[0_0_50px_rgba(0,153,255,0.1)]">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00FFCC] to-[#0099FF] rounded-xl opacity-20 blur group-hover:opacity-30 transition duration-1000" />
        
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="relative block rounded-lg overflow-hidden cursor-crosshair"
        />

        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-20"
            >
              {isGameOver ? (
                <div className="text-center p-8 flex flex-col items-center">
                  <div className="flex flex-col items-start mb-6 -ml-8">
                    <span 
                      className="text-[#1d4ed8] font-black text-[28px] lowercase tracking-tighter leading-none mb-1 shadow-black drop-shadow-md" 
                      style={{ WebkitTextStroke: '1.5px #93c5fd' }}
                    >
                      snake game
                    </span>
                    <span 
                      className="text-[#1d4ed8] font-black text-[28px] lowercase tracking-tighter leading-none ml-14 shadow-black drop-shadow-md" 
                      style={{ WebkitTextStroke: '1.5px #93c5fd' }}
                    >
                      snake game
                    </span>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-2 tracking-tighter">GAME OVER</h2>
                  <p className="text-cyan-400 font-mono text-sm mb-6 uppercase tracking-widest">Final Slither: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                  >
                    <RefreshCw className="w-4 h-4" /> RETRY
                  </button>
                </div>
              ) : (
                <div className="text-center">
                   <button 
                    onClick={() => setIsPaused(false)}
                    className="w-20 h-20 rounded-full bg-[#00FFCC] flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,255,204,0.4)]"
                  >
                    <Play className="fill-current w-10 h-10 translate-x-1" />
                  </button>
                  <p className="mt-4 text-white/40 font-mono text-xs uppercase tracking-widest">Press to Slither</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-8 w-full max-w-[400px]">
        <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase font-mono text-white/30">Arrows</span>
            <span className="text-xs text-white/60">Navigate</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase font-mono text-white/30">Food</span>
            <span className="text-xs text-white/60">+10 Points</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase font-mono text-white/30">Goal</span>
            <span className="text-xs text-white/60">Survive</span>
        </div>
      </div>
    </div>
  );
}
