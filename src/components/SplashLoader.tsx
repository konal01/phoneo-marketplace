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
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white cursor-pointer select-none transition-opacity duration-300 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading Phoneo"
    >
      {/* Soft ambient glow in brand teal */}
      <div className="absolute w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none animate-pulse"></div>

      {/* Center Logo Only */}
      <div className="relative z-10 flex items-center justify-center animate-logo-pulse">
        <img
          src={PHONEO_LOGO_URL}
          alt="Phoneo Logo"
          className="h-16 sm:h-20 w-auto max-w-[260px] object-contain select-none drop-shadow-sm"
        />
      </div>
    </div>
  );
};
