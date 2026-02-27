/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import HTMLFlipBook from 'react-pageflip';
import { Play, Volume2, VolumeX, Menu, ChevronLeft, ChevronRight, X, BookOpen, Maximize } from 'lucide-react';

// --- Types ---
type ViewState = 'intro' | 'dossier' | 'gallery' | 'hisui';
type IntroStage = 'start' | 'ready' | 'playing' | 'ended';

type Situation = {
  code: string;
  name: string;
  count: number;
};

const SITUATIONS: Situation[] = [
  { code: 'bl', name: '바텀', count: 7 },
  { code: 'bld', name: '펠라치오', count: 4 },
  { code: 'hl', name: '탑', count: 4 },
  { code: 'hlt', name: '애무', count: 2 },
  { code: 'sa', name: '휴식', count: 3 },
  { code: 'sc', name: '겁먹음', count: 3 },
  { code: 'ct', name: '고양이랑 놀기', count: 2 },
  { code: 'su', name: '놀람', count: 1 },
  { code: 'em', name: '당황', count: 8 },
  { code: 'ta', name: '평소 대화 상황', count: 3 },
  { code: 'nt', name: '말문막힘', count: 5 },
  { code: 'so', name: '반성', count: 3 },
  { code: 'an', name: '발끈', count: 5 },
  { code: 'ns', name: '밤하늘 올려다봄', count: 2 },
  { code: 'kb', name: '벽치기', count: 2 },
  { code: 'pl', name: '눈 반짝이며 부탁', count: 2 },
  { code: 'no', name: '삐짐', count: 6 },
  { code: 'th', name: '생각중/고민', count: 3 },
  { code: 'lo', name: '설렘', count: 8 },
  { code: 'ma', name: '술법쓸때', count: 5 },
  { code: 'be', name: '슈크림빵 먹음', count: 10 },
  { code: 'hu', name: '시큰둥', count: 1 },
  { code: 'sd', name: '울먹거림', count: 6 },
  { code: 'hh', name: '웃음', count: 6 },
  { code: 'sp', name: '잠듬', count: 4 },
  { code: 'bt', name: '전투태세', count: 2 },
  { code: 'dp', name: '절망', count: 2 },
  { code: 'bk', name: '책봄', count: 3 },
  { code: 'ko', name: '칼뽑음', count: 3 },
  { code: 'ca', name: '티격태격', count: 2 },
  { code: 'ag', name: '분노', count: 10 },
  { code: 'pd', name: '휴대폰 사용중', count: 2 },
  { code: 'jd', name: '자독', count: 5 },
];

// --- Components ---

const CinematicBars = ({ size = '8vh' }: { size?: string }) => (
  <>
    <div className="absolute top-0 left-0 w-full bg-black z-[40]" style={{ height: size }} />
    <div className="absolute bottom-0 left-0 w-full bg-black z-[40]" style={{ height: size }} />
  </>
);

const NinjaConstellations = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 z-0">
    <svg className="w-full h-full">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Shuriken 1 */}
      <g transform="translate(15vw, 20vh) scale(0.8)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none" filter="url(#glow)">
        <polygon points="0,-40 10,-10 40,0 10,10 0,40 -10,10 -40,0 -10,-10" strokeDasharray="2 2" />
        <circle cx="0" cy="-40" r="2" fill="white" />
        <circle cx="40" cy="0" r="2" fill="white" />
        <circle cx="0" cy="40" r="2" fill="white" />
        <circle cx="-40" cy="0" r="2" fill="white" />
        <circle cx="0" cy="0" r="3" fill="white" />
        <line x1="0" y1="-40" x2="0" y2="40" />
        <line x1="-40" y1="0" x2="40" y2="0" />
      </g>
      {/* Kunai 1 */}
      <g transform="translate(85vw, 30vh) rotate(45) scale(0.8)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none" filter="url(#glow)">
        <polygon points="0,-50 15,-10 0,10 -15,-10" strokeDasharray="2 2" />
        <line x1="0" y1="10" x2="0" y2="40" />
        <circle cx="0" cy="45" r="5" />
        <circle cx="0" cy="-50" r="2" fill="white" />
        <circle cx="15" cy="-10" r="2" fill="white" />
        <circle cx="-15" cy="-10" r="2" fill="white" />
        <circle cx="0" cy="10" r="2" fill="white" />
      </g>
      {/* Shuriken 2 */}
      <g transform="translate(75vw, 75vh) rotate(20) scale(0.6)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none" filter="url(#glow)">
        <polygon points="0,-40 10,-10 40,0 10,10 0,40 -10,10 -40,0 -10,-10" strokeDasharray="2 2" />
        <circle cx="0" cy="-40" r="2" fill="white" />
        <circle cx="40" cy="0" r="2" fill="white" />
        <circle cx="0" cy="40" r="2" fill="white" />
        <circle cx="-40" cy="0" r="2" fill="white" />
        <circle cx="0" cy="0" r="3" fill="white" />
        <line x1="0" y1="-40" x2="0" y2="40" />
        <line x1="-40" y1="0" x2="40" y2="0" />
      </g>
      {/* Kunai 2 */}
      <g transform="translate(20vw, 80vh) rotate(-30) scale(0.7)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none" filter="url(#glow)">
        <polygon points="0,-50 15,-10 0,10 -15,-10" strokeDasharray="2 2" />
        <line x1="0" y1="10" x2="0" y2="40" />
        <circle cx="0" cy="45" r="5" />
        <circle cx="0" cy="-50" r="2" fill="white" />
        <circle cx="15" cy="-10" r="2" fill="white" />
        <circle cx="-15" cy="-10" r="2" fill="white" />
        <circle cx="0" cy="10" r="2" fill="white" />
      </g>
    </svg>
  </div>
);

const NIGHT_STARS = Array.from({ length: 120 }).map((_, i) => {
  const shapes = ['circle', '✦', '★', '✧', 'circle', 'circle'];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  return {
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    shape,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
    color: Math.random() > 0.8 ? '#bfdbfe' : Math.random() > 0.8 ? '#fef08a' : '#ffffff'
  };
});

