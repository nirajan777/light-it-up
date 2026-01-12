
import React, { useState } from 'react';
import { LightState } from '../types';

interface InteractionOverlayProps {
  state: LightState;
  onDecision: (keepGlowing: boolean) => void;
  onSignIn: (username: string) => void;
}

export const InteractionOverlay: React.FC<InteractionOverlayProps> = ({ state, onDecision, onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailView, setIsEmailView] = useState(false);

  if (state === 'off' || state === 'on') return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onSignIn(email.split('@')[0]);
    }
  };

  const handleGoogleSignIn = () => {
    onSignIn('Google User');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl transition-all duration-1000 px-6">
      <div className="bg-zinc-950/50 border border-white/5 p-10 rounded-[2.5rem] max-w-sm w-full shadow-[0_20px_100px_rgba(0,0,0,0.8)] animate-fade-up">
        
        {state === 'deciding' && (
          <div className="space-y-8 text-center">
            <div className="w-20 h-20 bg-amber-500/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/10">
              <svg className="w-10 h-10 text-amber-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M7.757 7.757l.707-.707" />
              </svg>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-serif italic text-white/90">
                Preserve the Radiance?
              </h2>
              <p className="text-zinc-500 text-sm leading-relaxed px-4 font-light">
                Shall we remember this glow for your next visit, or let the darkness return when you leave?
              </p>
            </div>
            <div className="flex flex-col gap-4 pt-4">
              <button
                onClick={() => onDecision(true)}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold rounded-2xl transition-all active:scale-[0.98] shadow-2xl shadow-amber-500/10 text-lg"
              >
                Stay Illuminated
              </button>
              <button
                onClick={() => onDecision(false)}
                className="w-full py-2 text-zinc-600 hover:text-zinc-400 font-light tracking-widest text-xs uppercase transition-colors"
              >
                Return to Shadow
              </button>
            </div>
          </div>
        )}

        {state === 'signing-in' && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-serif italic text-white/90">
                Welcome Back
              </h2>
              <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-medium">
                Identity for persistence
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoogleSignIn}
                className="w-full py-3.5 px-4 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <svg className="w-5 h-5 opacity-80" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Enter with Google
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-zinc-700 text-[10px] uppercase tracking-widest font-bold">or</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              {!isEmailView ? (
                <button
                  onClick={() => setIsEmailView(true)}
                  className="w-full py-3.5 text-zinc-500 hover:text-white border border-white/5 hover:border-white/10 rounded-2xl transition-all"
                >
                  Continue via Email
                </button>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fade-in">
                  <div className="space-y-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/30 transition-colors placeholder:text-zinc-700"
                    />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-black/50 border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/30 transition-colors placeholder:text-zinc-700"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-zinc-200 hover:bg-white text-zinc-950 font-bold rounded-2xl transition-all active:scale-[0.98]"
                  >
                    Authenticate
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEmailView(false)}
                    className="w-full text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-widest"
                  >
                    Return to Options
                  </button>
                </form>
              )}
            </div>

            <div className="pt-4 text-center">
              <button
                onClick={() => onDecision(false)}
                className="text-zinc-700 hover:text-zinc-500 text-xs transition-colors underline underline-offset-8 decoration-zinc-800"
              >
                I prefer the darkness
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
