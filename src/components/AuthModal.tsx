import React, { useState } from 'react';
import { PHONEO_LOGO_URL } from '../data';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: { name: string; phoneOrEmail?: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName =
      name.trim() ||
      (identifier.includes('@') ? identifier.split('@')[0] : identifier.trim()) ||
      'Ravi Kumar';
    const finalIdentifier = identifier.trim() || '+91 98271 44520';

    onLogin({
      name: finalName,
      phoneOrEmail: finalIdentifier,
    });
    onClose();
  };

  const handleQuickLogin = (quickName: string) => {
    onLogin({
      name: quickName,
      phoneOrEmail: '+91 98271 44520',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white/85 backdrop-blur-2xl text-on-surface rounded-[32px] p-6 sm:p-8 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35),0_0_50px_rgba(0,196,180,0.18),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-white/80 overflow-hidden transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient atmospheric backlight glows */}
        <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-gradient-to-br from-primary-container/30 to-primary/20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-teal-400/20 blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-on-surface-variant hover:text-on-surface flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white/80 transition-all hover:scale-105 active:scale-95 z-10"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center p-2.5 mb-3 shadow-[0_8px_20px_rgba(0,106,97,0.15),inset_0_1px_1px_rgba(255,255,255,1)] border border-white/90">
            <img src={PHONEO_LOGO_URL} alt="Phoneo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-black text-on-surface tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-xs text-on-surface-variant max-w-xs mt-1 leading-relaxed">
            Access verified phone deals, reserve handsets for store trials &amp; track 6-month warranties.
          </p>
        </div>

        {/* Tab Switcher with frosted bevel */}
        <div className="flex items-center p-1 bg-slate-100/70 backdrop-blur-md rounded-2xl mb-5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)] border border-slate-200/50 relative z-10">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-primary shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/5'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white text-primary shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/5'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="flex items-center px-3.5 py-2.5 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.02)] focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 focus-within:shadow-[0_8px_20px_rgba(0,106,97,0.1)] transition-all">
                <span className="material-symbols-outlined text-outline text-[18px] mr-2">person</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ravi Kumar"
                  className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-on-surface uppercase tracking-wider mb-1">
              Mobile Number or Email
            </label>
            <div className="flex items-center px-3.5 py-2.5 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.02)] focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 focus-within:shadow-[0_8px_20px_rgba(0,106,97,0.1)] transition-all">
              <span className="material-symbols-outlined text-outline text-[18px] mr-2">
                phone_iphone
              </span>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Mobile number or name"
                className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-on-surface uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-primary hover:underline cursor-pointer font-semibold">
                Forgot password?
              </span>
            </div>
            <div className="flex items-center px-3.5 py-2.5 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.02)] focus-within:bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15 focus-within:shadow-[0_8px_20px_rgba(0,106,97,0.1)] transition-all">
              <span className="material-symbols-outlined text-outline text-[18px] mr-2">lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-outline hover:text-on-surface ml-1 p-0.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-primary focus:ring-primary"
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary via-[#007f74] to-primary-container hover:brightness-105 text-white font-bold text-sm shadow-[0_12px_28px_-6px_rgba(0,106,97,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:shadow-[0_16px_32px_-6px_rgba(0,106,97,0.55)] transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 mt-2"
          >
            <span>{mode === 'login' ? 'Sign In to Phoneo' : 'Create Free Account'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        {/* One-Click Social Options */}
        <div className="mt-5 pt-4 border-t border-slate-200/60 text-center relative z-10">
          <span className="text-[11px] text-outline uppercase tracking-wider font-bold block mb-3">
            Or continue with
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('Google User')}
              className="py-2.5 px-3 rounded-xl bg-white/80 hover:bg-white backdrop-blur-sm text-on-surface text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200/70 shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('Mobile User')}
              className="py-2.5 px-3 rounded-xl bg-white/80 hover:bg-white backdrop-blur-sm text-on-surface text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200/70 shadow-[0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px] text-primary">sms</span>
              <span>Instant OTP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