const SkyBackground = ({ type }: { type: 'blue' | 'sunset' | 'bamboo' | 'night' }) => {
  if (type === 'blue') {
    return (
      <div className="absolute inset-0 bg-[#3b82f6] overflow-hidden">
        {/* Simple clouds */}
        <div className="absolute top-[15%] left-[5%] w-64 h-24 bg-white/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-[25%] right-[10%] w-96 h-32 bg-white/30 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-[45%] left-[25%] w-80 h-28 bg-white/35 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-[60%] right-[30%] w-72 h-20 bg-white/20 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-[10%] left-[40%] w-48 h-16 bg-white/25 rounded-full blur-3xl animate-pulse delay-1500" />
        {/* Character Silhouette placeholder */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-96 bg-black/20 blur-sm rounded-t-full" />
      </div>
    );
  }
  if (type === 'sunset') {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#ff7e5f] via-[#feb47b] to-[#86a8e7] overflow-hidden">
        {/* Sunset bands */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-orange-500/20 via-red-500/20 to-transparent" />
        {/* Sunset clouds */}
        <div className="absolute top-[20%] left-[15%] w-72 h-20 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-[35%] right-[20%] w-80 h-24 bg-red-200/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-[50%] left-[10%] w-64 h-16 bg-yellow-200/25 rounded-full blur-3xl animate-pulse delay-1000" />
        {/* Distant mountains/silhouette */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-black/40 blur-md" />
      </div>
    );
  }
  if (type === 'bamboo') {
    return (
      <div className="absolute inset-0 bg-[#0f291e] overflow-hidden">
        <motion.div 
          animate={{ x: [-20, 20, -20] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex justify-around opacity-60 blur-md"
        >
          <div className="w-12 h-[120%] -top-[10%] relative bg-[#1a4731] rotate-3" />
          <div className="w-16 h-[120%] -top-[10%] relative bg-[#133826] -rotate-2" />
          <div className="w-10 h-[120%] -top-[10%] relative bg-[#225c40] rotate-1" />
          <div className="w-14 h-[120%] -top-[10%] relative bg-[#1a4731] -rotate-3" />
          <div className="w-20 h-[120%] -top-[10%] relative bg-[#133826] rotate-2" />
        </motion.div>
        <div className="absolute inset-0 bg-black/40" />
      </div>
    );
  }
  if (type === 'night') {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-[#050b14] via-[#0a192f] to-[#112240] overflow-hidden">
        {NIGHT_STARS.map(star => (
          <motion.div
            key={star.id}
            className="absolute flex items-center justify-center"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              color: star.color,
              fontSize: star.shape === 'circle' ? undefined : `${star.size * 6}px`,
            }}
            animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: star.duration,
              repeat: Infinity,
              delay: star.delay,
              ease: "easeInOut"
            }}
          >
            {star.shape === 'circle' ? (
              <div style={{ width: star.size * 2, height: star.size * 2, backgroundColor: star.color, borderRadius: '50%' }} />
            ) : (
              star.shape
            )}
          </motion.div>
        ))}
        <div className="absolute top-[20%] right-[20%] w-40 h-40 bg-blue-400/10 rounded-full blur-3xl" />
      </div>
    );
  }
  return null;
};

const NinjaPatterns = ({ isColor = true }: { isColor?: boolean }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {/* Only show shurikens if requested, but user asked for clean sky. 
        I'll keep them subtle or remove if they clutter. 
        Actually, I'll remove the paper effects and just keep a few shurikens. */}
    <motion.div
      initial={{ opacity: 0, rotate: -25, scale: 1.2 }}
      animate={{ opacity: 0.2, scale: 1 }}
      className={`absolute top-[15%] left-[8%] ${isColor ? 'text-white' : 'text-white/20'}`}
    >
      <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42 Z" />
        <circle cx="50" cy="50" r="6" fill="black" />
      </svg>
    </motion.div>
  </div>
);

