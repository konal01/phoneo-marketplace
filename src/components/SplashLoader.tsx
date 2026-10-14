import React, { useEffect, useState } from 'react';
import { PHONEO_LOGO_URL } from '../data';

interface SplashLoaderProps {
  onFinished?: () => void;
  durationMs?: number;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({
  onFinished,
  durationMs = 1250,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const finish = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsDone(true);
      if (onFinished) onFinished();
    }, 250);
  };

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, Math.max(0, durationMs - 350));

    const doneTimer = setTimeout(() => {
      setIsDone(true);
      if (onFinished) onFinished();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [durationMs, onFinished]);

  if (isDone) return null;

  return (
    <div
      onClick={finish}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-[#002723] to-[#011413] cursor-pointer select-none transition-all duration-350 ease-out ${
        isFadingOut
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      aria-label="Loading Phoneo"
    >
      {/* Ambient glowing halos in brand teal & cyan */}
      <div className="absolute w-[360px] h-[360px] rounded-full bg-primary/30 blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute w-[260px] h-[260px] rounded-full bg-teal-400/25 blur-[80px] pointer-events-none"></div>

      {/* Center Stage Brand & Logo */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Frosted Glass Logo Card with Breathing Glow */}
        <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-10px_rgba(0,196,180,0.35),0_0_50px_rgba(0,106,97,0.25),inset_0_1px_1px_rgba(255,255,255,1)] border border-white/90 flex flex-col items-center animate-logo-pulse transition-transform">
          <div className="relative flex items-center justify-center">
            <img
              src={PHONEO_LOGO_URL}
              alt="Phoneo Logo"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-md"
            />
          </div>
        </div>

        {/* Brand Tagline */}
        <div className="mt-6 flex flex-col items-center gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-300 font-mono">
            Hyper-Local Re-Commerce
          </span>
          <p className="text-[12px] text-teal-100/70 font-medium">
            Verified Smartphones &bull; Live Retailer Auctions
          </p>
        </div>

        {/* Sleek Animated Progress Bar */}
        <div className="w-48 sm:w-56 h-1.5 bg-white/10 rounded-full overflow-hidden mt-6 border border-white/10 backdrop-blur-sm relative">
          <div className="h-full bg-gradient-to-r from-primary via-teal-400 to-emerald-400 rounded-full animate-load-progress"></div>
        </div>

        {/* Status Hint */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-teal-200/60 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping"></span>
          <span>Loading verified inventory...</span>
        </div>
      </div>
    </div>
  );
};