const CategoryMenu = ({ 
  onOpenDossier, 
  onOpenGallery, 
  onOpenIntro,
  onOpenHisui,
}: { 
  onOpenDossier?: () => void; 
  onOpenGallery?: () => void; 
  onOpenIntro?: () => void;
  onOpenHisui?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-[calc(6vh+16px)] right-4 sm:right-8 z-50">
      <div className="flex flex-col items-end gap-2">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 sm:p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-white cursor-pointer hover:bg-white/10 transition-all outline-none"
        >
          <Menu size={20} className="sm:w-6 sm:h-6" />
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="flex flex-col gap-2 bg-black/80 backdrop-blur-2xl border border-white/10 p-4 rounded-2xl min-w-[180px] shadow-2xl"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
            >
              {onOpenDossier && (
                <button 
                  onClick={() => { onOpenDossier(); setIsOpen(false); }}
                  className="text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-3"
                >
                  <BookOpen size={18} />
                  <span>나무의 기록</span>
                </button>
              )}
              {onOpenGallery && (
                <button 
                  onClick={() => { onOpenGallery(); setIsOpen(false); }}
                  className="text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-3"
                >
                  <BookOpen size={18} />
                  <span>별의 기록</span>
                </button>
              )}
              {onOpenHisui && (
                <button 
                  onClick={() => { onOpenHisui(); setIsOpen(false); }}
                  className="text-left px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-3 group/item relative overflow-hidden"
                >
                  <BookOpen size={18} />
                  <span className="blur-[3px] group-hover/item:blur-0 transition-all duration-300">히스이</span>
                </button>
              )}
              {onOpenIntro && (
                <>
                  <div className="h-[1px] w-full bg-white/10 my-1" />
                  <button 
                    onClick={() => { onOpenIntro(); setIsOpen(false); }}
                    className="text-left px-4 py-2 text-[#3498db] hover:text-[#2980b9] hover:bg-white/10 rounded-lg transition-all flex items-center gap-3 font-bold"
                  >
                    <Play size={18} />
                    <span>인트로 보기</span>
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const IntroPage = ({ onComplete, onOpenGallery, onOpenDossier, onOpenHisui }: { onComplete: () => void; onOpenGallery: () => void; onOpenDossier: () => void; onOpenHisui: () => void }) => {
  const [stage, setStage] = useState<IntroStage>('start');
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Set initial mouse position to center of screen
    setMousePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [timeState, setTimeState] = useState<'day' | 'night'>('day');
  const [sunrise, setSunrise] = useState(false);

  React.useEffect(() => {
    if (stage !== 'start') return;
    let timeoutId: NodeJS.Timeout;
    let isFirstDay = true;
    
    const runCycle = (currentState: 'day' | 'night') => {
      if (currentState === 'day') {
        timeoutId = setTimeout(() => {
          setTimeState('night');
          isFirstDay = false;
          runCycle('night');
        }, isFirstDay ? 5000 : 15000); // First day 5s, subsequent days 15s
      } else {
        timeoutId = setTimeout(() => {
          setSunrise(true);
          setTimeout(() => setSunrise(false), 5000);
          setTimeState('day');
          runCycle('day');
        }, 10000); // Night lasts 10 seconds
      }
    };
    
    runCycle('day');
    
    return () => clearTimeout(timeoutId);
  }, [stage]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleStart = () => setStage('ready');
  
  const handlePlayVideo = () => {
    setStage('playing');
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVideoEnd = () => {
    setStage('ended');
    setIsPlaying(false);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedValue = (x / rect.width) * videoRef.current.duration;
      videoRef.current.currentTime = clickedValue;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
      if (!videoRef.current.muted && volume === 0) {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
      }
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center font-sans"
      onMouseEnter={() => setIsHoveringVideo(true)}
      onMouseLeave={() => setIsHoveringVideo(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Cinematic Bars - Rendered once at top level for alignment */}
      {stage === 'start' && <CinematicBars />}

      {/* Sunrise Overlay */}
      <AnimatePresence>
        {sunrise && (
          <motion.div 
            initial={{ opacity: 0, background: 'linear-gradient(to top, #ff7e5f, transparent)' }}
            animate={{ opacity: 0.8, background: 'linear-gradient(to top, #feb47b, #86a8e7)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 5, ease: "easeInOut" }}
            className="absolute inset-0 z-[15] pointer-events-none mix-blend-screen"
          />
        )}
      </AnimatePresence>

      {/* Background Layer (Outer) - Only for Start Screen */}
      {stage === 'start' && (
        <div className="absolute inset-0">
          <div className={`absolute inset-0 transition-opacity duration-[5000ms] ease-in-out ${timeState === 'day' ? 'opacity-100' : 'opacity-0'}`}>
            <SkyBackground type="blue" />
          </div>
          <div className={`absolute inset-0 transition-opacity duration-[5000ms] ease-in-out ${timeState === 'night' ? 'opacity-100' : 'opacity-0'}`}>
            <SkyBackground type="bamboo" />
          </div>
          <div className="absolute inset-0 bg-black/10" />
          
          {/* Base Typography (Outer) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center relative px-4">
              <h1 className="flex flex-col items-center relative">
                <span className={`text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black tracking-[-0.15em] leading-[0.8] uppercase select-none font-sans transition-colors duration-[5000ms] ease-in-out ${timeState === 'day' ? 'text-black' : 'text-[#cc0000] drop-shadow-[0_0_15px_rgba(204,0,0,0.8)]'}`}>
                  バカバカ！
                </span>
                <span className={`text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black tracking-[-0.15em] leading-[0.8] uppercase select-none font-sans transition-colors duration-[5000ms] ease-in-out ${timeState === 'day' ? 'text-black' : 'text-[#cc0000] drop-shadow-[0_0_15px_rgba(204,0,0,0.8)]'}`}>
                  バカ忍び！
                </span>
              </h1>
              <p className={`text-[10px] sm:text-xs md:text-sm tracking-[0.4em] sm:tracking-[0.8em] uppercase mt-6 sm:mt-12 transition-colors duration-[5000ms] ease-in-out ${timeState === 'day' ? 'text-black/40' : 'text-red-700/80'}`}>Baka Baka! Baka Shinobi!</p>
              <div className="mt-6 sm:mt-12 h-[60px] sm:h-[72px]" />
            </div>
          </div>
        </div>
      )}

      {/* Main Video Layer (Inner) */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          maskImage: stage === 'start' 
            ? `radial-gradient(circle clamp(120px, 20vw, 250px) at ${mousePos.x}px ${mousePos.y}px, #000 100%, transparent 100%)` 
            : 'none',
          WebkitMaskImage: stage === 'start' 
            ? `radial-gradient(circle clamp(120px, 20vw, 250px) at ${mousePos.x}px ${mousePos.y}px, #000 100%, transparent 100%)` 
            : 'none',
        }}
      >
        {stage === 'start' ? (
          <div className="absolute inset-0 pointer-events-none">
            <div className={`absolute inset-0 transition-opacity duration-[5000ms] ease-in-out ${timeState === 'day' ? 'opacity-100' : 'opacity-0'}`}>
              <SkyBackground type="sunset" />
            </div>
            <div className={`absolute inset-0 transition-opacity duration-[5000ms] ease-in-out ${timeState === 'night' ? 'opacity-100' : 'opacity-0'}`}>
              <SkyBackground type="night" />
            </div>
            {/* Revealed Typography (Inner) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
              <div className="text-center relative">
                <h1 className="flex flex-col items-center relative">
                  <span className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black text-white tracking-[-0.15em] leading-[0.8] uppercase select-none font-sans drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    バカバカ！
                  </span>
                  <span className="text-4xl sm:text-6xl md:text-8xl lg:text-[10rem] font-black text-white tracking-[-0.15em] leading-[0.8] uppercase select-none font-sans drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                    バカ忍び！
                  </span>
                </h1>
                <p className="text-white text-[10px] sm:text-xs md:text-sm tracking-[0.4em] sm:tracking-[0.8em] uppercase mt-6 sm:mt-12 select-none font-bold">Baka Baka! Baka Shinobi!</p>
                <div className="mt-6 sm:mt-12 h-[60px] sm:h-[72px]" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full pointer-events-auto" onClick={() => {
            if (stage === 'playing') togglePlay();
          }}>
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover md:object-cover transition-opacity duration-1000 ${
                stage === 'ready' || stage === 'playing' || stage === 'ended' ? 'opacity-100' : 'opacity-0'
              } ${stage === 'ready' ? 'blur-2xl scale-110' : 'blur-0 scale-100'} max-md:object-contain`}
              src="https://res.cloudinary.com/dcyv4u0rn/video/upload/v1772127384/bakanin.mp4"
              onEnded={handleVideoEnd}
              onTimeUpdate={handleTimeUpdate}
              muted={isMuted}
              playsInline
            />
            {/* Pause Overlay */}
            <AnimatePresence>
              {stage === 'playing' && !isPlaying && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none"
                >
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                    <Play className="w-12 h-12 text-white fill-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Main UI Layer (Button Only) */}
      <AnimatePresence>
        {stage === 'start' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="z-30 absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          >
            <InteractionEffect type={timeState === 'day' ? 'butterfly' : 'star'} />
            <div className="text-center relative pointer-events-auto px-4">
              <div className="h-[60px] sm:h-[72px] md:h-[20rem]" /> {/* Spacer for Title */}
              <div className="mt-6 sm:mt-12 flex justify-center">
                <button
                  onClick={handleStart}
                  className="px-8 sm:px-16 py-3 sm:py-5 border-2 border-black/50 text-black text-sm sm:text-xl font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all duration-500 rounded-full relative overflow-hidden backdrop-blur-sm pointer-events-auto"
                >
                  <span className="relative z-10">시작하기</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for "Ready" (Play Button) */}
      <AnimatePresence>
        {stage === 'ready' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-30 absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/40 backdrop-blur-sm"
          >
            <button
              onClick={handlePlayVideo}
              className="w-24 h-24 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/40 transition-all group"
            >
              <Play className="w-10 h-10 text-white fill-white group-hover:scale-110 transition-transform" />
            </button>
            <span className="text-white/70 uppercase tracking-[0.3em] text-sm animate-pulse">클릭하여 재생</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for "Ended" (Replay Button) */}
      <AnimatePresence>
        {stage === 'ended' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-30 absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/60 backdrop-blur-sm"
          >
            <button
              onClick={handlePlayVideo}
              className="w-24 h-24 flex items-center justify-center bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/40 transition-all group"
            >
              <Play className="w-10 h-10 text-white fill-white group-hover:scale-110 transition-transform" />
            </button>
            <span className="text-white/70 uppercase tracking-[0.3em] text-sm animate-pulse">다시 재생</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Controls: Timeline (Bottom) */}
      <AnimatePresence>
        {stage === 'playing' && isHoveringVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 w-full p-8 z-20 bg-gradient-to-t from-black/80 to-transparent"
          >
            <div 
              className="h-1.5 w-full bg-white/20 rounded-full cursor-pointer overflow-hidden group"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-white transition-all duration-100 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg" />
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-[10px] text-white/50 font-mono tracking-widest uppercase">
              <div className="flex items-center gap-4">
                <span>{isPlaying ? '재생 중' : '일시 정지'}</span>
                <button 
                  onClick={handleFullscreen}
                  className="md:hidden p-1 hover:text-white transition-colors"
                >
                  <Maximize size={14} />
                </button>
              </div>
              <span>{Math.round(progress)}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls: Mute & Volume (Top Left) */}
      {(stage === 'playing' || stage === 'ended') && (
        <div className="absolute top-8 left-8 z-20 flex items-center gap-4 group/volume">
          <button
            onClick={toggleMute}
            className="p-3 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-white/20 transition-all"
          >
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300 ease-in-out flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-white/30 rounded-lg cursor-pointer accent-white"
            />
          </div>
        </div>
      )}

      {/* Navigation: Category Menu (Top Right - Hover Only) */}
      {(stage === 'playing' || stage === 'ended') && (
        <CategoryMenu 
          onOpenGallery={onOpenGallery} 
          onOpenIntro={() => setStage('start')} 
          onOpenDossier={onOpenDossier} 
          onOpenHisui={onOpenHisui}
        />
      )}
    </div>
  );
};

const ScatteredWeapons = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const weapons = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const angle = (i * (360 / 40) + (Math.random() * 15 - 7.5)) * (Math.PI / 180);
      const baseRadius = isMobile ? 55 : 48;
      const radiusX = baseRadius + Math.random() * 15; // vw
      const radiusY = baseRadius + Math.random() * 15; // vh
      const type = Math.random() > 0.5 ? 'shuriken' : 'kunai';
      const rotation = Math.random() * 360;
      const size = 0.6 + Math.random() * 0.8;
      
      return { id: i, angle, radiusX, radiusY, type, rotation, size };
    });
  }, [isMobile]);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden flex items-center justify-center">
      {weapons.map(w => {
        const x = Math.cos(w.angle) * w.radiusX;
        const y = Math.sin(w.angle) * w.radiusY;
        
        const repelX = Math.cos(w.angle) * 30;
        const repelY = Math.sin(w.angle) * 30;

        return (
          <div
            key={w.id}
            className="absolute pointer-events-auto"
            style={{
              left: `calc(50% + ${x}vw)`,
              top: `calc(50% + ${y}vh)`,
            }}
          >
            <motion.div
              className="text-black/60 hover:text-black/90 cursor-crosshair drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)]"
              style={{
                rotate: w.rotation,
                scale: w.size,
              }}
              whileHover={{
                x: repelX,
                y: repelY,
                rotate: w.rotation + (w.type === 'shuriken' ? 180 : 45),
                scale: w.size * 1.2,
                transition: { type: "spring", stiffness: 300, damping: 15 }
              }}
            >
              {w.type === 'shuriken' ? (
                <svg width="40" height="40" viewBox="-20 -20 40 40" fill="currentColor">
                  <path d="M0,-20 L4,-4 L20,0 L4,4 L0,20 L-4,4 L-20,0 L-4,-4 Z" />
                  <circle cx="0" cy="0" r="3" fill="#f4f1ea" />
                </svg>
              ) : (
                <svg width="20" height="60" viewBox="-10 -30 20 60" fill="currentColor">
                  <path d="M0,-30 L6,-10 L2,15 L-2,15 L-6,-10 Z" />
                  <rect x="-2" y="15" width="4" height="10" />
                  <circle cx="0" cy="28" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

const DossierView = ({ onBack, onOpenIntro, onOpenGallery, onOpenHisui }: { onBack: () => void; onOpenIntro: () => void; onOpenGallery: () => void; onOpenHisui: () => void }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [paths, setPaths] = useState<{ id: number; points: { x: number; y: number }[] }[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const isDraggingScroll = useRef(false);

  const images = [
    "https://github.com/jeenseeem/HSI/blob/main/01.png?raw=true",
    "https://github.com/jeenseeem/HSI/blob/main/02.png?raw=true",
    "https://github.com/jeenseeem/HSI/blob/main/05.png?raw=true"
  ];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    // Don't start drawing if clicking on the scrollbar
    if ((e.target as HTMLElement).closest('.custom-scrollbar-ui')) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPath(prev => [...prev, { x, y }]);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    if (currentPath.length > 0) {
      const newPath = { id: Date.now(), points: currentPath };
      setPaths(prev => [...prev, newPath]);
      setCurrentPath([]);
      
      setTimeout(() => {
        setPaths(prev => prev.filter(p => p.id !== newPath.id));
      }, 2000);
    }
  };

  const handleScrollDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingScroll.current || !scrollContentRef.current) return;
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scrollbarHeight = window.innerHeight * 0.6;
    const scrollbarTop = (window.innerHeight - scrollbarHeight) / 2;
    
    let progress = (clientY - scrollbarTop) / scrollbarHeight;
    progress = Math.max(0, Math.min(1, progress));
    
    setScrollProgress(progress);
    
    const maxScroll = scrollContentRef.current.scrollHeight - scrollContentRef.current.clientHeight;
    scrollContentRef.current.scrollTop = progress * maxScroll;
  };

  const startScrollDrag = (e: React.MouseEvent | React.TouchEvent) => {
    isDraggingScroll.current = true;
    handleScrollDrag(e);
    
    const onMove = (moveEvent: MouseEvent | TouchEvent) => handleScrollDrag(moveEvent as any);
    const onUp = () => {
      isDraggingScroll.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
    
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="fixed inset-0 z-[60] bg-[#f4f1ea] overflow-hidden font-sans cursor-crosshair touch-none"
    >
      {/* Paper Texture & Aging & Crumpled Effect (Full Screen) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/crumpled-paper.png')] opacity-40 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-black/15 pointer-events-none" />
      
      {/* Highlighter Strokes Layer (Full Screen) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <svg className="w-full h-full">
          <AnimatePresence>
            {paths.map((path) => (
              <motion.polyline
                key={path.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                points={path.points.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ mixBlendMode: 'multiply', filter: 'blur(0.8px)' }}
              />
            ))}
          </AnimatePresence>
          {currentPath.length > 0 && (
            <polyline
              points={currentPath.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ mixBlendMode: 'multiply', filter: 'blur(0.8px)', opacity: 0.8 }}
            />
          )}
        </svg>
      </div>

      <ScatteredWeapons />
      
      <CategoryMenu 
        onOpenIntro={onOpenIntro} 
        onOpenDossier={() => {}} 
        onOpenGallery={onOpenGallery} 
        onOpenHisui={onOpenHisui}
      />

      <div className="relative z-20 w-full h-full flex items-center justify-center p-0 md:p-4 sm:p-8 pointer-events-none">
        <div 
          ref={scrollContentRef}
          className="w-full h-full overflow-hidden pointer-events-auto lg:pointer-events-auto md:pr-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex items-center justify-center"
        >
          <div className="w-full max-w-[1600px] relative flex items-center justify-center min-h-full">
            <div className="flex items-center justify-center w-full h-full relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-[140vh] h-[140vw] md:w-[100%] md:h-auto lg:w-[95%] xl:w-[90%] max-w-none mx-auto rotate-90 md:rotate-0 flex items-center justify-center"
              >
                <div 
                  className="w-full h-full relative cursor-pointer pointer-events-auto flex items-center justify-center"
                  onClick={handleNextImage}
                >
                  <AnimatePresence>
                    <motion.img 
                      key={currentImageIndex}
                      src={images[currentImageIndex]} 
                      alt="Paper Record" 
                      initial={{ opacity: 0, filter: 'blur(20px)' }}
                      animate={{ opacity: 0.9, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, filter: 'blur(20px)' }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full md:relative md:inset-auto md:w-full md:h-auto object-contain scale-[1.6] md:scale-100 mix-blend-multiply select-none pointer-events-none"
                      draggable="false"
                    />
                  </AnimatePresence>
                  
                  {/* Next Page Button - Inside the rotated container to match image rotation */}
                  <div className="absolute bottom-8 right-8 z-50 font-brush text-black text-2xl sm:text-3xl pointer-events-none mix-blend-multiply">
                    다음장 <span className="text-base sm:text-lg">click!</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InteractionEffect = ({ type }: { type: 'star' | 'butterfly' }) => {
  const [elements, setElements] = useState<{ 
    id: number, 
    x: number, 
    y: number, 
    offsetX: number, 
    offsetY: number,
    angle: number,
    scale: number,
    duration: number,
    tailLength: number
  }[]>([]);

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newEl = { 
        id: Date.now() + Math.random(), 
        x: e.clientX, 
        y: e.clientY,
        offsetX: (Math.random() - 0.5) * 600,
        offsetY: (Math.random() - 0.5) * 600,
        angle: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        duration: type === 'star' ? Math.random() * 4 + 8 : 4,
        tailLength: Math.random() * 70 + 80
      };
      setElements(prev => [...prev, newEl]);
      setTimeout(() => {
        setElements(prev => prev.filter(el => el.id !== newEl.id));
      }, newEl.duration * 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [type]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      <AnimatePresence>
        {elements.map(el => {
          if (type === 'star') {
            const startX = el.x + (Math.random() * 100 - 50);
            const startY = el.y + (Math.random() * -100 - 50);
            
            // 좌측 하단 방향 (약 135도 ~ 160도)
            const angleDeg = 135 + Math.random() * 25; 
            const angleRad = angleDeg * (Math.PI / 180);
            
            // 짧은 이동 거리
            const distance = 150 + Math.random() * 100; 
            
            const endX = startX + Math.cos(angleRad) * distance;
            const endY = startY + Math.sin(angleRad) * distance;

            return (
              <motion.div
                key={el.id}
                initial={{ x: startX, y: startY, opacity: 0, rotate: angleDeg }}
                animate={{ 
                  x: endX, 
                  y: endY, 
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ 
                  duration: el.duration,
                  ease: "linear",
                  opacity: { duration: el.duration, times: [0, 0.1, 0.8, 1] }
                }}
                className="absolute"
              >
                {/* 꼬리: 오른쪽(머리)에서 왼쪽으로 길어졌다 짧아짐 */}
                <motion.div 
                  className="absolute top-1/2 right-1 -translate-y-1/2 h-[1px] sm:h-[2px] bg-gradient-to-r from-transparent via-blue-300/80 to-white origin-right"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: [0, 1, 0] }}
                  transition={{ duration: el.duration, times: [0, 0.2, 1], ease: "easeInOut" }}
                  style={{ width: el.tailLength }}
                />
                {/* 빛나는 머리 */}
                <motion.div 
                  className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full shadow-[0_0_15px_5px_rgba(255,255,255,0.9),0_0_30px_10px_rgba(100,150,255,0.7)] z-10"
                  animate={{ 
                    scale: [1, 1.5, 0.8, 1.2, 1],
                    opacity: [1, 0.7, 1, 0.8, 1]
                  }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* 십자 모양 빛 번짐 효과 */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-[1px] bg-white/40 rotate-45" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-[1px] bg-white/40 -rotate-45" />
                </motion.div>
              </motion.div>
            );
          } else {
            // Random direction for butterfly
            const directionAngle = Math.random() * Math.PI * 2;
            const distance = 300 + Math.random() * 200;
            const endX = el.x + Math.cos(directionAngle) * distance;
            const endY = el.y + Math.sin(directionAngle) * distance;
            
            // Calculate rotation based on direction (butterflies face "up" relative to their movement)
            const rotationAngle = (directionAngle * 180 / Math.PI) + 90;

            return (
              <motion.div
                key={el.id}
                initial={{ x: el.x, y: el.y, opacity: 0, scale: 0.5, rotate: rotationAngle - 20 }}
                animate={{ 
                  x: endX, 
                  y: endY, 
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1, 1.2, 1],
                  rotate: rotationAngle + (Math.random() * 40 - 20)
                }}
                transition={{ duration: 4, ease: "easeOut" }}
                className="absolute text-2xl sm:text-4xl drop-shadow-md"
              >
                <motion.div
                  animate={{ rotateY: [0, 70, 0, -70, 0], y: [0, -10, 0, 10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  🦋
                </motion.div>
              </motion.div>
            );
          }
        })}
      </AnimatePresence>
    </div>
  );
};

const PolaroidCard: React.FC<{ situation: Situation; onClick: () => void }> = ({ situation, onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  React.useEffect(() => {
    if (situation.count <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % situation.count);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [situation.count]);

  const rotation = React.useMemo(() => (Math.random() * 4 - 2).toFixed(1), []);
  const bobbingDuration = React.useMemo(() => 3 + Math.random() * 2, []);
  const bobbingDelay = React.useMemo(() => Math.random() * 2, []);
  
  const starAnims = React.useMemo(() => Array(8).fill(0).map(() => ({
    duration: 1.5 + Math.random() * 2,
    delay: Math.random() * 2,
    maxOpacity: 0.7 + Math.random() * 0.3,
    minOpacity: 0.2 + Math.random() * 0.3,
    maxR: 2.5 + Math.random() * 1.5,
    minR: 1.5 + Math.random() * 0.5,
  })), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full group cursor-pointer p-6 transition-all hover:scale-105"
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={onClick}
    >
      <motion.div
        animate={{ 
          y: [-3, 3, -3], 
          rotate: [-1, 1, -1] 
        }}
        transition={{ 
          duration: bobbingDuration, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: bobbingDelay
        }}
        className="w-full h-full relative"
      >
        {/* Constellation Frame SVG */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <filter id={`starGlow-${situation.code}`}>
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* Frame lines using percentages */}
            <line x1="0%" y1="0%" x2="100%" y2="0%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="100%" y1="0%" x2="100%" y2="100%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="100%" y1="100%" x2="0%" y2="100%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0%" y1="100%" x2="0%" y2="0%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Cross lines */}
            <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            <line x1="100%" y1="0%" x2="0%" y2="100%" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            
            {/* Stars at corners */}
            <motion.circle cx="0%" cy="0%" fill="white" filter={`url(#starGlow-${situation.code})`} animate={{ opacity: [starAnims[0].minOpacity, starAnims[0].maxOpacity, starAnims[0].minOpacity], r: [starAnims[0].minR, starAnims[0].maxR, starAnims[0].minR] }} transition={{ duration: starAnims[0].duration, repeat: Infinity, delay: starAnims[0].delay }} />
            <motion.circle cx="100%" cy="0%" fill="white" filter={`url(#starGlow-${situation.code})`} animate={{ opacity: [starAnims[1].minOpacity, starAnims[1].maxOpacity, starAnims[1].minOpacity], r: [starAnims[1].minR, starAnims[1].maxR, starAnims[1].minR] }} transition={{ duration: starAnims[1].duration, repeat: Infinity, delay: starAnims[1].delay }} />
            <motion.circle cx="100%" cy="100%" fill="white" filter={`url(#starGlow-${situation.code})`} animate={{ opacity: [starAnims[2].minOpacity, starAnims[2].maxOpacity, starAnims[2].minOpacity], r: [starAnims[2].minR, starAnims[2].maxR, starAnims[2].minR] }} transition={{ duration: starAnims[2].duration, repeat: Infinity, delay: starAnims[2].delay }} />
            <motion.circle cx="0%" cy="100%" fill="white" filter={`url(#starGlow-${situation.code})`} animate={{ opacity: [starAnims[3].minOpacity, starAnims[3].maxOpacity, starAnims[3].minOpacity], r: [starAnims[3].minR, starAnims[3].maxR, starAnims[3].minR] }} transition={{ duration: starAnims[3].duration, repeat: Infinity, delay: starAnims[3].delay }} />

            {/* Extra decorative stars */}
            <motion.circle cx="50%" cy="0%" fill="white" animate={{ opacity: [starAnims[4].minOpacity, starAnims[4].maxOpacity, starAnims[4].minOpacity], r: [starAnims[4].minR, starAnims[4].maxR, starAnims[4].minR] }} transition={{ duration: starAnims[4].duration, repeat: Infinity, delay: starAnims[4].delay }} />
            <motion.circle cx="50%" cy="100%" fill="white" animate={{ opacity: [starAnims[5].minOpacity, starAnims[5].maxOpacity, starAnims[5].minOpacity], r: [starAnims[5].minR, starAnims[5].maxR, starAnims[5].minR] }} transition={{ duration: starAnims[5].duration, repeat: Infinity, delay: starAnims[5].delay }} />
            <motion.circle cx="0%" cy="50%" fill="white" animate={{ opacity: [starAnims[6].minOpacity, starAnims[6].maxOpacity, starAnims[6].minOpacity], r: [starAnims[6].minR, starAnims[6].maxR, starAnims[6].minR] }} transition={{ duration: starAnims[6].duration, repeat: Infinity, delay: starAnims[6].delay }} />
            <motion.circle cx="100%" cy="50%" fill="white" animate={{ opacity: [starAnims[7].minOpacity, starAnims[7].maxOpacity, starAnims[7].minOpacity], r: [starAnims[7].minR, starAnims[7].maxR, starAnims[7].minR] }} transition={{ duration: starAnims[7].duration, repeat: Infinity, delay: starAnims[7].delay }} />
          </svg>
        </div>

        <div className="relative z-10 w-full aspect-square bg-black/40 overflow-hidden rounded-sm border border-white/20 backdrop-blur-sm group-hover:border-white/50 transition-colors">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentIndex}
              src={`https://raw.githubusercontent.com/jeenseeem/HSI/refs/heads/${situation.code}/${currentIndex + 1}.png`}
              alt={`${situation.name} ${currentIndex + 1}`}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity mix-blend-screen"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
        </div>
        <div className="relative z-10 mt-6 w-full text-center">
          <span className="font-['Nanum_Pen_Script',cursive] text-2xl sm:text-3xl text-white/90 tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">{situation.name}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const GalleryView = ({ onBack, onOpenIntro, onOpenDossier, onOpenHisui }: { onBack: () => void; onOpenIntro: () => void; onOpenDossier: () => void; onOpenHisui: () => void }) => {
  const [selectedSituation, setSelectedSituation] = useState<Situation | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const adultCodes = ['bl', 'bld', 'hl', 'hlt', 'sa', 'jd'];
  const generalSituations = SITUATIONS.filter(s => !adultCodes.includes(s.code));
  const adultSituations = SITUATIONS.filter(s => adultCodes.includes(s.code));

  const openModal = (situation: Situation) => {
    setSelectedSituation(situation);
    setModalImageIndex(0);
  };

  const nextModalImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedSituation) {
      setModalImageIndex((prev) => (prev + 1) % selectedSituation.count);
    }
  };

  const prevModalImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedSituation) {
      setModalImageIndex((prev) => (prev - 1 + selectedSituation.count) % selectedSituation.count);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black font-sans">
      <SkyBackground type="night" />
      <NinjaConstellations />
      <div className="absolute inset-0 bg-black/60" />
      <InteractionEffect type="star" />
      <CinematicBars size="6vh" />
      
      <CategoryMenu 
        onOpenIntro={onOpenIntro} 
        onOpenDossier={onOpenDossier}
        onOpenGallery={() => {}} 
        onOpenHisui={onOpenHisui}
      />

      <div className="relative z-10 w-full">
        <header className="p-8 pt-32 md:pt-48 pb-0 flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter italic">별의 기록</h1>
          <div className="mt-8 flex flex-col items-center gap-2 text-white/20 animate-bounce">
            <span className="text-[10px] uppercase tracking-[0.4em]">아래로 스크롤</span>
            <ChevronRight className="rotate-90 w-4 h-4" />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 w-full max-w-7xl mx-auto mt-16 px-4 md:px-8">
          {generalSituations.map((situation) => (
            <PolaroidCard key={situation.code} situation={situation} onClick={() => openModal(situation)} />
          ))}
        </div>

        <div className="w-full max-w-7xl mx-auto mt-32 mb-16 px-4 md:px-8 text-center">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent mb-8" />
          <h2 className="text-2xl sm:text-4xl font-black text-red-500/80 tracking-widest italic">주의</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 w-full max-w-7xl mx-auto pb-32 px-4 md:px-8">
          {adultSituations.map((situation) => (
            <PolaroidCard key={situation.code} situation={situation} onClick={() => openModal(situation)} />
          ))}
        </div>

        <footer className="p-24 text-center">
          <p className="text-white/20 text-[10px] uppercase tracking-[0.5em]">별의 기록의 끝</p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-8 px-8 py-3 border border-white/10 text-white/40 text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            맨 위로
          </button>
        </footer>
      </div>

      <AnimatePresence>
        {selectedSituation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSituation(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full flex items-center justify-center">
                <img
                  key={modalImageIndex}
                  src={`https://raw.githubusercontent.com/jeenseeem/HSI/refs/heads/${selectedSituation.code}/${modalImageIndex + 1}.png`}
                  alt={`${selectedSituation.name} ${modalImageIndex + 1}`}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl border border-white/10"
                  referrerPolicy="no-referrer"
                />
                
                {selectedSituation.count > 1 && (
                  <>
                    <button
                      onClick={prevModalImage}
                      className="absolute left-0 md:-left-16 p-4 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
                    >
                      <ChevronLeft size={32} />
                    </button>
                    <button
                      onClick={nextModalImage}
                      className="absolute right-0 md:-right-16 p-4 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
                    >
                      <ChevronRight size={32} />
                    </button>
                  </>
                )}
              </div>
              
              <div className="mt-8 text-center">
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{selectedSituation.name}</h3>
                <p className="text-white/40 uppercase tracking-[0.3em] text-xs mt-2">
                  {modalImageIndex + 1} / {selectedSituation.count}
                </p>
              </div>
              <button 
                onClick={() => setSelectedSituation(null)}
                className="absolute -top-12 right-0 md:-right-12 p-4 text-white/50 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; angle: number; speed: number }[]>([]);
  const [isTouch, setIsTouch] = useState(false);

  React.useEffect(() => {
    // Detect touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseDown = (e: MouseEvent) => {
      setRotation(prev => prev + 1080); // 3 full rotations (360 * 3)
      
      // Generate particles
      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        x: e.clientX,
        y: e.clientY,
        angle: (i * 30) * (Math.PI / 180), // 360 degrees / 12 particles
        speed: 50 + Math.random() * 50, // Random speed between 50 and 100
      }));
      
      setParticles(prev => [...prev, ...newParticles]);
      
      // Clean up particles after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 600);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] text-white flex items-center justify-center mix-blend-difference"
        animate={{
          x: mousePos.x - 16,
          y: mousePos.y - 16,
          rotate: rotation,
        }}
        transition={{
          x: { type: "tween", ease: "linear", duration: 0 },
          y: { type: "tween", ease: "linear", duration: 0 },
          rotate: { duration: 0.6, ease: "easeOut" }
        }}
      >
        <svg width="32" height="32" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42 Z" />
          <circle cx="50" cy="50" r="8" fill="black" />
        </svg>
      </motion.div>
      
      <AnimatePresence>
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ 
              x: p.x, 
              y: p.y,
              opacity: 1,
              scale: 1
            }}
            animate={{ 
              x: p.x + Math.cos(p.angle) * p.speed, 
              y: p.y + Math.sin(p.angle) * p.speed,
              opacity: 0,
              scale: 0
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[9998] mix-blend-difference"
            style={{ marginLeft: '-3px', marginTop: '-3px' }}
          />
        ))}
      </AnimatePresence>
    </>
  );
};

const HISUI_PAGES = [
  { type: 'cover', title: '히스이', subtitle: '늘 혼자 였어', image: 'https://picsum.photos/seed/hisui-cover/600/900' },
  { type: 'page', content: '첫 번째 페이지 - 비어 있음', image: 'https://picsum.photos/seed/hisui-1/600/900' },
  { type: 'page', content: '두 번째 페이지 - 비어 있음', image: 'https://picsum.photos/seed/hisui-2/600/900' },
  { type: 'page', content: '세 번째 페이지 - 비어 있음', image: 'https://picsum.photos/seed/hisui-3/600/900' },
  { type: 'page', content: '네 번째 페이지 - 비어 있음', image: 'https://picsum.photos/seed/hisui-4/600/900' },
  { type: 'back', content: '마지막 페이지', image: 'https://picsum.photos/seed/hisui-back/600/900' }
];

const HisuiView = ({ onOpenIntro, onOpenGallery, onOpenDossier, onOpenHisui, onBack, setBgmIndex }: { onOpenIntro: () => void; onOpenGallery: () => void; onOpenDossier: () => void; onOpenHisui: () => void; onBack: () => void; setBgmIndex: (index: number) => void }) => {
  const [entryStatus, setEntryStatus] = useState<'none' | 'authorized' | 'blocked'>('none');
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    if (entryStatus === 'none') {
      const timer = setTimeout(() => {
        setShowButtons(true);
      }, 2000); // Show buttons after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [entryStatus]);

  const handleAuthorize = () => {
    setEntryStatus('authorized');
    // Find index of 'Child' track
    const childTrackIndex = bgmTracks.findIndex(t => t.name === 'Child');
    if (childTrackIndex !== -1) {
      setBgmIndex(childTrackIndex);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black font-sans overflow-hidden">
      <AnimatePresence>
        {entryStatus === 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Background Image with Blur */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 blur-md"
              style={{ backgroundImage: 'url("https://github.com/jeenseeem/HSI/blob/main/alone.jpg?raw=true")' }}
            />
            <div className="absolute inset-0 bg-black/60" /> {/* Darken overlay */}
            
            <div className="max-w-md w-full text-center space-y-12 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="space-y-4"
              >
                <h2 className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter">늘 혼자 였어</h2>
              </motion.div>

              <AnimatePresence>
                {showButtons && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <button
                      onClick={handleAuthorize}
                      className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-all active:scale-95"
                    >
                      이제 내가 있잖아.
                    </button>
                    <button
                      onClick={onBack}
                      className="px-8 py-4 bg-transparent border border-white/20 text-white/60 font-medium rounded-full hover:bg-white/5 transition-all active:scale-95"
                    >
                      앞으로도 쭉 그럴걸.
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <SkyBackground type="night" />
        <NinjaConstellations />
      </div>

      <CategoryMenu 
        onOpenIntro={onOpenIntro} 
        onOpenDossier={onOpenDossier}
        onOpenGallery={onOpenGallery}
        onOpenHisui={() => {}}
      />

      <div className="relative z-10 w-full h-full overflow-y-auto no-scrollbar">
        {entryStatus === 'authorized' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="w-full max-w-3xl mx-auto flex flex-col items-center pb-32 pt-20"
          >
            <img 
              src="https://github.com/jeenseeem/HSI/blob/main/old_001.png?raw=true" 
              alt="Webtoon Part 1" 
              className="w-full h-auto block"
              referrerPolicy="no-referrer"
            />
            <img 
              src="https://github.com/jeenseeem/HSI/blob/main/old_002.png?raw=true" 
              alt="Webtoon Part 2" 
              className="w-full h-auto block -mt-[1px]" // Negative margin to prevent gaps
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </div>

      {/* Navigation Hint */}
      {entryStatus === 'authorized' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 bg-black/50 px-6 py-2 rounded-full backdrop-blur-md z-50 pointer-events-none"
        >
          <span>↓ 아래로 스크롤하세요</span>
        </motion.div>
      )}
    </div>
  );
};

const bgmTracks = [
  { name: "Old", url: "https://raw.githubusercontent.com/jeenseeem/HSI/refs/heads/bgm/old.mp3" },
  { name: "Daily", url: "https://raw.githubusercontent.com/jeenseeem/HSI/refs/heads/bgm/daily.mp3" },
  { name: "Attack", url: "https://raw.githubusercontent.com/jeenseeem/HSI/refs/heads/bgm/attack.mp3" },
  { name: "Child", url: "https://raw.githubusercontent.com/jeenseeem/HSI/refs/heads/bgm/child.mp3" },
  { name: "Hometown", url: "https://raw.githubusercontent.com/jeenseeem/HSI/refs/heads/bgm/hometown.mp3" },
  { name: "Memory", url: "https://raw.githubusercontent.com/jeenseeem/HSI/refs/heads/bgm/memory.mp3" },
  { name: "Pv", url: "https://raw.githubusercontent.com/jeenseeem/HSI/refs/heads/bgm/pv.mp3" },
  { name: "Sky", url: "https://raw.githubusercontent.com/jeenseeem/HSI/refs/heads/bgm/sky.mp3" },
  { name: "You", url: "https://raw.githubusercontent.com/jeenseeem/HSI/refs/heads/bgm/you.mp3" },
  { name: "Granny", url: "https://raw.githubusercontent.com/jeenseeem/HSI/refs/heads/bgm/granny.mp3" }
];

export default function App() {
  const [view, setView] = useState<ViewState>('intro');
  const [prevView, setPrevView] = useState<ViewState>('intro');
  const [bgmIndex, setBgmIndex] = useState(0);

  const handleSetView = (newView: ViewState) => {
    setPrevView(view);
    setView(newView);
  };
  const [isBgmMuted, setIsBgmMuted] = useState(false);
  const [showTrackList, setShowTrackList] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    if (view !== 'intro' && !isBgmMuted) {
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    } else {
      audio.pause();
    }
  }, [view, isBgmMuted, bgmIndex, volume]);

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(p);
    }
  };

  const handleAudioSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedValue = (x / rect.width) * audioRef.current.duration;
      audioRef.current.currentTime = clickedValue;
    }
  };

  const toggleBgm = () => setIsBgmMuted(!isBgmMuted);
  const nextTrack = () => setBgmIndex((prev) => (prev + 1) % bgmTracks.length);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');
        * {
          cursor: none !important;
        }
      `}</style>
      <CustomCursor />
      
      {/* Global BGM Audio */}
      <audio 
        ref={audioRef} 
        src={bgmTracks[bgmIndex].url} 
        loop 
        onTimeUpdate={handleAudioTimeUpdate}
      />

      {/* Music Controls (Visible outside Intro) */}
      {view !== 'intro' && (
        <div className="fixed top-4 left-4 sm:top-8 sm:left-8 z-[100] flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleBgm}
              className={`p-3 backdrop-blur-md rounded-full border transition-all ${view === 'dossier' ? 'bg-black/5 border-black/10 text-black hover:bg-black/10' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
            >
              {isBgmMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume} 
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className={`w-16 sm:w-24 cursor-pointer ${view === 'dossier' ? 'accent-black' : 'accent-white'}`}
            />
            <div className="relative">
              <button 
                onClick={() => setShowTrackList(!showTrackList)}
                className={`px-4 py-2 backdrop-blur-md rounded-full border text-xs uppercase tracking-widest transition-all ${view === 'dossier' ? 'bg-black/5 border-black/10 text-black hover:bg-black/10' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
              >
                {bgmTracks[bgmIndex].name}
              </button>
              <AnimatePresence>
                {showTrackList && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className={`absolute top-full left-0 mt-2 w-48 overflow-hidden backdrop-blur-md border rounded-xl ${view === 'dossier' ? 'bg-white/90 border-black/10 shadow-lg' : 'bg-black/50 border-white/10'}`}
                  >
                    {bgmTracks.map((track, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setBgmIndex(idx); setShowTrackList(false); }}
                        className={`block w-full text-left px-4 py-2 text-xs uppercase tracking-widest transition-colors ${view === 'dossier' ? (bgmIndex === idx ? 'text-black font-bold' : 'text-black/50 hover:bg-black/5') : (bgmIndex === idx ? 'text-white font-bold' : 'text-white/50 hover:bg-white/10')}`}
                      >
                        {track.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Audio Progress Bar */}
            <div 
              className={`w-24 h-1 rounded-full overflow-hidden cursor-pointer group relative ${view === 'dossier' ? 'bg-black/10' : 'bg-white/10'}`}
              onClick={handleAudioSeek}
            >
              <div 
                className={`h-full transition-all duration-100 ${view === 'dossier' ? 'bg-black' : 'bg-white'}`}
                style={{ width: `${audioProgress}%` }}
              />
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${view === 'dossier' ? 'bg-black/20' : 'bg-white/20'}`} />
            </div>
          </div>
        </div>
      )}

      <main className="w-full min-h-screen bg-black">
        {view === 'intro' ? (
          <IntroPage 
            onComplete={() => handleSetView('dossier')} 
            onOpenGallery={() => handleSetView('gallery')} 
            onOpenDossier={() => handleSetView('dossier')}
            onOpenHisui={() => handleSetView('hisui')}
          />
        ) : view === 'gallery' ? (
          <GalleryView 
            onBack={() => handleSetView('dossier')} 
            onOpenIntro={() => handleSetView('intro')} 
            onOpenDossier={() => handleSetView('dossier')}
            onOpenHisui={() => handleSetView('hisui')}
          />
        ) : view === 'hisui' ? (
          <HisuiView
            onOpenIntro={() => handleSetView('intro')}
            onOpenGallery={() => handleSetView('gallery')}
            onOpenDossier={() => handleSetView('dossier')}
            onOpenHisui={() => handleSetView('hisui')}
            onBack={() => setView(prevView)}
            setBgmIndex={setBgmIndex}
          />
        ) : (
          <DossierView 
            onBack={() => handleSetView('intro')} 
            onOpenIntro={() => handleSetView('intro')}
            onOpenGallery={() => handleSetView('gallery')}
            onOpenHisui={() => handleSetView('hisui')}
          />
        )}
      </main>
    </>
  );
}
